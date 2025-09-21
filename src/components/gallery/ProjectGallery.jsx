import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../../services/projectservice';

const ProjectGallery = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    { value: 'all', label: 'All Projects', icon: '📱' },
    { value: 'education', label: 'Education', icon: '🎓' },
    { value: 'ecommerce', label: 'E-commerce', icon: '🛒' },
    { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
    { value: 'finance', label: 'Finance', icon: '💳' },
    { value: 'social', label: 'Social', icon: '👥' },
    { value: 'productivity', label: 'Productivity', icon: '📊' },
    { value: 'other', label: 'Other', icon: '⚡' }
  ];

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory, searchTerm, currentPage]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getProjects(
        currentPage, 
        12, 
        selectedCategory, 
        searchTerm
      );
      setProjects(data.projects);
      setPagination(data.pagination);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (projectId) => {
    try {
      const result = await projectService.likeProject(projectId);
      setProjects(projects.map(p => 
        p._id === projectId 
          ? { ...p, metadata: { ...p.metadata, likes: result.likes } }
          : p
      ));
    } catch (error) {
      console.error('Failed to like project:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Gallery</h1>
        <p className="text-gray-600">Explore AI-generated applications created by our community</p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => {
                setSelectedCategory(category.value);
                setCurrentPage(1);
              }}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.value
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-600">Error loading projects: {error}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No projects found matching your criteria.</p>
        </div>
      ) : (
        <>
          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {projects.map((project) => (
              <div key={project._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                {/* Project Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <Link 
                      to={`/projects/${project.slug || project._id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {project.name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(project.createdAt)}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {categories.find(c => c.value === project.metadata.category)?.icon}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Tags (Entities) */}
                {project.requirements?.entities && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.requirements.entities.slice(0, 3).map((entity, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {entity}
                      </span>
                    ))}
                    {project.requirements.entities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{project.requirements.entities.length - 3}
                      </span>
                    )}
                  </div>
                )}

     {/* Stats */}
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {project.metadata.views || 0} views
              </span>
              <button
                onClick={() => handleLike(project._id)}
                className="flex items-center hover:text-red-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {project.metadata.likes || 0}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 text-gray-600">
            Page {currentPage} of {pagination.pages}
          </span>
          
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= pagination.pages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  )}
</div>
);
};
export default ProjectGallery;