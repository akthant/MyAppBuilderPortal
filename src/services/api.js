// src/services/api.js
const OPENROUTER_API_URL = import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';
const SITE_NAME = import.meta.env.VITE_SITE_NAME || 'Mini AI App Builder Portal';

// Helper function to make OpenRouter API calls
const callOpenRouterAPI = async (prompt, maxTokens = 500) => {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': SITE_URL,
        'X-Title': SITE_NAME,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenRouter API call failed:', error);
    throw error;
  }
};

// Helper function to parse JSON response with fallback
const parseAIResponse = (aiResponse, fallbackData) => {
  try {
    // Remove any markdown code blocks if present
    const cleanedResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanedResponse);
  } catch (parseError) {
    console.error('Failed to parse AI response:', aiResponse);
    console.error('Parse error:', parseError);
    return fallbackData;
  }
};

// Function to parse requirements using AI
export const submitRequirements = async (description) => {
  const prompt = `
You are an expert software analyst. Analyze the following app description and extract structured requirements in JSON format.

App Description: "${description}"

Please respond with ONLY a valid JSON object containing:
{
  "appName": "Short descriptive name for the app",
  "entities": ["Entity1", "Entity2", "Entity3"],
  "roles": ["Role1", "Role2", "Role3"],
  "features": ["Feature1", "Feature2", "Feature3"]
}

Rules:
- Extract 3-5 main entities (data objects like User, Product, Order)
- Extract 2-4 user roles (like Admin, Customer, Manager)
- Extract 4-8 key features (actions users can perform)
- Keep names simple and clear
- Respond with ONLY the JSON, no additional text

Example for "I want a blog app where users write posts and admins moderate":
{
  "appName": "Blog Platform",
  "entities": ["User", "Post", "Comment"],
  "roles": ["Admin", "Author", "Reader"],
  "features": ["Write posts", "Moderate content", "Read posts", "Leave comments"]
}
`;

  const fallbackRequirements = {
    appName: "Generated App",
    entities: ["User", "Item", "Record"],
    roles: ["Admin", "User"],
    features: ["Create", "Read", "Update", "Delete"]
  };

  try {
    const aiResponse = await callOpenRouterAPI(prompt, 500);
    return parseAIResponse(aiResponse, fallbackRequirements);
  } catch (error) {
    console.error('Error calling OpenRouter API for requirements:', error);
    
    // Return fallback with some context from the description
    const words = description.toLowerCase().split(' ');
    let detectedEntities = ['User'];
    let detectedRoles = ['Admin', 'User'];
    
    // Simple keyword detection for better fallbacks
    if (words.includes('student') || words.includes('course')) {
      detectedEntities = ['Student', 'Course', 'Grade'];
      detectedRoles = ['Admin', 'Teacher', 'Student'];
    } else if (words.includes('product') || words.includes('shop') || words.includes('store')) {
      detectedEntities = ['Product', 'Order', 'Customer'];
      detectedRoles = ['Admin', 'Customer', 'Manager'];
    } else if (words.includes('blog') || words.includes('post')) {
      detectedEntities = ['User', 'Post', 'Comment'];
      detectedRoles = ['Admin', 'Author', 'Reader'];
    }
    
    return {
      ...fallbackRequirements,
      entities: detectedEntities,
      roles: detectedRoles
    };
  }
};

