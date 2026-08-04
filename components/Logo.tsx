import Link from "next/link";
import { HandHeart } from "lucide-react";

interface LogoProps {
  showSubtitle?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ showSubtitle = true, className = "", size = "md" }: LogoProps) {
  const containerSizes = {
    sm: "h-8 w-8 rounded-xl",
    md: "h-10 w-10 rounded-2xl",
    lg: "h-12 w-12 rounded-2xl",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <Link href="/" className={`flex items-center gap-2.5 shrink-0 group ${className}`}>
      {/* Icon inside purple rounded square */}
      <span
        className={`flex ${containerSizes[size]} items-center justify-center bg-purple-600 text-white shadow-md shadow-purple-600/20 transition-transform group-hover:scale-105`}
      >
        <HandHeart className={`${iconSizes[size]} stroke-[2.2]`} />
      </span>
      <div>
        <span className={`font-display ${textSizes[size]} font-black tracking-tight text-slate-900`}>
          Donasi <span className="text-purple-600">Ku</span>
        </span>
        {showSubtitle && (
          <p className="text-[10px] font-medium text-slate-400 leading-none mt-0.5">
            Crowdfunding &amp; Re-Use Platform
          </p>
        )}
      </div>
    </Link>
  );
}
