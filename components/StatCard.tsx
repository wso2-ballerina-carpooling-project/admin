
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon?: LucideIcon;
  bgColor: string;
  iconColor: string;
  valueColor: string;
  iconBg?: string;
  customIcon?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  bgColor,
  iconColor,
  valueColor,
  iconBg,
  customIcon
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
          <p className={`text-4xl font-bold ${valueColor}`}>{value}</p>
        </div>
        
        <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center`}>
          {iconBg ? (
            <div className={`w-8 h-8 ${iconBg} rounded-full flex items-center justify-center`}>
              {customIcon ? (
                <span className={`${iconColor} font-bold text-sm`}>{customIcon}</span>
              ) : (
                Icon && <Icon className={`w-5 h-5 ${iconColor}`} />
              )}
            </div>
          ) : (
            Icon && <Icon className={`w-8 h-8 ${iconColor}`} />
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;