// Function to generate entity fields using AI
export const generateEntityFields = async (entityName, appContext) => {
  const prompt = `
Generate appropriate form fields for a "${entityName}" entity in a "${appContext}" application.

Respond with ONLY a valid JSON object:
{
  "fields": [
    {
      "name": "Field Name",
      "type": "text|email|number|date|select|textarea|password|tel",
      "required": true|false,
      "options": ["option1", "option2"],
      "placeholder": "Optional placeholder text"
    }
  ]
}

Rules:
- Generate 4-6 relevant fields for the entity
- Use appropriate field types (email for email fields, number for quantities, etc.)
- Mark essential fields as required (true), optional fields as false
- For select fields, provide 3-5 realistic options
- Keep field names user-friendly and professional
- Add helpful placeholder text where appropriate

Examples:

For "Student" in a "Course Management" app:
{
  "fields": [
    {"name": "Full Name", "type": "text", "required": true, "placeholder": "Enter student's full name"},
    {"name": "Email", "type": "email", "required": true, "placeholder": "student@university.edu"},
    {"name": "Student ID", "type": "text", "required": true, "placeholder": "e.g., STU12345"},
    {"name": "Year Level", "type": "select", "required": true, "options": ["Freshman", "Sophomore", "Junior", "Senior"]},
    {"name": "Phone Number", "type": "tel", "required": false, "placeholder": "(555) 123-4567"},
    {"name": "Major", "type": "select", "required": false, "options": ["Computer Science", "Business", "Engineering", "Arts", "Sciences"]}
  ]
}

For "Product" in an "E-commerce" app:
{
  "fields": [
    {"name": "Product Name", "type": "text", "required": true, "placeholder": "Enter product name"},
    {"name": "Price", "type": "number", "required": true, "placeholder": "0.00"},
    {"name": "Category", "type": "select", "required": true, "options": ["Electronics", "Clothing", "Books", "Home", "Sports"]},
    {"name": "Description", "type": "textarea", "required": false, "placeholder": "Describe the product features..."},
    {"name": "SKU", "type": "text", "required": true, "placeholder": "e.g., PRD-12345"},
    {"name": "Stock Quantity", "type": "number", "required": true, "placeholder": "Available units"}
  ]
}
`;

  const fallbackFields = getFallbackFields(entityName);

  try {
    const aiResponse = await callOpenRouterAPI(prompt, 400);
    const parsedResponse = parseAIResponse(aiResponse, { fields: fallbackFields });
    
    // Validate that the response has the expected structure
    if (!parsedResponse.fields || !Array.isArray(parsedResponse.fields)) {
      console.warn('AI response missing fields array, using fallback');
      return { fields: fallbackFields };
    }
    
    // Validate each field has required properties
    const validatedFields = parsedResponse.fields.map(field => ({
      name: field.name || 'Unknown Field',
      type: field.type || 'text',
      required: field.required !== undefined ? field.required : false,
      options: field.options || undefined,
      placeholder: field.placeholder || `Enter ${(field.name || 'value').toLowerCase()}`
    }));
    
    return { fields: validatedFields };
  } catch (error) {
    console.error('Error generating fields for', entityName, ':', error);
    return { fields: fallbackFields };
  }
};

