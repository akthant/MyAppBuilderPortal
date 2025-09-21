import React, { useState, useEffect } from 'react';
import { projectService } from '../../services/projectService';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await projectService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Analytics</h1>
        <p className="text-gray-600">Insights into AI-generated applications and usage patterns</p>
      </div>

      {analytics && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Projects</h3>
              <p className="text-3xl font-bold text-blue-600">{analytics.totalProjects}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Views</h3>
              <p className="text-3xl font-bold text-green-600">{analytics.totalViews}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-sm font-medium text-gray-600 mb-2">AI Calls</h3>
              <p className="text-3xl font-bold text-purple-600">{analytics.aiUsage.totalCalls}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Tokens Used</h3>
              <p className="text-3xl font-bold text-orange-600">{analytics.aiUsage.totalTokens.toLocaleString()}</p>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Popular Categories</h3>
            <div className="space-y-4">
              {analytics.categoryStats.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium text-gray-700 capitalize">
                    {category._id || 'Other'}
                  </span>
                  <div className="flex items-center space-x-3">
                    <div className="w-48 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(category.count / analytics.totalProjects) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-12 text-right">
                      {category.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Stats */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">Platform Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold mb-2">{Math.round(analytics.totalViews / analytics.totalProjects)}</p>
                <p className="text-blue-100">Avg Views per Project</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold mb-2">{analytics.categoryStats.length}</p>
                <p className="text-blue-100">Categories Covered</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold mb-2">{Math.round(analytics.aiUsage.totalTokens / analytics.aiUsage.totalCalls)}</p>
                <p className="text-blue-100">Avg Tokens per Call</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;