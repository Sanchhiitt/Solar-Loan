import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiService, VantageScoreData } from "@/lib/api";

interface StepCreditProps {
  onNext: (data: { creditScore: string }) => void;
  onBack: () => void;
  zipCode?: string; // Add ZIP code to fetch Vantage Score
}

const creditRanges = [
  { value: "excellent", label: "Excellent", range: "750+", color: "text-green-400" },
  { value: "good", label: "Good", range: "670-749", color: "text-blue-400" },
  { value: "fair", label: "Fair", range: "580-669", color: "text-yellow-400" },
  { value: "poor", label: "Poor", range: "Below 580", color: "text-red-400" },
];

export function StepCredit({ onNext, onBack, zipCode }: StepCreditProps) {
  const [selectedScore, setSelectedScore] = useState("");
  const [vantageData, setVantageData] = useState<VantageScoreData | null>(null);
  const [isLoadingVantage, setIsLoadingVantage] = useState(false);

  // Fetch Vantage Score when component mounts and ZIP code is available
  useEffect(() => {
    if (zipCode) {
      const fetchVantageScore = async () => {
        setIsLoadingVantage(true);
        try {
          const data = await apiService.getVantageScore(zipCode);
          setVantageData(data);
        } catch (error) {
          console.warn('Failed to fetch Vantage Score:', error);
          setVantageData(null);
        } finally {
          setIsLoadingVantage(false);
        }
      };

      fetchVantageScore();
    }
  }, [zipCode]);

  const handleSubmit = () => {
    if (selectedScore) {
      onNext({ creditScore: selectedScore });
    }
  };

  // Helper function to get credit band from Vantage Score
  const getCreditBandFromScore = (score: number): string => {
    if (score >= 750) return "Excellent";
    if (score >= 670) return "Good";
    if (score >= 580) return "Fair";
    return "Poor";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">What's your credit score range?</h2>
        <p className="text-gray-300">This helps us find the best financing options for you</p>

        {/* Vantage Score Information */}
        {zipCode && (
          <div className="mt-6">
            {isLoadingVantage ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
              >
                <div className="flex items-center justify-center gap-2 text-blue-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Fetching average credit score for your area...</span>
                </div>
              </motion.div>
            ) : vantageData ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-lg"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-[#F59E0B]" />
                  <span className="text-sm font-medium text-[#F59E0B]">Local Credit Score Info</span>
                </div>
                <p className="text-white text-sm">
                  Average Credit Score in ZIP {zipCode}: <span className="font-bold text-[#F59E0B]">{vantageData.vantage_score}</span>
                </p>
                <p className="text-gray-300 text-xs mt-1">
                  This falls in the <span className="font-medium text-[#F59E0B]">{getCreditBandFromScore(vantageData.vantage_score)}</span> credit range
                </p>
              </motion.div>
            ) : null}
          </div>
        )}
      </div>
      
      {/* Credit Score Options - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {creditRanges.map((credit, index) => (
          <motion.button
            key={credit.value}
            className={`p-4 border rounded-lg text-left transition-all duration-300 ${
              selectedScore === credit.value
                ? "bg-[#F59E0B]/20 border-[#F59E0B] shadow-lg"
                : "bg-white/5 border-white/20 hover:bg-white/10"
            }`}
            onClick={() => setSelectedScore(credit.value)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold text-white">{credit.label}</div>
                <div className={`w-4 h-4 border-2 rounded-full ${
                  selectedScore === credit.value
                    ? "border-[#F59E0B] bg-[#F59E0B]"
                    : "border-gray-400"
                }`} />
              </div>
              <div className={`text-sm ${credit.color} font-medium`}>{credit.range}</div>
            </div>
          </motion.button>
        ))}
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
          disabled={!selectedScore}
          className="flex-1 h-12 bg-gradient-to-r from-[#F59E0B] to-orange-500 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-[#F59E0B] transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
