import { useState } from "react";
import ServiceProcess from "./steps/ServiceProcess";
import BusinessImpact from "./steps/BusinessImpact";
import Communication from "./steps/Communication";
import Risk from "./steps/Risk";

const BCPWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    bcpDetails: {
      name: "",
      businessUnit: "",
      subBusinessUnit: "",
    },
    service: {
      name: "",
      description: "",
    },
    processes: [],
    sites: [],
    owners: {
      primary: { name: "", email: "" },
      backup: { name: "", email: "" },
    },
    biaDetails: {
      criticality: {
        timeUnit: "Hours",
        value: "",
      },
      headcount: [],
      dependencies: [],
    },
    notifications: [],
    risks: "",
  });
  const [showSubmitSummary, setShowSubmitSummary] = useState(false);

  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const [errors, setErrors] = useState({});

  const validateStep = (step) => {
    switch (step) {
      case 1: {
        const stepOneErrors = {};
        if (!formData.bcpDetails.name.trim()) {
          stepOneErrors.bcpName = "BCP Name is required";
        }
        if (!formData.service.name.trim()) {
          stepOneErrors.serviceName = "Service Name is required";
        }
        return stepOneErrors;
      }
      default:
        return {};
    }
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    console.log("Form submitted:", formData);
    setShowSubmitSummary(true);
    // Here you would typically send the data to your backend
  };

  // Map system site IDs to human-readable names for summary display
  const siteIdToName = {
    london_hq: "London Headquarters",
    ny_office: "New York Office",
    sg_dc: "Singapore Data Center",
    sydney_ops: "Sydney Operations",
  };

  const getSiteName = (siteId) => siteIdToName[siteId] || siteId;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <ServiceProcess
              formData={formData}
              updateFormData={updateFormData}
            />
            {errors.bcpName && (
              <p className="text-red-500 mt-2">{errors.bcpName}</p>
            )}
            {errors.serviceName && (
              <p className="text-red-500 mt-2">{errors.serviceName}</p>
            )}
          </div>
        );
      case 2:
        return (
          <BusinessImpact formData={formData} updateFormData={updateFormData} />
        );
      case 3:
        return (
          <Communication formData={formData} updateFormData={updateFormData} />
        );
      case 4:
        return <Risk formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6">BCP Interactive Wizard</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Panel */}
          <div className="flex-1 bg-white rounded-lg p-4 md:p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-medium">Step {currentStep} of 4</h2>
            </div>

            {renderStep()}

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Back
                </button>
              )}
              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 sm:ml-auto"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 sm:ml-auto"
                >
                  Submit
                </button>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full lg:w-96 bg-white rounded-lg p-4 md:p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Your Plan So Far</h2>
              <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Edit
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">BCP</h3>
                <p className="text-gray-600">{formData.bcpDetails.name || "Not set"}</p>
                {(formData.bcpDetails.businessUnit || formData.bcpDetails.subBusinessUnit) && (
                  <p className="text-gray-500 text-sm">
                    {[formData.bcpDetails.businessUnit, formData.bcpDetails.subBusinessUnit]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>
                )}
              </div>
              <div>
                <h3 className="font-medium mb-2">Service</h3>
                <p className="text-gray-600">{formData.service.name || "Not set"}</p>
                {formData.service.description && (
                  <p className="text-gray-500 text-sm mt-1">{formData.service.description}</p>
                )}
              </div>
              <div>
                <h3 className="font-medium mb-2">Processes</h3>
                {formData.processes.length > 0 ? (
                  <div className="space-y-3">
                    {formData.processes.map((process, index) => (
                      <div key={index} className="text-gray-700">
                        <p className="font-medium">{process.name || `Process ${index + 1}`}</p>
                        {process.sites?.length > 0 ? (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {process.sites.map((siteId) => (
                              <span
                                key={siteId}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {getSiteName(siteId)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No sites selected</p>
                        )}
                        {(process.owner?.primary?.name || process.owner?.backup?.name) && (
                          <div className="mt-2 space-y-1">
                            {process.owner?.primary?.name && (
                              <p className="text-sm text-gray-600">
                                Primary: {process.owner.primary.name}
                                {process.owner.primary.email ? ` (${process.owner.primary.email})` : ""}
                              </p>
                            )}
                            {process.owner?.backup?.name && (
                              <p className="text-sm text-gray-600">
                                Backup: {process.owner.backup.name}
                                {process.owner.backup.email ? ` (${process.owner.backup.email})` : ""}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No processes added</p>
                )}
              </div>
              <div>
                <h3 className="font-medium mb-2">Sites</h3>
                {formData.processes.some((p) => (p.sites?.length || 0) > 0) ? (
                  <div className="flex flex-wrap gap-1 text-gray-700">
                    {[...new Set(formData.processes.flatMap((p) => p.sites || []))].map((siteId) => (
                      <span
                        key={siteId}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {getSiteName(siteId)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Not set</p>
                )}
              </div>
              <div>
                <h3 className="font-medium mb-2">Owners</h3>
                {formData.processes.some((p) => p.owner?.primary?.name || p.owner?.backup?.name) ? (
                  <div className="space-y-2">
                    {formData.processes.map((p, i) => (
                      (p.owner?.primary?.name || p.owner?.backup?.name) && (
                        <div key={i} className="text-gray-700">
                          <p className="font-medium text-sm">{p.name || `Process ${i + 1}`}</p>
                          {p.owner?.primary?.name && (
                            <p className="text-gray-600 text-sm">
                              Primary: {p.owner.primary.name}
                              {p.owner.primary.email ? ` (${p.owner.primary.email})` : ""}
                            </p>
                          )}
                          {p.owner?.backup?.name && (
                            <p className="text-gray-600 text-sm">
                              Backup: {p.owner.backup.name}
                              {p.owner.backup.email ? ` (${p.owner.backup.email})` : ""}
                            </p>
                          )}
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Not set</p>
                )}
              </div>
              <div>
                <h3 className="font-medium mb-2">Criticality</h3>
                {formData.biaDetails.criticality.value ? (
                  <p className="text-gray-600">
                    {formData.biaDetails.criticality.value} {formData.biaDetails.criticality.timeUnit}
                  </p>
                ) : (
                  <p className="text-gray-600">Not set</p>
                )}
              </div>
              <div>
                <h3 className="font-medium mb-2">Dependencies</h3>
                {formData.biaDetails.dependencies.length > 0 ? (
                  <ul className="text-gray-600 list-disc list-inside">
                    {formData.biaDetails.dependencies.map((d, i) => (
                      <li key={i}>
                        {[d.type, d.description].filter(Boolean).join(": ") || `Dependency ${i + 1}`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">Not set</p>
                )}
              </div>
              <div>
                <h3 className="font-medium mb-2">Risks</h3>
                {formData.risks ? (
                  <p className="text-gray-600 whitespace-pre-wrap break-words">{formData.risks}</p>
                ) : (
                  <p className="text-gray-600">Not set</p>
                )}
              </div>
              <div>
                <h3 className="font-medium mb-2">Notifications</h3>
                {formData.notifications.length > 0 ? (
                  <ul className="text-gray-600 list-disc list-inside">
                    {formData.notifications.map((n, i) => (
                      <li key={i}>{[n.type, n.name, n.email].filter(Boolean).join(" • ") || `Notification ${i + 1}`}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">Not set</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSubmitSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Submission Summary</h3>
              <button
                onClick={() => setShowSubmitSummary(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="p-4 md:p-6 max-h-[70vh] overflow-auto">
              <pre className="text-xs md:text-sm bg-gray-50 p-3 md:p-4 rounded border border-gray-200 overflow-auto">
{JSON.stringify(formData, null, 2)}
              </pre>
            </div>
            <div className="px-6 py-4 border-t flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(JSON.stringify(formData, null, 2));
                }}
                className="px-3 md:px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
              >
                Copy JSON
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(formData, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${formData?.bcpDetails?.name || "bcp"}-submission.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-3 md:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Download JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BCPWizard;
