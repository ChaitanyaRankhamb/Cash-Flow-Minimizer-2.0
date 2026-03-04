import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  onClick: () => void;
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  subtitle,
  onClick,
}: MetricCardProps) {
  return (
    <Card
    onClick={onClick}
      className="
        group relative 
        bg-card 
        border border-border 
        rounded-2xl 
        p-6 
        transition-all duration-300
        hover:shadow-md
        hover:border-primary/40
      "
    >
      <div className="flex items-start justify-between">
        {/* Left Content */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">
            {label}
          </p>

          <p className="text-3xl font-semibold tracking-tight text-foreground">
            {value}
          </p>

          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>

        {/* Icon Container */}
        <div
          className="
            p-3 
            rounded-xl 
            bg-primary/10 
            border border-primary/20 
            transition-all duration-300
            group-hover:bg-primary/15
          "
        >
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>

      {/* Subtle bottom accent line */}
      <div
        className="
          absolute bottom-0 left-0 h-[2px] w-0 
          bg-primary 
          transition-all duration-300
          group-hover:w-full
        "
      />
    </Card>
  );
}
