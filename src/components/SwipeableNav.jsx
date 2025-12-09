import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './SwipeableNav.css';

export function SwipeableNav({ items, onNavigate }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const containerRef = useRef(null);

    const cardsPerView = 3;
    const maxIndex = Math.max(0, items.length - cardsPerView);

    const handleTouchStart = (e) => {
        setIsDragging(true);
        setStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        setTranslateX(diff);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);

        // Swipe threshold
        if (Math.abs(translateX) > 100) {
            if (translateX > 0 && currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
            } else if (translateX < 0 && currentIndex < maxIndex) {
                setCurrentIndex(currentIndex + 1);
            }
        }

        setTranslateX(0);
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.clientX);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const currentX = e.clientX;
        const diff = currentX - startX;
        setTranslateX(diff);
    };

    const handleMouseUp = () => {
        setIsDragging(false);

        if (Math.abs(translateX) > 100) {
            if (translateX > 0 && currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
            } else if (translateX < 0 && currentIndex < maxIndex) {
                setCurrentIndex(currentIndex + 1);
            }
        }

        setTranslateX(0);
    };

    const goToPrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const goToNext = () => {
        if (currentIndex < maxIndex) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, translateX]);

    return (
        <div className="swipeable-nav">
            {/* Left Arrow */}
            <button
                className="swipe-arrow swipe-arrow-left"
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                style={{ opacity: currentIndex === 0 ? 0.3 : 1 }}
            >
                <ChevronLeft size={32} />
            </button>

            <div
                className="swipeable-container"
                ref={containerRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                style={{
                    transform: `translateX(calc(-${currentIndex * (100 / items.length)}% + ${translateX}px))`,
                    transition: isDragging ? 'none' : 'transform 0.3s ease'
                }}
            >
                {items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.id}
                            className="swipeable-card"
                            onClick={() => !isDragging && onNavigate(item.id)}
                        >
                            <div className="swipeable-icon">
                                <Icon size={40} />
                            </div>
                            <h3 className="swipeable-title">{item.title}</h3>
                            <p className="swipeable-description">{item.description}</p>
                        </div>
                    );
                })}
            </div>

            {/* Right Arrow */}
            <button
                className="swipe-arrow swipe-arrow-right"
                onClick={goToNext}
                disabled={currentIndex === maxIndex}
                style={{ opacity: currentIndex === maxIndex ? 0.3 : 1 }}
            >
                <ChevronRight size={32} />
            </button>

            {/* Pagination Dots */}
            <div className="swipeable-dots">
                {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                    <button
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
}
