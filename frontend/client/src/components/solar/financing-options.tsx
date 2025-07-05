import { motion } from "framer-motion";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "./glass-card";

interface FinancingOptionsProps {
  onBack?: () => void;
  onNext?: () => void;
  onProceed?: (financingType: string) => void;
}

function FinancingOptions({ onBack, onNext, onProceed }: FinancingOptionsProps) {
  const financingOptions = [
    {
      category: "Third Party Ownership",
      options: [
        {
          title: "PPA Monthly",
          benefits: "Hassle-Free Savings + All Maintenance Covered",
          upfrontPayment: "$0 to Little Down",
          monthlyPayment: "Solar Electricity Payment",
          lockedRate: true,
          warranty: "Full Coverage"
        },
        {
          title: "Lease",
          benefits: "Hassle-Free Savings + All Maintenance Covered",
          upfrontPayment: "$0 to Little Down",
          monthlyPayment: "Equipment Lease Payment",
          lockedRate: true,
          warranty: "Full Coverage"
        }
      ]
    },
    {
      category: "System Purchase",
      options: [
        {
          title: "Cash",
          benefits: "Lowest Price + Federal Tax Credit",
          upfrontPayment: "Full System Cost",
          monthlyPayment: "No Monthly Payment",
          lockedRate: true,
          warranty: "Manufacturer's Warranty"
        },
        {
          title: "Loan",
          benefits: "Pay Over Time + Federal Tax Credit",
          upfrontPayment: "$0 to Little Down",
          monthlyPayment: "Loan Payment",
          lockedRate: true,
          warranty: "Manufacturer's Warranty"
        }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Choose Your Solar Financing Option
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Select the financing method that works best for you
        </p>
      </div>

      <GlassCard className="p-8 md:p-12 lg:p-16 max-w-[90rem] mx-auto">
          <div className="space-y-16 lg:space-y-20">
            {financingOptions.map((section) => (
              <div key={section.category}>
                <h3 className="text-2xl font-bold text-white mb-10 lg:mb-12 text-center">
                  {section.category}
                </h3>
                <div className="flex flex-col space-y-8 md:space-y-12">
                  {section.options.map((option) => (
                    <div 
                      key={option.title} 
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                    >
                      <h4 className="text-xl font-bold text-white mb-6 text-center bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                        {option.title}
                      </h4>

                      <div className="space-y-4">
                        {/* Benefits */}
                        <div className="flex flex-col space-y-2 pb-4 border-b border-white/10">
                          <span className="text-teal-400 font-semibold text-sm uppercase tracking-wide">
                            Benefits
                          </span>
                          <span className="text-white text-base leading-relaxed">
                            {option.benefits}
                          </span>
                        </div>

                        {/* Upfront Payment */}
                        <div className="flex justify-between items-center py-3 border-b border-white/10">
                          <span className="text-teal-400 font-semibold text-sm uppercase tracking-wide">
                            Upfront Payment
                          </span>
                          <span className="text-white text-base font-medium text-right">
                            {option.upfrontPayment}
                          </span>
                        </div>

                        {/* Monthly Payment */}
                        <div className="flex justify-between items-center py-3 border-b border-white/10">
                          <span className="text-teal-400 font-semibold text-sm uppercase tracking-wide">
                            Monthly Payment
                          </span>
                          <span className="text-white text-base font-medium text-right">
                            {option.monthlyPayment}
                          </span>
                        </div>

                        {/* Locked Rate */}
                        <div className="flex justify-between items-center py-3 border-b border-white/10">
                          <span className="text-teal-400 font-semibold text-sm uppercase tracking-wide">
                            Locked-In Solar Rate
                          </span>
                          <div className="flex items-center">
                            <Check className="w-5 h-5 text-green-400" />
                            <span className="text-green-400 text-sm ml-2 font-medium">Yes</span>
                          </div>
                        </div>

                        {/* Warranty */}
                        <div className="flex justify-between items-start py-3 border-b border-white/10">
                          <span className="text-teal-400 font-semibold text-sm uppercase tracking-wide">
                            Warranty
                          </span>
                          <div className="text-right">
                            <span className="text-white text-base font-medium">
                              {option.warranty}
                            </span>
                            {option.warranty === "Manufacturer's Warranty" && (
                              <div className="text-xs text-gray-400 mt-1">
                                Available in Select Markets
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Proceed Button */}
                        <div className="pt-6">
                          <Button
                            className="w-full h-12 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold"
                            onClick={() => onProceed?.(option.title)}
                          >
                            Proceed with {option.title}
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 max-w-md mx-auto">
          <Button
            variant="outline"
            className="flex-1 h-12"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Results
          </Button>
          <Button
            className="flex-1 h-12"
            onClick={onNext}
          >
            Get Detailed Quote
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
    </motion.div>
  );
}

export default FinancingOptions;
export { FinancingOptions };
