import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StepRoofProps {
  onNext: (data: { roofSize: string }) => void;
  onBack: () => void;
}

const roofSizeRanges = [
  { value: "small", label: "Small", description: "Under 1,000 sq ft" },
  { value: "medium", label: "Medium", description: "1,000 - 2,000 sq ft" },
  { value: "large", label: "Large", description: "2,000 - 3,000 sq ft" },
  { value: "extra-large", label: "Extra Large", description: "Over 3,000 sq ft" },
];

export function StepRoof({ onNext, onBack }: StepRoofProps) {
  const [roofSize, setRoofSize] = useState("");
  const [customSize, setCustomSize] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const handleSubmit = () => {
    const sizeValue = useCustom ? customSize : roofSize;
    if (sizeValue) {
      onNext({ roofSize: sizeValue });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">What's your roof size?</h2>
        <p className="text-gray-300">This helps us calculate your solar potential</p>
      </div>

      <div className="space-y-6">
        {/* Roof Size Options */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Select your roof size</h3>
          <div className="space-y-3">
            {roofSizeRanges.map((size, index) => (
              <motion.button
                key={size.value}
                className={`w-full p-4 border rounded-lg text-left transition-all duration-300 ${
                  roofSize === size.value && !useCustom
                    ? "bg-[#F59E0B]/20 border-[#F59E0B] shadow-lg"
                    : "bg-white/5 border-white/20 hover:bg-white/10"
                }`}
                onClick={() => {
                  setRoofSize(size.value);
                  setUseCustom(false);
                  setCustomSize("");
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-semibold text-white">{size.label}</div>
                    <div className="text-sm text-gray-400">{size.description}</div>
                  </div>
                  <div className={`w-4 h-4 border-2 rounded-full ${
                    roofSize === size.value && !useCustom
                      ? "border-[#F59E0B] bg-[#F59E0B]"
                      : "border-gray-400"
                  }`} />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Custom Size Input */}
        <div className="border-t border-white/10 pt-6">
          <div className="space-y-3">
            <motion.button
              className={`w-full p-4 border rounded-lg text-left transition-all duration-300 ${
                useCustom
                  ? "bg-[#F59E0B]/20 border-[#F59E0B] shadow-lg"
                  : "bg-white/5 border-white/20 hover:bg-white/10"
              }`}
              onClick={() => {
                setUseCustom(true);
                setRoofSize("");
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: roofSizeRanges.length * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-semibold text-white">Custom Size</div>
                  <div className="text-sm text-gray-400">Enter exact square footage</div>
                </div>
                <div className={`w-4 h-4 border-2 rounded-full ${
                  useCustom
                    ? "border-[#F59E0B] bg-[#F59E0B]"
                    : "border-gray-400"
                }`} />
              </div>
            </motion.button>

            {useCustom && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="customSize" className="text-sm font-medium text-white">
                  Roof Size (square feet)
                </Label>
                <Input
                  id="customSize"
                  type="number"
                  placeholder="e.g., 1500"
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  className="w-full h-12 px-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-300"
                  min="100"
                  max="10000"
                />
              </motion.div>
            )}
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
          disabled={!roofSize && !customSize}
          className="flex-1 h-12 bg-gradient-to-r from-[#F59E0B] to-orange-500 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-[#F59E0B] transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <span className="flex items-center justify-center gap-2">
            Get Results
            <ArrowRight className="w-5 h-5" />
          </span>
        </Button>
      </div>
    </motion.div>
  );
}
