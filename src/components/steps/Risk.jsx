import { useState } from "react";

const Risk = ({ formData, updateFormData }) => {
  const [showSkip, setShowSkip] = useState(false);

  const handleRiskChange = (e) => {
    updateFormData("risks", e.target.value);
  };

  if (showSkip) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600">This step has been skipped.</p>
        <button
          onClick={() => setShowSkip(false)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Return to Step
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button
          onClick={() => setShowSkip(true)}
          className="text-gray-600 hover:text-gray-800 underline"
        >
          Skip this step
        </button>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Risk Assessment</h3>
        <p className="text-gray-600 mb-2">
          Please note any major risks that could affect this service (e.g.,
          power outage, cyber incident, supply issue)
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Risk Details
          </label>
          <textarea
            value={formData.risks}
            onChange={handleRiskChange}
            className="w-full h-32 border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Describe any potential risks and their possible impact..."
          />
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Examples of risks to consider:
            <ul className="list-disc list-inside mt-2">
              <li>Power outages or infrastructure failures</li>
              <li>Cyber security incidents or data breaches</li>
              <li>Supply chain disruptions</li>
              <li>Natural disasters or extreme weather events</li>
              <li>Key personnel unavailability</li>
              <li>Technology system failures</li>
            </ul>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Risk;
