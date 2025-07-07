import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, Lock, Users, Star, Clock } from "lucide-react";
import { useLocation } from "wouter";

import { Progress3D } from "@/components/solar/progress-3d";
import { GlassCard } from "@/components/solar/glass-card";
import { StepLocation } from "@/components/solar/step-location";
import { StepBill } from "@/components/solar/step-bill";
import { StepCredit } from "@/components/solar/step-credit";
import { StepRoof } from "@/components/solar/step-roof";
import { LoadingAnimation } from "@/components/solar/loading-animation";
import { ResultsDisplay } from "@/components/solar/results-display";
import { FinancingOptions } from "@/components/solar/financing-options";
import { DocumentSubmission } from "@/components/solar/document-submission";
import { ZipCodeData } from "@/lib/api";

interface FormData {
  zipCode?: string;
  billRange?: string;
  creditScore?: string;
  roofSize?: string;
  zipCodeData?: ZipCodeData;
}

export default function SolarChecker() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFinancing, setShowFinancing] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [selectedFinancingType, setSelectedFinancingType] = useState<string>("");
  const [, setLocation] = useLocation();

  const handleNext = (stepData: Partial<FormData>) => {
    const newFormData = { ...formData, ...stepData };
    setFormData(newFormData);

    if (currentStep === 4) {
      // Final step - show loading then results
      setIsLoading(true);
      // Show loading animation for a brief moment before showing results
      setTimeout(() => {
        setIsLoading(false);
        setShowResults(true);
      }, 2000);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setFormData({});
    setShowResults(false);
    setShowFinancing(false);
    setShowDocuments(false);
    setSelectedFinancingType("");
    setIsLoading(false);
  };

  const handleShowFinancing = () => {
    setShowFinancing(true);
  };

  const handleBackToResults = () => {
    setShowFinancing(false);
  };

  const handleProceedToDocuments = (financingType: string) => {
    setSelectedFinancingType(financingType);
    setShowDocuments(true);
    setShowFinancing(false);
  };

  const handleBackToFinancing = () => {
    setShowDocuments(false);
    setShowFinancing(true);
  };

  const handleSubmitApplication = () => {
    // Handle final application submission - redirect to success page
    setLocation(`/success?financingType=${encodeURIComponent(selectedFinancingType)}`);
  };

  const handleGetQuote = () => {
    // Handle final quote request - could redirect to external form or show contact info
    alert("Thank you for your interest! A solar specialist will contact you within 24 hours.");
  };

  const renderCurrentStep = () => {
    if (showDocuments) {
      return (
        <DocumentSubmission
          financingType={selectedFinancingType}
          onNext={handleSubmitApplication}
          onBack={handleBackToFinancing}
        />
      );
    }

    if (showFinancing) {
      return (
        <FinancingOptions
          onNext={handleGetQuote}
          onBack={handleBackToResults}
          onProceed={handleProceedToDocuments}
        />
      );
    }

    if (showResults && formData.zipCode && formData.billRange && formData.creditScore && formData.roofSize) {
      return (
        <ResultsDisplay
          data={{
            zipCode: formData.zipCode,
            billRange: formData.billRange,
            creditScore: formData.creditScore,
            roofSize: formData.roofSize
          }}
          onRestart={handleRestart}
          onGetQuote={handleShowFinancing}
        />
      );
    }

    switch (currentStep) {
      case 1:
        return <StepLocation onNext={handleNext} />;
      case 2:
        return <StepBill onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <StepCredit onNext={handleNext} onBack={handleBack} zipCode={formData.zipCode} />;
      case 4:
        return <StepRoof onNext={handleNext} onBack={handleBack} />;
      default:
        return <StepLocation onNext={handleNext} />;
    }
  };

  return (
    <div className="min-h-screen space-bg overflow-hidden relative">
      {/* Loading Animation */}
      <AnimatePresence>
        {isLoading && <LoadingAnimation />}
      </AnimatePresence>
      
      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Header Section */}
        <motion.header 
          className="text-center pt-8 pb-6 px-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Solar Loan Fit Checker
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 font-light">
            Get Pre-Qualified for Solar in 5 Seconds
          </p>
          
          {/* Safety Badges */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 max-w-4xl mx-auto">
            <motion.div 
              className="flex items-center gap-2 glass-card px-4 py-2 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Shield className="text-[#10B981] w-5 h-5" />
              <span className="text-white font-medium">No SSN Required</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 glass-card px-4 py-2 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Zap className="text-[#10B981] w-5 h-5" />
              <span className="text-white font-medium">Instant Results</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 glass-card px-4 py-2 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Lock className="text-[#10B981] w-5 h-5" />
              <span className="text-white font-medium">100% Secure</span>
            </motion.div>
          </div>
        </motion.header>
        
        {/* Progress Section - Hide on results */}
        <AnimatePresence>
          {!showResults && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Progress3D currentStep={currentStep} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main Form Container */}
        <div className="flex-1 flex items-center justify-center px-4 pb-8">
          <div className={`w-full ${showResults ? 'max-w-7xl' : 'max-w-2xl'} transition-all duration-500`}>
            <GlassCard>
              <AnimatePresence mode="wait">
                {renderCurrentStep()}
              </AnimatePresence>
            </GlassCard>
            
            {/* Trust Indicators - Hide on results */}
            <AnimatePresence>
              {!showResults && (
                <motion.div 
                  className="flex items-center justify-center gap-6 mt-6 text-gray-400 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>50k+ customers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>4.9/5 rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>2 min average</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
