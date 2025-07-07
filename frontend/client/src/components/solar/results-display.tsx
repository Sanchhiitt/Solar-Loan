import { motion } from "framer-motion";
import { CheckCircle, Zap, ArrowRight, AlertCircle, XCircle, Home, CreditCard, Calculator, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "./glass-card";
import { useState, useEffect } from "react";
import { apiService, type QualificationResult } from "@/lib/api";

interface ResultsDisplayProps {
  data: {
    zipCode: string;
    billRange: string;
    creditScore: string;
    roofSize: string;
  };
  onRestart: () => void;
  onGetQuote?: () => void;
}

// Helper function to convert roof size names to numbers
const parseRoofSizeToNumber = (roofSize: string): number => {
  switch (roofSize) {
    case 'small':
      return 750;
    case 'medium':
      return 1500;
    case 'large':
      return 2500;
    case 'extra-large':
      return 3500;
    default:
      return 1500; // Default to medium
  }
};

export function ResultsDisplay({ data, onRestart, onGetQuote }: ResultsDisplayProps) {
  const [result, setResult] = useState<QualificationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQualification = async () => {
      try {
        setLoading(true);
        setError(null);

        const qualificationResult = await apiService.checkQualification({
          zipCode: data.zipCode,
          billRange: data.billRange,
          creditScore: data.creditScore,
          roofSize: data.roofSize
        });

        setResult(qualificationResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchQualification();
  }, [data]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F59E0B] mx-auto mb-4"></div>
        <p className="text-white text-lg">Processing your qualification...</p>
      </motion.div>
    );
  }

  if (error || !result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-gray-300 mb-6">{error || 'Failed to process qualification'}</p>
        <Button onClick={onRestart} className="bg-[#F59E0B] hover:bg-orange-500">
          Try Again
        </Button>
      </motion.div>
    );
  }

  // Handle different qualification statuses based on credit band
  const getStatusDisplay = () => {
    const creditScore = data.creditScore.toLowerCase();

    switch (result.status) {
      case 'approved':
        // Excellent and Good credit show "Great News!"
        if (creditScore === 'excellent' || creditScore === 'good') {
          return {
            icon: CheckCircle,
            color: 'bg-green-500',
            title: 'Great News!',
            subtitle: 'You qualify for solar financing'
          };
        } else {
          return {
            icon: CheckCircle,
            color: 'bg-green-500',
            title: 'Approved!',
            subtitle: 'You qualify for solar financing'
          };
        }
      case 'borderline':
        // Fair credit shows "In Review"
        return {
          icon: AlertCircle,
          color: 'bg-yellow-500',
          title: 'In Review',
          subtitle: 'Your application needs additional review'
        };
      case 'not_qualified':
        // Poor credit shows "Not Qualified"
        return {
          icon: XCircle,
          color: 'bg-red-500',
          title: 'Not Qualified',
          subtitle: 'You don\'t qualify at this time'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'bg-gray-500',
          title: 'Status Unknown',
          subtitle: 'Please contact support'
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  // Calculate number of panels (assuming 400W panels)
  const numberOfPanels = result.system_size_kw ? Math.round((result.system_size_kw * 1000) / 400) : 0;

  const resultCards = [
    {
      icon: Zap,
      title: "System Size",
      value: result.system_size_kw ? `${result.system_size_kw} kW` : 'N/A',
      description: "Recommended capacity",
      color: "text-blue-400",
      calculation: `Based on your monthly electricity usage (${result.calculations?.monthly_kwh_usage || 'N/A'} kWh) and roof space constraints (${parseRoofSizeToNumber(data.roofSize)} sq ft). System size is limited by available roof area using 250 sq ft per kW spacing.`
    },
    {
      icon: Home,
      title: "Solar Panels",
      value: numberOfPanels ? `${numberOfPanels} panels` : 'N/A',
      description: "400W panels",
      color: "text-orange-400",
      calculation: `Calculated as: ${result.system_size_kw || 0} kW ÷ 0.4 kW per panel = ${numberOfPanels || 0} panels. Each panel is 400W and approximately 20 sq ft in size.`
    },
    {
      icon: Calculator,
      title: "Total Cost",
      value: result.total_cost ? `$${result.total_cost.toLocaleString()}` : 'N/A',
      description: "Before incentives",
      color: "text-red-400",
      calculation: `Calculated as: ${result.system_size_kw || 0} kW × $2,750 per kW = $${result.total_cost?.toLocaleString() || 'N/A'}. This includes equipment, installation, permits, and warranties.`
    },
    {
      icon: CreditCard,
      title: "Net Cost",
      value: result.net_cost_after_incentives ? `$${result.net_cost_after_incentives.toLocaleString()}` : 'N/A',
      description: "After 30% federal credit",
      color: "text-indigo-400",
      calculation: `Calculated as: $${result.total_cost?.toLocaleString() || 'N/A'} - 30% federal tax credit ($${result.total_cost ? ((result.total_cost * 0.3).toLocaleString()) : 'N/A'}) = $${result.net_cost_after_incentives?.toLocaleString() || 'N/A'}.`
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      {/* Status Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className={`inline-flex items-center justify-center w-20 h-20 ${statusDisplay.color} rounded-full mb-4`}
        >
          <statusDisplay.icon className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">{statusDisplay.title}</h2>
        <p className="text-gray-300 text-lg">{statusDisplay.subtitle}</p>
      </div>

      {/* Results Grid - Show for approved and borderline */}
      {(result.status === 'approved' || result.status === 'borderline') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-visible">
          {resultCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <GlassCard className="p-4 h-full overflow-visible">
                <div className="flex flex-col space-y-3 h-full">
                  <div className="flex items-center space-x-3">
                    <card.icon className={`w-6 h-6 ${card.color} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">{card.title}</div>
                      <div className="text-xs text-gray-400">{card.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-white">{card.value}</div>
                    <div className="relative group">
                      <Info className="w-4 h-4 text-gray-400 hover:text-[#F59E0B] cursor-help transition-colors flex-shrink-0" />
                      <div className="absolute right-0 bottom-8 w-80 p-3 bg-gray-900 border border-gray-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[9999]">
                        <div className="text-sm text-gray-300 leading-relaxed">
                          {card.calculation}
                        </div>
                        <div className="absolute -bottom-2 right-4 w-4 h-4 bg-gray-900 border-r border-b border-gray-700 transform rotate-45"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Summary and Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Summary Card */}
        <GlassCard>
          <h3 className="text-xl font-semibold text-white mb-4">Your Solar Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Location:</span>
              <span className="text-white">
                {result.location ? `${result.location.city}, ${result.location.state}` : data.zipCode}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Monthly Bill Range:</span>
              <span className="text-white">${data.billRange}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Credit Score:</span>
              <span className="text-white capitalize">{data.creditScore}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Roof Size:</span>
              <span className="text-white">
                {isNaN(Number(data.roofSize))
                  ? `${parseRoofSizeToNumber(data.roofSize)} sq ft`
                  : `${data.roofSize} sq ft`
                }
              </span>
            </div>
          </div>

          {(result.status === 'approved' || result.status === 'borderline') && result.lifetime_savings && (
            <div className="border-t border-white/10 mt-4 pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span className="text-gray-300">25-Year Savings:</span>
                <span className="text-green-400">${result.lifetime_savings.toLocaleString()}</span>
              </div>
            </div>
          )}
        </GlassCard>

        {/* Explanation Card */}
        {result.explanation && (
          <GlassCard>
            <h3 className="text-xl font-semibold text-white mb-4">Details</h3>
            <p className="text-gray-300 leading-relaxed">{result.explanation}</p>
          </GlassCard>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={onRestart}
          variant="outline"
          className="flex-1 h-12 bg-transparent border-white/20 text-white hover:bg-white/10"
        >
          Start Over
        </Button>
        {result.status === 'approved' && (
          <Button
            onClick={onGetQuote}
            className="flex-1 h-12 bg-gradient-to-r from-[#10B981] to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-[#10B981] transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span className="flex items-center justify-center gap-2">
              Get Quote
              <ArrowRight className="w-5 h-5" />
            </span>
          </Button>
        )}
        {result.status === 'borderline' && (
          <Button
            onClick={onGetQuote}
            className="flex-1 h-12 bg-gradient-to-r from-[#F59E0B] to-orange-500 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-[#F59E0B] transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span className="flex items-center justify-center gap-2">
              View Options
              <ArrowRight className="w-5 h-5" />
            </span>
          </Button>
        )}
      </div>
    </motion.div>
  );
}