// Fallback field generation for when AI fails or for testing
const getFallbackFields = (entityName) => {
  const fallbackFieldsMap = {
    student: [
      { name: 'Full Name', type: 'text', required: true, placeholder: 'Enter student full name' },
      { name: 'Email Address', type: 'email', required: true, placeholder: 'student@university.edu' },
      { name: 'Student ID', type: 'text', required: true, placeholder: 'e.g., STU12345' },
      { name: 'Date of Birth', type: 'date', required: false },
      { name: 'Phone Number', type: 'tel', required: false, placeholder: '(555) 123-4567' },
      { name: 'Major', type: 'select', required: true, options: ['Computer Science', 'Business', 'Engineering', 'Arts', 'Sciences'] }
    ],
    course: [
      { name: 'Course Title', type: 'text', required: true, placeholder: 'Enter course name' },
      { name: 'Course Code', type: 'text', required: true, placeholder: 'e.g., CS101' },
      { name: 'Credits', type: 'number', required: true, placeholder: '3' },
      { name: 'Description', type: 'textarea', required: false, placeholder: 'Course description...' },
      { name: 'Prerequisites', type: 'text', required: false, placeholder: 'Required previous courses' },
      { name: 'Semester', type: 'select', required: true, options: ['Fall', 'Spring', 'Summer'] }
    ],
    grade: [
      { name: 'Student', type: 'select', required: true, options: ['Select Student'] },
      { name: 'Course', type: 'select', required: true, options: ['Select Course'] },
      { name: 'Grade', type: 'select', required: true, options: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'] },
      { name: 'Assignment Type', type: 'select', required: true, options: ['Exam', 'Assignment', 'Project', 'Quiz'] },
      { name: 'Points Earned', type: 'number', required: false, placeholder: 'Points received' },
      { name: 'Total Points', type: 'number', required: false, placeholder: 'Total possible points' }
    ],
    teacher: [
      { name: 'Full Name', type: 'text', required: true, placeholder: 'Enter teacher full name' },
      { name: 'Email', type: 'email', required: true, placeholder: 'teacher@university.edu' },
      { name: 'Employee ID', type: 'text', required: true, placeholder: 'e.g., EMP12345' },
      { name: 'Department', type: 'select', required: true, options: ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'] },
      { name: 'Office Hours', type: 'text', required: false, placeholder: 'Mon-Fri 2-4 PM' },
      { name: 'Phone', type: 'tel', required: false, placeholder: '(555) 123-4567' }
    ],
    user: [
      { name: 'Username', type: 'text', required: true, placeholder: 'Choose a username' },
      { name: 'Email', type: 'email', required: true, placeholder: 'user@example.com' },
      { name: 'Password', type: 'password', required: true, placeholder: 'Secure password' },
      { name: 'Role', type: 'select', required: true, options: ['Admin', 'Teacher', 'Student', 'Manager'] },
      { name: 'Status', type: 'select', required: true, options: ['Active', 'Inactive', 'Pending'] },
      { name: 'Department', type: 'text', required: false, placeholder: 'User department' }
    ],
    product: [
      { name: 'Product Name', type: 'text', required: true, placeholder: 'Enter product name' },
      { name: 'Price', type: 'number', required: true, placeholder: '0.00' },
      { name: 'Category', type: 'select', required: true, options: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'] },
      { name: 'Description', type: 'textarea', required: false, placeholder: 'Product description...' },
      { name: 'SKU', type: 'text', required: true, placeholder: 'e.g., PRD-12345' },
      { name: 'Stock Quantity', type: 'number', required: true, placeholder: 'Available units' }
    ],
    order: [
      { name: 'Order ID', type: 'text', required: true, placeholder: 'Auto-generated' },
      { name: 'Customer', type: 'select', required: true, options: ['Select Customer'] },
      { name: 'Order Date', type: 'date', required: true },
      { name: 'Status', type: 'select', required: true, options: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] },
      { name: 'Total Amount', type: 'number', required: true, placeholder: '0.00' },
      { name: 'Notes', type: 'textarea', required: false, placeholder: 'Order notes...' }
    ],
    customer: [
      { name: 'Full Name', type: 'text', required: true, placeholder: 'Customer full name' },
      { name: 'Email', type: 'email', required: true, placeholder: 'customer@example.com' },
      { name: 'Phone', type: 'tel', required: true, placeholder: '(555) 123-4567' },
      { name: 'Address', type: 'textarea', required: false, placeholder: 'Customer address...' },
      { name: 'Customer Type', type: 'select', required: true, options: ['Regular', 'Premium', 'VIP'] },
      { name: 'Join Date', type: 'date', required: false }
    ]
  };

  const entityKey = entityName.toLowerCase();
  return fallbackFieldsMap[entityKey] || [
    { name: 'Name', type: 'text', required: true, placeholder: 'Enter name' },
    { name: 'Description', type: 'textarea', required: false, placeholder: 'Enter description...' },
    { name: 'Status', type: 'select', required: true, options: ['Active', 'Inactive'] },
    { name: 'Created Date', type: 'date', required: false }
  ];
};

// Function to test API connection
export const testAPIConnection = async () => {
  try {
    const testResponse = await callOpenRouterAPI('Respond with just "OK" to test the connection.', 10);
    return { success: true, message: testResponse };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Function to get available models (optional)
export const getAvailableModels = async () => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
};