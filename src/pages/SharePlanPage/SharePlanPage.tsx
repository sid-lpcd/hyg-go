import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPlanById, updatePlan } from "../../utils/apiHelper";
import { Plan, UpdatePlanRequest } from "../../types/contract";
import { FormLabel } from "../../types/common";
import Header from "../../components/sections/Header/Header";
import Form from "../../components/base/Form/Form";
import TripPreview from "../../components/sections/TripPreview/TripPreview";
import BackArrowIcon from "../../assets/icons/back-arrow-icon.svg?react";
import { InfinitySpin } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import "./SharePlanPage.scss";

const SharePlanPage: React.FC = () => {
  const navigate = useNavigate();
  
  const { planId } = useParams<{ planId: string }>();
  
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
      const planData = await getPlanById(parseInt(planId));
      setPlan(planData);
      setFormData({
        title: planData.title || "",
        description: planData.description || "",
        mainImageUrl: planData.mainImageUrl || "",
        isPublic: planData.isPublic || false
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching plan details:", error);
      setLoading(false);
      toast.error("Failed to load plan details");
    }
  };

  useEffect(() => {
    fetchPlanDetails();
  }, [planId]);

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

  const handleSaveAndShare = async () => {
    if (!planId || !plan) return;

    setSaving(true);
    try {
      const updateData: UpdatePlanRequest = {
        title: formData.title,
        description: formData.description,
        isPublic: true, // Always set to public when sharing
        mainImageUrl: formData.mainImageUrl
      };

      // TODO: Handle image upload to server here
      // For now, we're just updating the text fields
      if (selectedImages && selectedImages.length > 0) {
        // In a real implementation, you'd upload the images to a server
        // and get back URLs to store in mainImageUrl and userImagesTrip
        console.log("Images to upload:", selectedImages);
      }

      await updatePlan(parseInt(planId), updateData);
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
        />
      </main>
    </>
  );
};

export default SharePlanPage;