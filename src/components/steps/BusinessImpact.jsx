import { useState } from "react";

const BusinessImpact = ({ formData, updateFormData }) => {
  const [showSkip, setShowSkip] = useState(false);

  const handleCriticalityChange = (e) => {
    const { name, value } = e.target;
    updateFormData("biaDetails", {
      ...formData.biaDetails,
      criticality: {
        ...formData.biaDetails.criticality,
        [name]: value,
      },
    });
  };

  // This array would typically come from an API or context in a real application
  const systemLocations = [
    { id: "london_hq", name: "London Headquarters" },
    { id: "ny_office", name: "New York Office" },
    { id: "sg_dc", name: "Singapore Data Center" },
    { id: "sydney_ops", name: "Sydney Operations" },
  ];

  const addDependency = () => {
    updateFormData("biaDetails", {
      ...formData.biaDetails,
      dependencies: [
        ...formData.biaDetails.dependencies,
        { type: "", description: "" },
      ],
    });
  };

  const updateDependency = (index, field, value) => {
    const updatedDependencies = [...formData.biaDetails.dependencies];
    updatedDependencies[index] = {
      ...updatedDependencies[index],
      [field]: value,
    };
    updateFormData("biaDetails", {
      ...formData.biaDetails,
      dependencies: updatedDependencies,
    });
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
        <h3 className="text-lg font-semibold mb-2">Criticality (MTD)</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Time Unit
            </label>
            <select
              name="timeUnit"
              value={formData.biaDetails.criticality.timeUnit}
              onChange={handleCriticalityChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="Hours">Hours</option>
              <option value="Days">Days</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Value
            </label>
            <input
              type="number"
              name="value"
              value={formData.biaDetails.criticality.value}
              onChange={handleCriticalityChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Headcount Requirement</h3>
        <p className="text-sm text-gray-600 mb-2">
          Specify the minimum headcount required for each process at each site
          if the site is disrupted
        </p>
        {formData.processes.map((process, processIndex) => (
          <div
            key={processIndex}
            className="mb-3 border border-gray-200 rounded-lg p-3"
          >
            <h4 className="text-md font-medium text-gray-900 mb-2">
              {process.name || `Process ${processIndex + 1}`}
            </h4>
            {process.sites.map((siteId) => {
              const site = systemLocations?.find((s) => s.id === siteId);
              if (!site) return null;

              return (
                <div key={`${processIndex}-${siteId}`} className="mb-4 ml-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {site.name}
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={
                        formData.biaDetails.headcount[processIndex]?.[siteId] ??
                        ""
                      }
                      onChange={(e) => {
                        const updatedHeadcount = {
                          ...formData.biaDetails.headcount,
                        };
                        if (!updatedHeadcount[processIndex]) {
                          updatedHeadcount[processIndex] = {};
                        }
                        updatedHeadcount[processIndex][siteId] = e.target.value;
                        updateFormData("biaDetails", {
                          ...formData.biaDetails,
                          headcount: updatedHeadcount,
                        });
                      }}
                      className="block w-32 border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="Min. staff"
                    />
                    <span className="text-sm text-gray-500">
                      people required
                    </span>
                  </div>
                </div>
              );
            })}
            {process.sites.length === 0 && (
              <p className="text-sm text-gray-500 ml-4">
                No sites selected for this process. Please add sites in Step 1.
              </p>
            )}
          </div>
        ))}
        {formData.processes.length === 0 && (
          <p className="text-sm text-gray-500">
            No processes added yet. Please add processes in Step 1.
          </p>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Dependencies</h3>
        {formData.biaDetails.dependencies.map((dependency, index) => (
          <div
            key={index}
            className="mb-2 p-3 border border-gray-200 rounded-lg"
          >
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  value={dependency.type}
                  onChange={(e) =>
                    updateDependency(index, "type", e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">Select Type</option>
                  <option value="Upstream">Upstream</option>
                  <option value="IT">IT</option>
                  <option value="Equipment">Equipment</option>
                  <option value="External">External</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  value={dependency.description}
                  onChange={(e) =>
                    updateDependency(index, "description", e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Describe the dependency"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addDependency}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Dependency
        </button>
      </div>
    </div>
  );
};

export default BusinessImpact;
