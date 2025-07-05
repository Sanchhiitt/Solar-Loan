import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, FileText, Upload, CheckCircle, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "./glass-card";
import { useState, useRef, useEffect } from "react";

interface DocumentSubmissionProps {
  financingType: string;
  onBack?: () => void;
  onNext?: () => void;
}

interface DocumentRequirement {
  id: string;
  title: string;
  description: string;
  required: boolean;
  uploaded: boolean;
}

interface UploadedFile {
  file: File;
  preview?: string;
  uploadedAt: Date;
}

function DocumentSubmission({ financingType, onBack, onNext }: DocumentSubmissionProps) {
  const [uploadedFiles, setUploadedFiles] = useState<Map<string, UploadedFile>>(new Map());
  const fileInputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  // Document requirements for each financing type
  const getDocumentRequirements = (type: string): DocumentRequirement[] => {
    const baseRequirements = [
      {
        id: "credit-check",
        title: "Credit Check",
        description: "Soft/hard credit pull authorization",
        required: true,
        uploaded: false
      },
      {
        id: "proof-identity",
        title: "Proof of Identity",
        description: "Government-issued ID (Driver's License, Passport, etc.)",
        required: true,
        uploaded: false
      },
      {
        id: "proof-address",
        title: "Proof of Address",
        description: "Utility bill, bank statement, or lease agreement",
        required: true,
        uploaded: false
      }
    ];

    switch (type) {
      case "PPA Monthly":
        return [
          ...baseRequirements,
          {
            id: "ppa-agreement",
            title: "PPA Agreement",
            description: "Power Purchase Agreement documentation",
            required: true,
            uploaded: false
          }
        ];

      case "Lease":
        return [
          ...baseRequirements,
          {
            id: "lease-agreement",
            title: "Lease Agreement",
            description: "Solar equipment lease agreement",
            required: true,
            uploaded: false
          }
        ];

      case "Loan":
        return [
          ...baseRequirements,
          {
            id: "income-verification",
            title: "Income Verification",
            description: "Pay stubs, tax returns, or employment verification",
            required: true,
            uploaded: false
          },
          {
            id: "loan-agreement",
            title: "Loan Agreement",
            description: "Solar loan documentation",
            required: true,
            uploaded: false
          }
        ];

      case "Cash":
        return [
          {
            id: "proof-identity",
            title: "Proof of Identity",
            description: "Government-issued ID (Driver's License, Passport, etc.)",
            required: true,
            uploaded: false
          },
          {
            id: "proof-address",
            title: "Proof of Address",
            description: "Utility bill, bank statement, or lease agreement",
            required: true,
            uploaded: false
          },
          {
            id: "purchase-agreement",
            title: "Purchase Agreement/Invoice",
            description: "Solar system purchase documentation",
            required: true,
            uploaded: false
          }
        ];

      default:
        return baseRequirements;
    }
  };

  const requirements = getDocumentRequirements(financingType);

  const handleFileSelect = (docId: string) => {
    const input = fileInputRefs.current.get(docId);
    if (input) {
      input.click();
    }
  };

  const handleFileChange = (docId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF, JPEG, or PNG file.');
        // Reset the input
        event.target.value = '';
        return;
      }

      if (file.size > maxSize) {
        alert('File size must be less than 10MB.');
        // Reset the input
        event.target.value = '';
        return;
      }

      // Create preview for images
      let preview: string | undefined;
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      }

      const uploadedFile: UploadedFile = {
        file,
        preview,
        uploadedAt: new Date()
      };

      setUploadedFiles(prev => new Map(prev.set(docId, uploadedFile)));
    }
  };

  const handleRemoveFile = (docId: string) => {
    const uploadedFile = uploadedFiles.get(docId);
    if (uploadedFile?.preview) {
      URL.revokeObjectURL(uploadedFile.preview);
    }
    setUploadedFiles(prev => {
      const newMap = new Map(prev);
      newMap.delete(docId);
      return newMap;
    });
  };

  const handlePreviewFile = (docId: string) => {
    const uploadedFile = uploadedFiles.get(docId);
    if (uploadedFile) {
      if (uploadedFile.preview) {
        // Open image preview in new tab
        window.open(uploadedFile.preview, '_blank');
      } else if (uploadedFile.file.type === 'application/pdf') {
        // Create temporary URL for PDF and open
        const url = URL.createObjectURL(uploadedFile.file);
        window.open(url, '_blank');
        // Clean up URL after a delay
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    }
  };

  const allRequiredDocsUploaded = requirements
    .filter(req => req.required)
    .every(req => uploadedFiles.has(req.id));

  // Cleanup object URLs on component unmount
  useEffect(() => {
    return () => {
      uploadedFiles.forEach((uploadedFile) => {
        if (uploadedFile.preview) {
          URL.revokeObjectURL(uploadedFile.preview);
        }
      });
    };
  }, [uploadedFiles]);

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
          Document Submission
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Upload the required documents for your <span className="text-teal-400 font-semibold">{financingType}</span> option
        </p>
      </div>

      <GlassCard className="p-8 md:p-12 max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-white mb-2">Required Documents</h3>
            <p className="text-gray-300 text-sm">
              Please upload all required documents to proceed with your application
            </p>
          </div>

          <div className="space-y-4">
            {requirements.map((requirement, index) => (
              <motion.div
                key={requirement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={`bg-white/5 backdrop-blur-sm rounded-xl p-6 border transition-colors duration-300 ${
                  uploadedFiles.has(requirement.id)
                    ? "border-green-400/50 bg-green-400/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="mt-1">
                      {uploadedFiles.has(requirement.id) ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : (
                        <FileText className="w-6 h-6 text-teal-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {requirement.title}
                        {requirement.required && (
                          <span className="text-red-400 ml-1">*</span>
                        )}
                      </h4>
                      <p className="text-gray-300 text-sm mb-4">
                        {requirement.description}
                      </p>

                      {/* File Information */}
                      {uploadedFiles.has(requirement.id) && (
                        <div className="bg-white/5 rounded-lg p-3 mt-3 -ml-2">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                uploadedFiles.get(requirement.id)?.file.type === 'application/pdf'
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {uploadedFiles.get(requirement.id)?.file.type === 'application/pdf' ? 'PDF' : 'IMG'}
                              </div>
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="text-white text-sm font-medium truncate">
                                  {uploadedFiles.get(requirement.id)?.file.name}
                                </span>
                                <span className="text-gray-400 text-xs">
                                  {Math.round((uploadedFiles.get(requirement.id)?.file.size || 0) / 1024)} KB •
                                  Uploaded {uploadedFiles.get(requirement.id)?.uploadedAt.toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 flex-shrink-0">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 text-teal-400 border-teal-400 hover:bg-teal-400/10"
                                onClick={() => handleFileSelect(requirement.id)}
                                title="Replace"
                              >
                                <Upload className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 text-red-400 border-red-400 hover:bg-red-400/10"
                                onClick={() => handleRemoveFile(requirement.id)}
                                title="Remove"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    {!uploadedFiles.has(requirement.id) && (
                      <Button
                        size="sm"
                        className="bg-teal-500 hover:bg-teal-600 text-white"
                        onClick={() => handleFileSelect(requirement.id)}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </Button>
                    )}

                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={(el) => {
                        if (el) {
                          fileInputRefs.current.set(requirement.id, el);
                        }
                      }}
                      onChange={(e) => handleFileChange(requirement.id, e)}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Progress indicator */}
          <div className="mt-8 p-4 bg-white/5 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">Progress</span>
              <span className="text-teal-400 font-medium">
                {uploadedFiles.size} / {requirements.filter(req => req.required).length} required documents
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(uploadedFiles.size / requirements.filter(req => req.required).length) * 100}%`
                }}
              />
            </div>
          </div>
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
          Back to Options
        </Button>
        <Button
          className={`flex-1 h-12 ${
            allRequiredDocsUploaded
              ? "bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
              : "bg-gray-600 cursor-not-allowed"
          }`}
          onClick={onNext}
          disabled={!allRequiredDocsUploaded}
        >
          Submit Application
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}

export default DocumentSubmission;
export { DocumentSubmission };
