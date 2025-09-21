const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const projectService = {
  // Save a new project (public)
  async saveProject(projectData) {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to save project`);
      }

      return await response.json();
    } catch (error) {
      console.error('Save project error:', error);
      throw error;
    }
  },

  // Get projects gallery
  async getProjects(page = 1, limit = 12, category = null, search = null) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (category && category !== 'all') params.append('category', category);
      if (search) params.append('search', search);

      const response = await fetch(`${API_BASE_URL}/projects?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch projects`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get projects error:', error);
      throw error;
    }
  },

  // Get specific project
  async getProject(identifier) {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${identifier}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Project not found');
        }
        throw new Error(`HTTP ${response.status}: Failed to fetch project`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get project error:', error);
      throw error;
    }
  },

  // Get templates
  async getTemplates() {
    try {
      const response = await fetch(`${API_BASE_URL}/templates`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch templates`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get templates error:', error);
      throw error;
    }
  },

  // Like a project
  async likeProject(projectId) {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/like`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to like project');
      }

      return await response.json();
    } catch (error) {
      console.error('Like project error:', error);
      throw error;
    }
  },

  // Get analytics
  async getAnalytics() {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Get analytics error:', error);
      throw error;
    }
  }
};

export default projectService;