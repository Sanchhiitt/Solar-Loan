import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepBillProps {
  onNext: (data: { billRange: string }) => void;
  onBack: () => void;
}

export function StepBill({ onNext, onBack }: StepBillProps) {
  const [billAmount, setBillAmount] = useState(150);

  const handleSubmit = () => {
    onNext({ billRange: billAmount.toString() });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">What's your average monthly electricity bill?</h2>
        <p className="text-gray-300">This helps us calculate your potential savings</p>
      </div>

      <div className="space-y-8">
        {/* Bill Amount Display */}
        <div className="text-center">
          <div className="text-5xl font-bold text-[#F59E0B] mb-2">
            ${billAmount}
          </div>
          <div className="text-gray-300">per month</div>
        </div>

        {/* Slider */}
        <div className="relative px-4">
          <input
            type="range"
            min="50"
            max="500"
            step="10"
            value={billAmount}
            onChange={(e) => setBillAmount(parseInt(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #F59E0B 0%, #F59E0B ${((billAmount - 50) / (500 - 50)) * 100}%, rgba(255,255,255,0.2) ${((billAmount - 50) / (500 - 50)) * 100}%, rgba(255,255,255,0.2) 100%)`
            }}
          />

          {/* Slider Labels */}
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>$50</span>
            <span>$500+</span>
          </div>

          {/* Usage Categories */}
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low usage</span>
            <span>Average</span>
            <span>High usage</span>
            <span>Very high</span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4 mt-8">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 h-12 bg-transparent border-white/20 text-white hover:bg-white/10"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1 h-12 bg-gradient-to-r from-[#F59E0B] to-orange-500 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-[#F59E0B] transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <span className="flex items-center justify-center gap-2">
            Continue
            <ArrowRight className="w-5 h-5" />
          </span>
        </Button>
      </div>
    </motion.div>
  );
}
