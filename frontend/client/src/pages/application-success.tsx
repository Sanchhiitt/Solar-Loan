import { motion } from "framer-motion";
import { CheckCircle, Home, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/solar/glass-card";
import { useLocation } from "wouter";

export function ApplicationSuccess() {
  const [, setLocation] = useLocation();

  // Get financing type from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const financingType = urlParams.get('financingType') || 'Solar Loan';

  const handleGoHome = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-2xl"
      >
        <GlassCard className="p-8 md:p-12 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Application Submitted Successfully!
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              Thank you! Your <span className="text-teal-400 font-semibold">{financingType}</span> application has been submitted.
            </p>
            <p className="text-gray-300">
              A solar specialist will contact you within <span className="text-teal-400 font-semibold">24 hours</span> to discuss your solar installation options.
            </p>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white/5 rounded-lg p-6 mb-8"
          >
            <h3 className="text-xl font-semibold text-white mb-4">What happens next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-teal-400 font-bold text-sm">1</span>
                </div>
                <p className="text-gray-300">Our team will review your application and documents</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-teal-400 font-bold text-sm">2</span>
                </div>
                <p className="text-gray-300">A solar specialist will contact you within 24 hours</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-teal-400 font-bold text-sm">3</span>
                </div>
                <p className="text-gray-300">Schedule a site assessment and finalize your solar installation</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Need immediate assistance?</h3>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="w-4 h-4 text-teal-400" />
                <span className="text-sm">Call: (555) 123-SOLAR</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4 text-teal-400" />
                <span className="text-sm">Email: support@solarloan.com</span>
              </div>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <Button
              onClick={handleGoHome}
              className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-lg transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Home
            </Button>
          </motion.div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

export default ApplicationSuccess;
