import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './SwipeableNav.css';

export function SwipeableNav({ items, onNavigate }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const containerRef = useRef(null);

    const cardsPerView = 3;
    const maxIndex = Math.max(0, items.length - cardsPerView);

    const scrollToIndex = (index) => {
        if (containerRef.current) {
            const container = containerRef.current;
            const cardWidth = container.scrollWidth / items.length;
            const scrollPosition = index * cardWidth;
            container.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
            setCurrentIndex(index);
        }
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
        setStartX(e.touches[0].clientX);
        if (containerRef.current) {
            setScrollLeft(containerRef.current.scrollLeft);
        }
    };

    const handleTouchMove = (e) => {
        if (!isDragging || !containerRef.current) return;
        const currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        containerRef.current.scrollLeft = scrollLeft + diff;
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        if (containerRef.current) {
            const container = containerRef.current;
            const cardWidth = container.scrollWidth / items.length;
            const newIndex = Math.round(container.scrollLeft / cardWidth);
            scrollToIndex(Math.min(Math.max(0, newIndex), maxIndex));
        }
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.clientX);
        if (containerRef.current) {
            setScrollLeft(containerRef.current.scrollLeft);
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !containerRef.current) return;
        const currentX = e.clientX;
        const diff = startX - currentX;
        containerRef.current.scrollLeft = scrollLeft + diff;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (containerRef.current) {
            const container = containerRef.current;
            const cardWidth = container.scrollWidth / items.length;
            const newIndex = Math.round(container.scrollLeft / cardWidth);
            scrollToIndex(Math.min(Math.max(0, newIndex), maxIndex));
        }
    };

    const goToPrevious = () => {
        if (currentIndex > 0) {
            scrollToIndex(currentIndex - 1);
        }
    };

    const goToNext = () => {
        if (currentIndex < maxIndex) {
            scrollToIndex(currentIndex + 1);
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
    }, [isDragging, scrollLeft, startX]);

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
                        onClick={() => scrollToIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
}
