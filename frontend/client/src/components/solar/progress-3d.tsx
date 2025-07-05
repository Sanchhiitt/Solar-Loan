import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MapPin, FileText, CreditCard, Home, Check } from "lucide-react";

interface Progress3DProps {
  currentStep: number;
  totalSteps?: number;
}

const steps = [
  { id: 1, label: "Location", icon: MapPin },
  { id: 2, label: "Electric Bill", icon: FileText },
  { id: 3, label: "Credit Score", icon: CreditCard },
  { id: 4, label: "Roof Info", icon: Home },
];

export function Progress3D({ currentStep, totalSteps = 4 }: Progress3DProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 px-4">
      {/* Progress Track */}
      <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden mb-8">
        <motion.div
          className="h-full bg-gradient-to-r from-[#F59E0B] to-[#10B981] rounded-full relative progress-shimmer"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
      
      {/* Step Indicators */}
      <div className="flex justify-between px-4">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          
          return (
            <motion.div
              key={step.id}
              className={cn(
                "flex flex-col items-center space-y-2 step-indicator",
                isActive && "active",
                isCompleted && "completed"
              )}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className={cn(
                  "w-16 h-16 rounded-full border-2 flex items-center justify-center glass-card shadow-xl",
                  isActive && "border-[#F59E0B] bg-[#F59E0B] text-white",
                  isCompleted && "border-[#10B981] bg-[#10B981] text-white",
                  !isActive && !isCompleted && "border-gray-600 text-gray-400"
                )}
                animate={isActive ? { 
                  scale: [1, 1.1, 1],
                  boxShadow: ["0 0 20px rgba(245, 158, 11, 0.5)", "0 0 40px rgba(245, 158, 11, 0.8)", "0 0 20px rgba(245, 158, 11, 0.5)"]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <StepIcon className="w-6 h-6" />
                )}
              </motion.div>
              <span
                className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  isActive && "text-[#F59E0B]",
                  isCompleted && "text-[#10B981]",
                  !isActive && !isCompleted && "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
