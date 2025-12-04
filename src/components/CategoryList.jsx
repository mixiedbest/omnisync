import { useState } from 'react';
import { ChevronDown, Moon, Waves, Flame, Heart, Zap, Sparkles, CircleDot, Feather, Activity, Globe, Sun, HeartCrack, Star, Accessibility, Shield, Baby, Eye, Brain, Wind, Smile, Sunrise, CloudRain } from 'lucide-react';
import './CategoryList.css';

const iconMap = {
    Moon, Waves, Flame, Heart, Zap, Sparkles, CircleDot, Feather, Activity, Globe, Sun, HeartCrack, Star, Accessibility, Shield, Baby, Eye, Brain, Wind, Smile, Sunrise, CloudRain
};

export function CategoryList({ categories, onSelectFrequency, activeId, favorites = [], onToggleFavorite }) {
    const [expandedCategories, setExpandedCategories] = useState({});

    const toggleCategory = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const isFavorited = (itemId) => {
        return favorites.some(f => f.id === itemId);
    };

    return (
        <div className="category-list">
            {categories.map(category => {
                const Icon = iconMap[category.icon];
                const isExpanded = expandedCategories[category.id];

                return (
                    <div key={category.id} className="category-item glass-card">
                        <button
                            className="category-header"
                            onClick={() => toggleCategory(category.id)}
                        >
                            <div className="category-title-group">
                                {Icon && <Icon size={20} className="category-icon" />}
                                <h3 className="category-title">{category.title}</h3>
                            </div>
                            <ChevronDown
                                size={20}
                                className={`chevron ${isExpanded ? 'expanded' : ''} `}
                            />
                        </button>

                        <div className={`frequency-list ${isExpanded ? 'expanded' : ''}`}>
                            {category.items.map(item => (
                                <div key={item.id} className="frequency-item-wrapper">
                                    <button
                                        className={`frequency-item ${activeId === item.id ? 'active' : ''}`}
                                        onClick={() => onSelectFrequency(item)}
                                    >
                                        <div className="frequency-info">
                                            <div className="frequency-title">{item.title}</div>
                                            <div className="frequency-desc">{item.desc}</div>
                                        </div>
                                        <div className="frequency-details">
                                            <div className="beat-hz">{item.beat} Hz</div>
                                            <div className="freq-pair">{item.left} / {item.right}</div>
                                        </div>
                                    </button>
                                    {onToggleFavorite && (
                                        <button
                                            className={`favorite-btn ${isFavorited(item.id) ? 'favorited' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggleFavorite(item);
                                            }}
                                            title={isFavorited(item.id) ? 'Remove from favorites' : 'Add to favorites'}
                                        >
                                            <Heart size={18} fill={isFavorited(item.id) ? 'currentColor' : 'none'} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
