import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'danger' | 'warning' | 'success';
}

const variantClasses = {
  default: 'bg-card border',
  danger: 'gradient-danger text-primary-foreground',
  warning: 'gradient-warning',
  success: 'gradient-primary text-primary-foreground',
};

export default function StatsCard({ title, value, subtitle, icon: Icon, variant = 'default' }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl p-5 shadow-card ${variantClasses[variant]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${variant === 'default' ? 'text-muted-foreground' : 'opacity-80'}`}>{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && <p className={`text-xs mt-1 ${variant === 'default' ? 'text-muted-foreground' : 'opacity-70'}`}>{subtitle}</p>}
        </div>
        <div className={`p-2 rounded-lg ${variant === 'default' ? 'bg-muted' : 'bg-primary-foreground/20'}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}
