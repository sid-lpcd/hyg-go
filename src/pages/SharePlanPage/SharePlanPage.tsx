import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPlanById, updatePlan } from "../../utils/apiHelper";
import { Plan, UpdatePlanRequest } from "../../types/contract";
import Header from "../../components/sections/Header/Header";
import Button from "../../components/base/Button/Button";
import BackArrowIcon from "../../assets/icons/back-arrow-icon.svg?react";
import ShareIcon from "../../assets/icons/share-icon.svg?react";
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
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedImages(files);
      
      // Create preview URLs
      const previews: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            previews.push(event.target.result as string);
            if (previews.length === files.length) {
              setPreviewImages([...previews]);
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
        rightElement={
          <ShareIcon
            className="header__icon header__icon--share"
          />
        }
      />
      
      <main className="main share-plan">
        <div className="share-plan__container">
          <h1 className="share-plan__title">Share Your Trip</h1>
          <p className="share-plan__subtitle">
            Make your trip public so others can discover and book similar experiences
          </p>

          <form className="share-plan__form">
            <div className="share-plan__form-group">
              <label htmlFor="title" className="share-plan__label">
                Trip Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="share-plan__input"
                placeholder="Enter a catchy title for your trip"
                required
              />
            </div>

            <div className="share-plan__form-group">
              <label htmlFor="description" className="share-plan__label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="share-plan__textarea"
                placeholder="Describe what makes this trip special..."
                rows={4}
              />
            </div>

            <div className="share-plan__form-group">
              <label htmlFor="images" className="share-plan__label">
                Trip Images
              </label>
              <div className="share-plan__image-upload">
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="share-plan__file-input"
                />
                <label htmlFor="images" className="share-plan__file-label">
                  <span>+ Add Photos</span>
                  <small>Upload photos to showcase your trip</small>
                </label>
              </div>

              {previewImages.length > 0 && (
                <div className="share-plan__image-previews">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="share-plan__image-preview">
                      <img src={preview} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="share-plan__remove-image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="share-plan__form-group">
              <div className="share-plan__public-info">
                <div className="share-plan__public-text">
                  <h3>Make Trip Public</h3>
                  <p>Your trip will be visible to other travelers and can be booked by them</p>
                </div>
                <label className="share-plan__switch">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                  />
                  <span className="share-plan__slider"></span>
                </label>
              </div>
            </div>
          </form>

          <div className="share-plan__actions">
            <Button
              classProp="share-plan"
              btnText="Cancel"
              clickHandler={handleBackClick}
            />
            <Button
              classProp="share-plan share-plan--primary"
              btnText={saving ? "Sharing..." : "Share Trip"}
              clickHandler={handleSaveAndShare}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default SharePlanPage;