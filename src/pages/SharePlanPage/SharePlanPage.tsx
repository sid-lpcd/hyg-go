import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  completePlanMediaUpload,
  createPlanMediaUploadIntent,
  getLocationById,
  getPlanById,
  updatePlan,
} from "../../utils/apiHelper";
import { PlanMediaDTO, UpdatePlanRequest } from "../../types/contract";
import { FormLabel, Location, MapMarker, PlanWithDetailedActivities } from "../../types/common";
import Header from "../../components/sections/Header/Header";
import Form from "../../components/base/Form/Form";
import TripPreview from "../../components/sections/TripPreview/TripPreview";
import BackArrowIcon from "../../assets/icons/back-arrow-icon.svg?react";
import { InfinitySpin } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import { getToken } from "../../utils/tokenHelper";
import "./SharePlanPage.scss";

const SharePlanPage: React.FC = () => {
  const navigate = useNavigate();
  
  const { planId } = useParams<{ planId: string }>();

  const [plan, setPlan] = useState<PlanWithDetailedActivities | null>(null);
  const [location, setLocation] = useState<Location | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isMapLoading, setIsMapLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mainImageUrl: "",
    isPublic: false
  });
  const [errorData, setErrorData] = useState({
    title: false,
    description: false
  });
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const formLabels: FormLabel[] = [
    {
      name: "title",
      text: "Trip Title",
      type: "input",
      placeholder: "Enter a catchy title for your trip"
    },
    {
      name: "description", 
      text: "Description",
      type: "textarea",
      placeholder: "Describe what makes this trip special..."
    },
    {
      name: "images",
      text: "Trip Images",
      type: "image",
      placeholder: "Upload photos to showcase your trip",
      multipleImages: true
    }
  ];

  const handleBackClick = () => {
    navigate(-1);
  };

  const fetchPlanDetails = async (): Promise<void> => {
    if (!planId) return;
    
    try {
      const planData = await getPlanById(parseInt(planId), "detail");
      setPlan(planData);
      setFormData({
        title: planData.title || "",
        description: planData.description || "",
        mainImageUrl: planData.mainImageUrl || "",
        isPublic: planData.isPublic || false
      });
    } catch (error) {
      console.error("Error fetching plan details:", error);
      toast.error("Failed to load plan details");
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationDetails = async (): Promise<void> => {
    if (!plan) return;
    
    setIsMapLoading(true);
    try {
      const locationData = await getLocationById(plan.locationId);
      setLocation(locationData);
      console.log(locationData);
    } catch (error) {
      console.error("Error fetching location details:", error);
      toast.error("Failed to load trip location");
    } finally {
      setIsMapLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanDetails();
  }, [planId]);

  useEffect(() => {
    fetchLocationDetails();
  }, [plan]);

  const mapMarkers = useMemo<MapMarker[]>(() => {
    if (!plan) return [];

    return plan.activities
      .map((activity) => ({
        activityId: activity.activityId,
        latitude: activity.latitude!,
        longitude: activity.longitude!,
        category: activity.category,
      }));
  }, [plan]);

  const mapCenter = useMemo<[number, number] | null>(() => {
    const coordinates: Array<{ latitude: number; longitude: number }> = [...mapMarkers];

    if (typeof location?.latitude === "number" && typeof location?.longitude === "number") {
      coordinates.push({
        latitude: location.latitude,
        longitude: location.longitude,
      });
    }

    if (!coordinates.length) return null;

    const avgLat =
      coordinates.reduce((sum, point) => sum + point.latitude, 0) /
      coordinates.length;
    const avgLng =
      coordinates.reduce((sum, point) => sum + point.longitude, 0) /
      coordinates.length;

    return [avgLng, avgLat];
  }, [mapMarkers, location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errorData[name as keyof typeof errorData]) {
      setErrorData(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateAndSubmit();
  };

  const handleFormCancel = () => {
    navigate(-1);
  };

  const validateAndSubmit = () => {
    // Validate required fields
    const newErrorData = {
      title: !formData.title.trim(),
      description: !formData.description.trim()
    };
    
    setErrorData(newErrorData);
    
    // Check if there are any errors
    if (Object.values(newErrorData).some(error => error)) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    handleSaveAndShare();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Limit to 9 images maximum
      const maxImages = 9;
      const currentImageCount = previewImages.length;
      const availableSlots = maxImages - currentImageCount;
      
      if (currentImageCount >= maxImages) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return;
      }
      
      const filesToProcess = Array.from(files).slice(0, availableSlots);
      
      if (files.length > availableSlots) {
        toast.warning(`Only ${availableSlots} more image(s) can be added (max ${maxImages} total)`);
      }
      
      // Combine existing files with new files
      const dt = new DataTransfer();
      if (selectedImages) {
        Array.from(selectedImages).forEach(file => dt.items.add(file));
      }
      filesToProcess.forEach(file => dt.items.add(file));
      setSelectedImages(dt.files);
      
      // Create preview URLs for new files
      const newPreviews: string[] = [];
      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newPreviews.push(event.target.result as string);
            if (newPreviews.length === filesToProcess.length) {
              setPreviewImages(prev => [...prev, ...newPreviews]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const newPreviews = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newPreviews);
    
    if (selectedImages) {
      const dt = new DataTransfer();
      Array.from(selectedImages).forEach((file, i) => {
        if (i !== index) dt.items.add(file);
      });
      setSelectedImages(dt.files);
    }
  };

  const uploadImagesForPlan = async (planIdToUpload: number, files: FileList): Promise<PlanMediaDTO[]> => {
    const uploadedMedia: PlanMediaDTO[] = [];
    const authToken = getToken()?.token;

    for (const file of Array.from(files)) {
      const intent = await createPlanMediaUploadIntent(planIdToUpload, {
        originalName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      });

      const uploadHeaders: Record<string, string> = { ...intent.upload.headers };
      if (intent.upload.url.includes("/local-upload") && authToken) {
        uploadHeaders.Authorization = `Bearer ${authToken}`;
      }

      const uploadRes = await fetch(intent.upload.url, {
        method: intent.upload.method,
        headers: uploadHeaders,
        body: file,
      });

      if (!uploadRes.ok) {
        if (uploadRes.status === 401 || uploadRes.status === 403) {
          throw new Error(`Upload URL expired while uploading "${file.name}". Please try again.`);
        }
        throw new Error(`Failed to upload "${file.name}".`);
      }

      const media = await completePlanMediaUpload(planIdToUpload, intent.media.id);
      uploadedMedia.push(media);
    }

    return uploadedMedia;
  };

  const handleSaveAndShare = async () => {
    if (!planId || !plan) return;

    setSaving(true);
    try {
      const parsedPlanId = parseInt(planId, 10);
      const updateData: UpdatePlanRequest = {
        title: formData.title,
        description: formData.description,
        isPublic: true,
        mainImageUrl: formData.mainImageUrl
      };

      if (selectedImages && selectedImages.length > 0) {
        const uploadedMedia = await uploadImagesForPlan(parsedPlanId, selectedImages);
        const uploadedImageUrls = uploadedMedia
          .map((media) => media.url)
          .filter((url): url is string => Boolean(url));

        if (uploadedImageUrls.length > 0) {
          updateData.mainImageUrl = uploadedImageUrls[0];
        }
      }

      await updatePlan(parsedPlanId, updateData);
      toast.success("Plan shared successfully!");
      
      // Navigate back to itinerary page
      if (planId) {
        navigate(`/plan/${planId}/share`)
      }
      
    } catch (error) {
      console.error("Error updating plan:", error);
      toast.error("Failed to share plan. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loader-overlay">
        <InfinitySpin width="200" color="#ffffff" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="share-plan">
        <Header
          leftElement={
            <BackArrowIcon
              onClick={handleBackClick}
              className="header__icon"
            />
          }
        />
        <div className="share-plan__error">
          <p>Plan not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <Header
        leftElement={
          <BackArrowIcon
            onClick={handleBackClick}
            className="header__icon"
          />
        }
      />
      
      <main className="main main--share-plan">
        <section className="share-plan__header-container">
          <h1 className="share-plan__title">Share Your Trip</h1>
          <p className="share-plan__subtitle">
            Make your trip public so others can discover and book similar experiences
          </p>
        </section>

        <section className="share-plan__form-container">
          <Form
            labels={formLabels}
            formData={formData}
            errorData={errorData}
            handleChange={handleInputChange}
            handleImageUpload={handleImageUpload}
            handleRemoveImage={removeImage}
            previewImages={previewImages}
            showPreviewImages={false}
            cancelButtonText="Cancel"
            submitButtonText={saving ? "Sharing..." : "Share Trip"}
            handleCancel={handleFormCancel}
            handleSubmit={handleFormSubmit}
          />
        </section>

        <TripPreview
          title={formData.title}
          description={formData.description}
          previewImages={previewImages}
          location={location?.name}
          mapMarkers={mapMarkers}
          mapCenter={mapCenter}
          isMapLoading={isMapLoading}
        />
      </main>
    </>
  );
};

export default SharePlanPage;
