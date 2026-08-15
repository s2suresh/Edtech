import React from 'react';
import { SERVICE_CATEGORIES, ServiceCategory } from '../data/servicesConfig';
import { GraduationCap, Sprout, Plane, Car, Briefcase } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="w-8 h-8 text-blue-600" />,
  Sprout: <Sprout className="w-8 h-8 text-green-600" />,
  Plane: <Plane className="w-8 h-8 text-sky-500" />,
  Car: <Car className="w-8 h-8 text-amber-500" />,
  Briefcase: <Briefcase className="w-8 h-8 text-purple-600" />,
};

export const CategorySlider: React.FC = () => {
  const handleClick = (category: ServiceCategory) => {
    if (category.isExternal) {
      window.open(category.targetUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = category.targetUrl;
    }
  };

  return (
    <div className="w-full py-6 overflow-x-auto no-scrollbar">
      <div className="flex space-x-4 px-4 min-w-max justify-center">
        {SERVICE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleClick(cat)}
            className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 w-36 border border-gray-100"
          >
            <div className="p-3 bg-gray-50 rounded-full mb-2">
              {iconMap[cat.iconName]}
            </div>
            <span className="font-semibold text-gray-800 text-sm">{cat.title}</span>
            <span className="text-xs text-gray-500 text-center mt-1 line-clamp-1">
              {cat.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
