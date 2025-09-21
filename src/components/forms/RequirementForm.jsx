import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { submitRequirements } from '../../services/api'; // Your existing OpenRouter API
import { projectService } from '../../services/projectservice';

const RequirementForm = ({ onRequirementsGenerated }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedProject, setSavedProject] = useState(null); // ✅ Added this line
  
  const startTimeRef = useRef(null);

  const categorizeProject = (requirements) => {
    const { entities = [], features = [] } = requirements;
    const allText = [...entities, ...features].join(' ').toLowerCase();
    
    if (allText.includes('student') || allText.includes('course') || allText.includes('learn')) return 'education';
    if (allText.includes('product') || allText.includes('order') || allText.includes('shop')) return 'ecommerce';
    if (allText.includes('patient') || allText.includes('doctor') || allText.includes('health')) return 'healthcare';
    if (allText.includes('payment') || allText.includes('transaction') || allText.includes('bank')) return 'finance';
    if (allText.includes('post') || allText.includes('message') || allText.includes('social')) return 'social';
    if (allText.includes('task') || allText.includes('project') || allText.includes('manage')) return 'productivity';
    
    return 'other';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    setError(null);
    setSavedProject(null); // ✅ Reset saved project state
    startTimeRef.current = Date.now();
    
    try {
      // Step 1: Generate requirements using AI (your existing logic)
      const requirements = await submitRequirements(description);
      const responseTime = Date.now() - startTimeRef.current;
      
      // Step 2: Pass to parent component for UI generation
      if (onRequirementsGenerated) {
        onRequirementsGenerated(requirements);
      }
      
      // Step 3: Auto-save project to MongoDB (optional - only if projectService is available)
      try {
        const projectData = {
          name: requirements.appName || 'Generated App',
          description: description.trim(),
          requirements: {
            ...requirements,
            originalPrompt: description
          },
          analytics: {
            aiModel: 'claude-3.5-sonnet',
            tokensUsed: Math.ceil(description.length / 4) + Math.ceil(JSON.stringify(requirements).length / 4),
            responseTime
          },
          metadata: {
            category: categorizeProject(requirements),
            tags: requirements.entities || []
          }
        };

        // Only try to save if projectService is available (backend is running)
        if (typeof projectService !== 'undefined') {
          const savedResult = await projectService.saveProject(projectData);
          setSavedProject(savedResult);
        }
      } catch (saveError) {
        console.error('Failed to save project:', saveError);
        // Don't show error to user - the main functionality (AI generation) worked
      }
      
    } catch (error) {
      console.error('Error processing requirements:', error);
      setError(error.message || 'Failed to process requirements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Describe Your App</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            What kind of app do you want to build?
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your app idea... For example: 'I want a student course management system where teachers can add courses, students can enroll, and admins can generate reports.'"
            className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <div className="mt-1 text-sm text-gray-500">
            {description.length}/500 characters
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Success Message - Only show if project was saved */}
        {savedProject && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
            ✅ Project saved successfully! 
            {savedProject.project?.slug && (
               <Link 
                to={`/projects/${savedProject.project.slug}`} 
                className="ml-2 font-medium underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View project page →
              </Link>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !description.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating...
            </div>
          ) : (
            'Generate App Requirements'
          )}
        </button>
      </form>

      {/* Quick Examples */}
      {!description && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Try these examples:</h3>
          <div className="space-y-2">
            {[
              "A restaurant ordering system with menu management, customer orders, kitchen workflow, and delivery tracking",
              "An online learning platform with courses, video lessons, quizzes, student progress tracking, and instructor dashboards",
              "A project management tool where teams create tasks, assign members, set deadlines, and track progress with reports"
            ].map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setDescription(example)}
                className="block w-full text-left p-3 text-sm text-blue-600 hover:bg-blue-50 rounded border border-blue-200 hover:border-blue-300 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequirementForm;