import { useState } from 'react';
import { ChevronDown, Moon, Waves, Flame, Heart, Zap, Sparkles, CircleDot, Feather, Activity, Globe, Sun, HeartCrack, Star, Accessibility, Shield, Baby, Eye, Brain, Wind, Smile, Sunrise } from 'lucide-react';
import './CategoryList.css';

const iconMap = {
    Moon, Waves, Flame, Heart, Zap, Sparkles, CircleDot, Feather, Activity, Globe, Sun, HeartCrack, Star, Accessibility, Shield, Baby, Eye, Brain, Wind, Smile, Sunrise
};

export function CategoryList({ categories, onSelectFrequency, activeId }) {
    const [expandedCategories, setExpandedCategories] = useState({});

    const toggleCategory = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
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
                                <button
                                    key={item.id}
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
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
