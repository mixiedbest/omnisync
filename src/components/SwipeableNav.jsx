import { useState, useRef, useEffect } from 'react';
import './SwipeableNav.css';

export function SwipeableNav({ items, onNavigate }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const containerRef = useRef(null);

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
            } else if (translateX < 0 && currentIndex < items.length - 1) {
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
            } else if (translateX < 0 && currentIndex < items.length - 1) {
                setCurrentIndex(currentIndex + 1);
            }
        }

        setTranslateX(0);
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
            <div
                className="swipeable-container"
                ref={containerRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                style={{
                    transform: `translateX(calc(-${currentIndex * 100}% + ${translateX}px))`,
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
                                <Icon size={48} />
                            </div>
                            <h3 className="swipeable-title">{item.title}</h3>
                            <p className="swipeable-description">{item.description}</p>
                        </div>
                    );
                })}
            </div>

            {/* Pagination Dots */}
            <div className="swipeable-dots">
                {items.map((_, index) => (
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
