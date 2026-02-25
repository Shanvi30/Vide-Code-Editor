import { Code2 } from "lucide-react";

interface LoadingStepProps {
  currentStep: number;
  step: number;
  label: string;
}

const LoadingStep: React.FC<LoadingStepProps> = ({ currentStep, step, label }) => {
  const isComplete = currentStep > step;
  const isActive = currentStep === step;

  return (
    <div className="flex items-center gap-3">
      {/* Icon */}
      {isComplete ? (
        <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <svg className="w-2.5 h-2.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ) : isActive ? (
        <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
        </div>
      ) : (
        <div className="w-5 h-5 rounded-full border border-white/10 bg-white/[0.03] shrink-0" />
      )}

      {/* Label */}
      <span className={`text-xs font-medium transition-colors ${isComplete ? "text-emerald-400" :
          isActive ? "text-white" :
            "text-zinc-600"
        }`}>
        {label}
      </span>
    </div>
  );
};

export default LoadingStep;