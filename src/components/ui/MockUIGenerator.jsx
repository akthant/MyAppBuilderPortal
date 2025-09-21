import React, { useState, useEffect } from 'react';

const MockUIGenerator = ({ requirements }) => {
  const [activeRole, setActiveRole] = useState(0);
  const [dynamicFields, setDynamicFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock API service function (inline for artifact compatibility)
  const generateEntityFields = async (entityName, appContext) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock responses based on entity type (this would come from your API service in the real app)
    const mockResponses = {
      student: {
        fields: [
          { name: 'Full Name', type: 'text', required: true, placeholder: 'Enter student full name' },
          { name: 'Email Address', type: 'email', required: true, placeholder: 'student@university.edu' },
          { name: 'Student ID', type: 'text', required: true, placeholder: 'e.g., STU12345' },
          { name: 'Date of Birth', type: 'date', required: false },
          { name: 'Major', type: 'select', required: true, options: ['Computer Science', 'Business', 'Engineering', 'Arts'] },
          { name: 'Phone Number', type: 'tel', required: false, placeholder: '(555) 123-4567' }
        ]
      },
      course: {
        fields: [
          { name: 'Course Title', type: 'text', required: true, placeholder: 'Enter course name' },
          { name: 'Course Code', type: 'text', required: true, placeholder: 'e.g., CS101' },
          { name: 'Credits', type: 'number', required: true, placeholder: '3' },
          { name: 'Description', type: 'textarea', required: false, placeholder: 'Course description...' },
          { name: 'Instructor', type: 'select', required: true, options: ['Dr. Smith', 'Prof. Johnson', 'Dr. Williams'] },
          { name: 'Semester', type: 'select', required: true, options: ['Fall 2024', 'Spring 2025', 'Summer 2025'] }
        ]
      },
      grade: {
        fields: [
          { name: 'Student', type: 'select', required: true, options: ['John Doe', 'Jane Smith', 'Mike Johnson'] },
          { name: 'Course', type: 'select', required: true, options: ['CS101', 'MATH201', 'ENG110'] },
          { name: 'Assignment', type: 'text', required: true, placeholder: 'Assignment name' },
          { name: 'Grade', type: 'select', required: true, options: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'] },
          { name: 'Points Earned', type: 'number', required: false, placeholder: 'Points received' },
          { name: 'Feedback', type: 'textarea', required: false, placeholder: 'Instructor feedback...' }
        ]
      },
      teacher: {
        fields: [
          { name: 'Full Name', type: 'text', required: true, placeholder: 'Enter teacher name' },
          { name: 'Email', type: 'email', required: true, placeholder: 'teacher@university.edu' },
          { name: 'Employee ID', type: 'text', required: true, placeholder: 'e.g., EMP12345' },
          { name: 'Department', type: 'select', required: true, options: ['Computer Science', 'Mathematics', 'Physics', 'Chemistry'] },
          { name: 'Office Hours', type: 'text', required: false, placeholder: 'Mon-Fri 2-4 PM' },
          { name: 'Specialization', type: 'select', required: false, options: ['AI/ML', 'Web Development', 'Data Science', 'Cybersecurity'] }
        ]
      },
      user: {
        fields: [
          { name: 'Username', type: 'text', required: true, placeholder: 'Choose username' },
          { name: 'Email', type: 'email', required: true, placeholder: 'user@example.com' },
          { name: 'Password', type: 'password', required: true, placeholder: 'Secure password' },
          { name: 'Role', type: 'select', required: true, options: ['Admin', 'Teacher', 'Student'] },
          { name: 'Status', type: 'select', required: true, options: ['Active', 'Inactive'] }
        ]
      },
      product: {
        fields: [
          { name: 'Product Name', type: 'text', required: true, placeholder: 'Enter product name' },
          { name: 'Price', type: 'number', required: true, placeholder: '0.00' },
          { name: 'Category', type: 'select', required: true, options: ['Electronics', 'Clothing', 'Books', 'Home'] },
          { name: 'Description', type: 'textarea', required: false, placeholder: 'Product description...' },
          { name: 'SKU', type: 'text', required: true, placeholder: 'e.g., PRD-12345' },
          { name: 'Stock', type: 'number', required: true, placeholder: 'Available units' }
        ]
      },
      order: {
        fields: [
          { name: 'Order ID', type: 'text', required: true, placeholder: 'Auto-generated' },
          { name: 'Customer', type: 'select', required: true, options: ['Select Customer'] },
          { name: 'Order Date', type: 'date', required: true },
          { name: 'Status', type: 'select', required: true, options: ['Pending', 'Processing', 'Shipped', 'Delivered'] },
          { name: 'Total', type: 'number', required: true, placeholder: '0.00' }
        ]
      },
      customer: {
        fields: [
          { name: 'Full Name', type: 'text', required: true, placeholder: 'Customer name' },
          { name: 'Email', type: 'email', required: true, placeholder: 'customer@example.com' },
          { name: 'Phone', type: 'tel', required: true, placeholder: '(555) 123-4567' },
          { name: 'Address', type: 'textarea', required: false, placeholder: 'Customer address...' },
          { name: 'Type', type: 'select', required: true, options: ['Regular', 'Premium', 'VIP'] }
        ]
      }
    };

    const entityKey = entityName.toLowerCase();
    return mockResponses[entityKey] || {
      fields: [
        { name: 'Name', type: 'text', required: true, placeholder: 'Enter name' },
        { name: 'Description', type: 'textarea', required: false, placeholder: 'Enter description...' },
        { name: 'Status', type: 'select', required: true, options: ['Active', 'Inactive'] },
        { name: 'Created Date', type: 'date', required: false }
      ]
    };
  };

  // Generate fields for all entities
  const generateFieldsForAllEntities = async (entities, appName) => {
    setLoading(true);
    setError(null);
    
    try {
      const fieldsData = {};
      
      // Process entities sequentially to show loading progression
      for (const entity of entities) {
        try {
          const response = await generateEntityFields(entity, appName);
          fieldsData[entity.toLowerCase()] = response.fields;
        } catch (entityError) {
          console.error(`Failed to generate fields for ${entity}:`, entityError);
          // Use fallback for this specific entity
          fieldsData[entity.toLowerCase()] = [
            { name: 'Name', type: 'text', required: true, placeholder: 'Enter name' },
            { name: 'Description', type: 'textarea', required: false, placeholder: 'Enter description...' },
            { name: 'Status', type: 'select', options: ['Active', 'Inactive'], required: true }
          ];
        }
      }
      
      setDynamicFields(fieldsData);
    } catch (error) {
      console.error('Error generating fields:', error);
      setError('Failed to generate form fields. Using default fields.');
      
      // Create fallback data for all entities
      const fallbackData = {};
      entities.forEach(entity => {
        fallbackData[entity.toLowerCase()] = [
          { name: 'Name', type: 'text', required: true, placeholder: 'Enter name' },
          { name: 'Description', type: 'textarea', required: false, placeholder: 'Enter description...' }
        ];
      });
      setDynamicFields(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // Generate role-specific features and permissions
  const getRoleFeatures = (role, allFeatures) => {
    if (!allFeatures || !role) return [];
    
    const rolePermissions = {
      admin: allFeatures, // Admin gets all features
      administrator: allFeatures,
      teacher: allFeatures.filter(f => 
        f.toLowerCase().includes('course') || 
        f.toLowerCase().includes('grade') || 
        f.toLowerCase().includes('manage') ||
        f.toLowerCase().includes('view') ||
        f.toLowerCase().includes('add')
      ),
      instructor: allFeatures.filter(f => 
        f.toLowerCase().includes('course') || 
        f.toLowerCase().includes('grade') || 
        f.toLowerCase().includes('teach')
      ),
      student: allFeatures.filter(f => 
        f.toLowerCase().includes('enrol') || 
        f.toLowerCase().includes('view') ||
        f.toLowerCase().includes('register') ||
        f.toLowerCase().includes('submit')
      ),
      manager: allFeatures.filter(f => 
        f.toLowerCase().includes('manage') || 
        f.toLowerCase().includes('view') ||
        f.toLowerCase().includes('report')
      ),
      user: allFeatures.filter(f => 
        f.toLowerCase().includes('view') ||
        f.toLowerCase().includes('read')
      )
    };
    
    return rolePermissions[role.toLowerCase()] || allFeatures;
  };

  // Render form field based on type
  const renderField = (field) => {
    const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-colors";
    const { type, placeholder, options, required } = field;
    
    switch (type) {
      case 'textarea':
        return (
          <textarea
            className={`${baseClasses} resize-none h-20`}
            placeholder={placeholder}
            required={required}
            disabled
          />
        );
      case 'select':
        return (
          <select className={baseClasses} required={required} disabled>
            <option value="">{placeholder || `Select ${field.name}`}</option>
            {options?.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'date':
        return (
          <input
            type="date"
            className={baseClasses}
            required={required}
            disabled
          />
        );
      case 'number':
        return (
          <input
            type="number"
            className={baseClasses}
            placeholder={placeholder}
            required={required}
            disabled
          />
        );
      case 'password':
        return (
          <input
            type="password"
            className={baseClasses}
            placeholder={placeholder}
            required={required}
            disabled
          />
        );
      case 'tel':
        return (
          <input
            type="tel"
            className={baseClasses}
            placeholder={placeholder}
            required={required}
            disabled
          />
        );
      case 'email':
        return (
          <input
            type="email"
            className={baseClasses}
            placeholder={placeholder}
            required={required}
            disabled
          />
        );
      default:
        return (
          <input
            type="text"
            className={baseClasses}
            placeholder={placeholder}
            required={required}
            disabled
          />
        );
    }
  };

  // Generate fields when requirements change
  useEffect(() => {
    if (requirements?.entities?.length > 0) {
      generateFieldsForAllEntities(requirements.entities, requirements.appName);
    }
  }, [requirements]);

  // Reset active role when roles change
  useEffect(() => {
    if (requirements?.roles?.length > 0 && activeRole >= requirements.roles.length) {
      setActiveRole(0);
    }
  }, [requirements?.roles, activeRole]);

  if (!requirements) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No Requirements Yet</h3>
        <p className="text-gray-600">Enter your app requirements above to generate a dynamic mock UI</p>
      </div>
    );
  }

  const currentRole = requirements.roles?.[activeRole] || 'User';
  const roleFeatures = getRoleFeatures(currentRole, requirements.features);

  return (
    <div className="max-w-7xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
        <div>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">
            {requirements.appName}
          </h3>
          <p className="text-gray-600">Generated Mock User Interface</p>
        </div>
        {loading && (
          <div className="flex items-center text-blue-600 bg-blue-50 px-4 py-2 rounded-lg mt-4 sm:mt-0">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-sm font-medium">Generating dynamic fields...</span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-yellow-800">{error}</span>
          </div>
        </div>
      )}
      
      {/* Role-based Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {requirements.roles?.map((role, index) => (
            <button
              key={index}
              onClick={() => setActiveRole(index)}
              className={`py-3 px-4 border-b-2 font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                activeRole === index
                  ? 'border-blue-500 text-blue-600 bg-blue-50 rounded-t-lg'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {role} Dashboard
            </button>
          ))}
        </nav>
      </div>

      {/* Current Role Features */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-200">
        <h4 className="text-xl font-semibold text-blue-900 mb-3">
          {currentRole} Permissions & Features
        </h4>
        <div className="flex flex-wrap gap-3">
          {roleFeatures.length > 0 ? (
            roleFeatures.map((feature, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200 shadow-sm"
              >
                {feature}
              </span>
            ))
          ) : (
            <span className="text-blue-700 italic">No specific features defined for this role</span>
          )}
        </div>
      </div>
      
      {/* Entity Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {requirements.entities?.map((entity, index) => {
          const entityFields = dynamicFields[entity.toLowerCase()] || [];
          
          return (
            <div key={index} className="p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white">
              <div className="flex justify-between items-center mb-5">
                <h4 className="text-xl font-semibold text-gray-800">{entity} Management</h4>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  {entityFields.length} fields
                </span>
              </div>
              
              <div className="space-y-4">
                {entityFields.map((field, fieldIndex) => (
                  <div key={fieldIndex}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.name}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                      {!field.required && <span className="text-gray-400 ml-1 text-xs">(optional)</span>}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
                
                <div className="flex space-x-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors cursor-not-allowed opacity-50 shadow-sm"
                    disabled
                  >
                    Add {entity}
                  </button>
                  <button
                    type="button"
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors cursor-not-allowed opacity-50"
                    disabled
                  >
                    View All
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-full mb-4">
          <h4 className="text-xl font-semibold text-gray-800">Dashboard Overview</h4>
        </div>
        {requirements.entities?.map((entity, index) => (
          <div key={index} className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-medium text-blue-100 text-sm uppercase tracking-wide mb-2">
                  Total {entity}s
                </h5>
                <p className="text-3xl font-bold mb-1">--</p>
                <p className="text-sm text-blue-100">Mock data would appear here</p>
              </div>
              <div className="bg-blue-400 bg-opacity-30 rounded-lg p-3">
                <div className="w-8 h-8 bg-blue-200 rounded opacity-80"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Implementation Note */}
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-amber-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h5 className="font-medium text-amber-800 mb-1">Implementation Note</h5>
            <p className="text-sm text-amber-700">
              This is a mock UI generated from your requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockUIGenerator;