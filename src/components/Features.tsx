export const features = [
  {
    title: "Modern Design",
    description: "Clean and responsive design that looks great on all devices",
    icon: "💫"
  },
  {
    title: "Fast Performance",
    description: "Optimized for speed with Next.js and React",
    icon: "⚡"
  },
  {
    title: "Easy Updates",
    description: "Simple to maintain and update with modern tools",
    icon: "🔄"
  }
];

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-4 mx-auto">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  );
}