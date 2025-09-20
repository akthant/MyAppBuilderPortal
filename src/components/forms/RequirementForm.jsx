import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { submitRequirements } from '../../services/api';

const RequirementForm = () => {
  const [description, setDescription] = useState('');
  const { state, dispatch } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const requirements = await submitRequirements(description);
      dispatch({ type: 'SET_REQUIREMENTS', payload: requirements });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Describe Your App</h2>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the app you want to build..."
        className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      />
      <button
        type="submit"
        disabled={state.loading}
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {state.loading ? 'Processing...' : 'Generate Requirements'}
      </button>
    </form>
  );
};

export default RequirementForm;
