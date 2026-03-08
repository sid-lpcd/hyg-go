import React, { useState, ReactNode, useRef, useEffect } from "react";
import "./Slider.scss";

interface SliderProps {
  children: ReactNode[];
  className?: string;
  showIndicators?: boolean;
  autoHeight?: boolean;
  initialSlide?: number;
  onSlideChange?: (index: number) => void;
  enableDrag?: boolean;
}

const Slider: React.FC<SliderProps> = ({
  children,
  className = "",
  showIndicators = true,
  autoHeight = false,
  initialSlide = 0,
  onSlideChange,
  enableDrag = false,
}) => {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const nextSlide = () => {
    const nextIndex = (currentSlide + 1) % children.length;
    setCurrentSlide(nextIndex);
    onSlideChange?.(nextIndex);
  };
  
  const prevSlide = () => {
    const prevIndex = (currentSlide - 1 + children.length) % children.length;
    setCurrentSlide(prevIndex);
    onSlideChange?.(prevIndex);
  };
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    onSlideChange?.(index);
  };

  // Drag handlers
  const handleDragStart = (clientX: number) => {
    if (!enableDrag) return;
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
  };

  const handleDragMove = (clientX: number) => {
    if (!enableDrag || !isDragging) return;
    
    const diff = clientX - startX;
    setCurrentX(clientX);
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!enableDrag || !isDragging) return;
    
    const diff = currentX - startX;
    const threshold = 50; // Minimum distance to trigger slide change
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    
    setIsDragging(false);
    setDragOffset(0);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
    handleDragMove(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.cancelable) {
      e.preventDefault();
    }
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isDragging && e.cancelable) {
      e.preventDefault();
    }
    handleDragEnd();
  };

  // Global mouse events for dragging
  useEffect(() => {
    if (!enableDrag) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        handleDragMove(e.clientX);
      }
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        handleDragEnd();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
      document.addEventListener('mouseup', handleGlobalMouseUp, { passive: false });
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, enableDrag]);

  if (children.length === 0) {
    return null;
  }

  const showControls = children.length > 1;
  const translateX = -currentSlide * 100 + (enableDrag && isDragging ? (dragOffset / (sliderRef.current?.offsetWidth || 1)) * 100 : 0);

  return (
    <div className={`slider ${className} ${enableDrag ? 'slider--draggable' : ''}`}>
      <div className="slider__container">
        <div 
          ref={sliderRef}
          className={`slider__slides ${autoHeight ? 'slider__slides--auto-height' : ''} ${isDragging ? 'slider__slides--dragging' : ''}`}
          style={{ transform: `translateX(${translateX}%)` }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {children.map((child, index) => (
            <div key={index} className="slider__slide">
              {child}
            </div>
          ))}
        </div>
      </div>
      
      {/* Slide indicators */}
      {showIndicators && showControls && (
        <div className="slider__indicators">
          {children.map((_, index) => (
            <div
              key={index}
              className={`slider__indicator ${
                index === currentSlide ? 'slider__indicator--active' : ''
              }`}
              onClick={() => goToSlide(index)}
              role="button"
              tabIndex={0}
              aria-label={`Go to slide ${index + 1}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  goToSlide(index);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider;
