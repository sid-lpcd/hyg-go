import React from "react";
import "./ImageUpload.scss";

interface ImageUploadProps {
  label?: string;
  previewImages: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  multiple?: boolean;
  accept?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label = "Images",
  previewImages,
  onChange,
  onRemoveImage,
  multiple = true,
  accept = "image/*",
  className = "",
}) => {
  return (
    <div className={`image-upload__container ${className}`}>
      {label && (
        <label className="image-upload__label">
          {label}
        </label>
      )}
      
      <div className="image-upload__upload-area">
        <input
          type="file"
          id="image-upload-input"
          multiple={multiple}
          accept={accept}
          onChange={onChange}
          className="image-upload__input"
        />
        <label htmlFor="image-upload-input" className="image-upload__button">
          <div className="image-upload__button-content">
            <span className="image-upload__plus">+</span>
            <span className="image-upload__text">Add Photos</span>
            <small className="image-upload__subtext">Upload photos to showcase your content</small>
          </div>
        </label>
      </div>

      {previewImages.length > 0 && (
        <div className="image-upload__previews">
          {previewImages.map((preview, index) => (
            <div key={index} className="image-upload__preview">
              <img src={preview} alt={`Preview ${index + 1}`} className="image-upload__preview-image" />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="image-upload__remove-button"
                aria-label={`Remove image ${index + 1}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;