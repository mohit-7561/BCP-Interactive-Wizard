import { useState, useEffect, useRef } from "react";

const ServiceProcess = ({ formData, updateFormData }) => {
  const [processes, setProcesses] = useState(formData.processes || []);
  const [isOpen, setIsOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // In a real application, this would come from an API
  const [systemLocations, setSystemLocations] = useState([
    { id: "london_hq", name: "London Headquarters" },
    { id: "ny_office", name: "New York Office" },
    { id: "sg_dc", name: "Singapore Data Center" },
    { id: "sydney_ops", name: "Sydney Operations" },
  ]);
  const [newSiteName, setNewSiteName] = useState("");
  const [showAddSite, setShowAddSite] = useState(false);

  const handleBCPDetailsChange = (e) => {
    const { name, value } = e.target;
    updateFormData("bcpDetails", {
      ...formData.bcpDetails,
      [name]: value,
    });
  };

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    updateFormData("service", {
      ...formData.service,
      [name]: value,
    });
  };

  const addProcess = () => {
    const newProcess = {
      name: "",
      sites: [],
      owner: {
        primary: { name: "", email: "" },
        backup: { name: "", email: "" },
      },
    };
    setProcesses([...processes, newProcess]);
    updateFormData("processes", [...processes, newProcess]);
  };

  const updateProcess = (index, field, value) => {
    const updatedProcesses = [...processes];
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      updatedProcesses[index][parent][child] = value;
    } else {
      updatedProcesses[index][field] = value;
    }
    setProcesses(updatedProcesses);
    updateFormData("processes", updatedProcesses);
  };

  const addNewSite = () => {
    if (newSiteName.trim()) {
      // Create a URL-friendly ID from the site name
      const siteId = newSiteName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_");

      // Check if site with same name or ID already exists
      if (
        systemLocations.some(
          (site) =>
            site.name.toLowerCase() === newSiteName.trim().toLowerCase() ||
            site.id === siteId
        )
      ) {
        alert("A site with this name already exists");
        return;
      }

      const newSite = { id: siteId, name: newSiteName.trim() };
      setSystemLocations([...systemLocations, newSite]);
      setNewSiteName("");
      setShowAddSite(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">BCP Details</h3>
        <div className="grid grid-cols-1 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name of BCP <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.bcpDetails.name}
              onChange={handleBCPDetailsChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Business Unit
            </label>
            <input
              type="text"
              name="businessUnit"
              value={formData.bcpDetails.businessUnit}
              onChange={handleBCPDetailsChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sub-Business Unit
            </label>
            <input
              type="text"
              name="subBusinessUnit"
              value={formData.bcpDetails.subBusinessUnit}
              onChange={handleBCPDetailsChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Service</h3>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Service Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.service.name}
              onChange={handleServiceChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.service.description}
              onChange={handleServiceChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows="3"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Processes</h3>
        {processes.map((process, index) => (
          <div
            key={index}
            className="mb-3 p-3 border border-gray-200 rounded-lg"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Process Name
                </label>
                <input
                  type="text"
                  value={process.name}
                  onChange={(e) => updateProcess(index, "name", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sites
                </label>
                <div className="space-y-2">
                  <div className="relative" ref={dropdownRef}>
                    <div
                      className="mt-1 relative block w-full border border-gray-300 rounded-md shadow-sm p-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onClick={() => setIsOpen(index)}
                    >
                      <div className="flex flex-wrap gap-1">
                        {process.sites.length > 0 ? (
                          process.sites.map((siteId) => {
                            const site = systemLocations.find(
                              (s) => s.id === siteId
                            );
                            return site ? (
                              <span
                                key={site.id}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {site.name}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newSites = process.sites.filter(
                                      (id) => id !== site.id
                                    );
                                    updateProcess(index, "sites", newSites);
                                  }}
                                  className="ml-1 flex-shrink-0 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-600 hover:bg-blue-200 hover:text-blue-900 focus:outline-none"
                                >
                                  ×
                                </button>
                              </span>
                            ) : null;
                          })
                        ) : (
                          <span className="text-gray-500">Select sites...</span>
                        )}
                      </div>
                    </div>

                    {isOpen === index && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        <div className="sticky top-0 bg-white p-2 border-b">
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Search sites..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        {systemLocations
                          .filter((site) =>
                            site.name
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          )
                          .map((site) => (
                            <div
                              key={site.id}
                              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 ${
                                process.sites.includes(site.id)
                                  ? "bg-blue-50"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                const newSites = process.sites.includes(site.id)
                                  ? process.sites.filter((id) => id !== site.id)
                                  : [...process.sites, site.id];
                                updateProcess(index, "sites", newSites);
                              }}
                            >
                              <div className="flex items-center">
                                <span className="block truncate mr-2">
                                  {site.name}
                                </span>
                                {process.sites.includes(site.id) && (
                                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                                    <svg
                                      className="h-5 w-5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        <div className="sticky bottom-0 bg-white p-2 border-t">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAddSite(true);
                              setIsOpen(null);
                            }}
                            className="w-full text-left text-sm text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md hover:bg-blue-50"
                          >
                            + Add New Site
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {showAddSite && (
                    <div className="mt-2 p-3 border border-gray-200 rounded-md bg-gray-50">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Add New Site
                      </h4>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={newSiteName}
                          onChange={(e) => setNewSiteName(e.target.value)}
                          placeholder="Enter site name"
                          className="block flex-1 border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={addNewSite}
                          className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddSite(false);
                            setNewSiteName("");
                          }}
                          className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Primary Owner
                  </h4>
                  <input
                    type="text"
                    placeholder="Name"
                    value={process.owner.primary.name}
                    onChange={(e) =>
                      updateProcess(index, "owner.primary.name", e.target.value)
                    }
                    className="mb-2 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={process.owner.primary.email}
                    onChange={(e) =>
                      updateProcess(
                        index,
                        "owner.primary.email",
                        e.target.value
                      )
                    }
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Backup Owner
                  </h4>
                  <input
                    type="text"
                    placeholder="Name"
                    value={process.owner.backup.name}
                    onChange={(e) =>
                      updateProcess(index, "owner.backup.name", e.target.value)
                    }
                    className="mb-2 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={process.owner.backup.email}
                    onChange={(e) =>
                      updateProcess(index, "owner.backup.email", e.target.value)
                    }
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addProcess}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Process
        </button>
      </div>
    </div>
  );
};

export default ServiceProcess;
