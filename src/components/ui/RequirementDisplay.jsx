import React from 'react';

const RequirementDisplay = ({ requirements }) => {
  if (!requirements) return null;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Extracted Requirements</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-700">App Name:</h4>
          <p className="text-lg">{requirements.appName}</p>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-700">Entities:</h4>
          <div className="flex flex-wrap gap-2 mt-1">
            {requirements.entities?.map((entity, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {entity}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-700">Roles:</h4>
          <div className="flex flex-wrap gap-2 mt-1">
            {requirements.roles?.map((role, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {role}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-700">Features:</h4>
          <ul className="list-disc list-inside mt-1 space-y-1">
            {requirements.features?.map((feature, index) => (
              <li key={index} className="text-gray-600">{feature}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RequirementDisplay;