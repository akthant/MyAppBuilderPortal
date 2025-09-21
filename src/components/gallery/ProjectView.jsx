import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectService } from '../../services/projectservice';
import MockUIGenerator from '../ui/MockUIGenerator'; // Your existing component

const ProjectView = () => {
  const { identifier } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProject();
  }, [identifier]);

  const fetchProject = async () => {
    try {
      const data = await projectService.getProject(identifier);
      setProject(data.project);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/gallery" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link to="/gallery" className="flex items-center text-blue-600 hover:text-blue-500">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Gallery
            </Link>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>👁️ {project.metadata.views} views</span>
              <span>❤️ {project.metadata.likes || 0} likes</span>
              <span>📅 {formatDate(project.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">
                  {project.metadata.category}
                </span>
                {project.metadata.isTemplate && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    Template
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6">{project.description}</p>

          {/* Original Prompt */}
          {project.requirements?.originalPrompt && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Original Request:</h3>
              <p className="text-gray-700 italic">"{project.requirements.originalPrompt}"</p>
            </div>
          )}

          {/* AI Generation Stats */}
          {project.analytics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg">
                <span className="block font-medium text-blue-900">AI Model</span>
                <span className="text-blue-700">{project.analytics.aiModel || 'Claude 3.5 Sonnet'}</span>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <span className="block font-medium text-green-900">Response Time</span>
                <span className="text-green-700">{project.analytics.responseTime || 0}ms</span>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <span className="block font-medium text-purple-900">Tokens Used</span>
                <span className="text-purple-700">{project.analytics.tokensUsed || 0}</span>
              </div>
            </div>
          )}
        </div>

        {/* Generated UI */}
        {project.requirements && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <MockUIGenerator requirements={project.requirements} />
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to={`/?template=${project._id}`}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Use as Template
          </Link>
          <button
            onClick={() => {
              const url = window.location.href;
              navigator.clipboard.writeText(url);
              alert('Project URL copied to clipboard!');
            }}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Share Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectView;