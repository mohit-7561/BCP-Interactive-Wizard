const Communication = ({ formData, updateFormData }) => {
  const addNotification = () => {
    updateFormData("notifications", [
      ...formData.notifications,
      { name: "", email: "", type: "individual" },
    ]);
  };

  const updateNotification = (index, field, value) => {
    const updatedNotifications = [...formData.notifications];
    updatedNotifications[index] = {
      ...updatedNotifications[index],
      [field]: value,
    };
    updateFormData("notifications", updatedNotifications);
  };

  const removeNotification = (index) => {
    const updatedNotifications = formData.notifications.filter(
      (_, i) => i !== index
    );
    updateFormData("notifications", updatedNotifications);
  };

  return (
    <div className="space-y-3">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Disruption Notifications</h3>
        <p className="text-gray-600 mb-2">
          Who should be notified if this service is disrupted?
        </p>

        {formData.notifications.map((notification, index) => (
          <div
            key={index}
            className="mb-2 p-3 border border-gray-200 rounded-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  value={notification.type}
                  onChange={(e) =>
                    updateNotification(index, "type", e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="individual">Individual</option>
                  <option value="group">Group</option>
                  <option value="distribution">Distribution List</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={notification.name}
                  onChange={(e) =>
                    updateNotification(index, "name", e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder={
                    notification.type === "individual"
                      ? "Enter person name"
                      : notification.type === "group"
                      ? "Enter group name"
                      : "Enter distribution list name"
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={notification.email}
                  onChange={(e) =>
                    updateNotification(index, "email", e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeNotification(index)}
              className="mt-2 text-red-600 hover:text-red-800 text-sm"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addNotification}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Notification
        </button>
      </div>
    </div>
  );
};

export default Communication;
