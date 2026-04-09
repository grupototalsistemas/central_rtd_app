import React from "react";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
}) => {
  return (
    <div
      className={`dashboard-card-surface ${className}`}
    >
      {/* Card Header */}
      <div className="px-6 py-5">
        <h3 className="text-base font-medium text-(--cor-texto) dark:text-(--dark-cor-texto)">
          {title}
        </h3>
        {desc && (
          <p className="notification-dropdown-muted-text mt-1 text-sm">
            {desc}
          </p>
        )}
      </div>

      {/* Card Body */}
      <div className="rounded-b-2xl p-4 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
