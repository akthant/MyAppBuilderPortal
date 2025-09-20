import React from 'react';
import RequirementForm from '../components/forms/RequirementForm';
import RequirementDisplay from '../components/ui/RequirementDisplay';
import MockUIGenerator from '../components/ui/MockUIGenerator';
import { useApp } from '../contexts/AppContext';

const Home = () => {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Mini AI App Builder Portal</h1>
        
        <RequirementForm />
        
        {state.error && (
          <div className="max-w-2xl mx-auto mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {state.error}
          </div>
        )}
        
        <RequirementDisplay requirements={state.requirements} />
        <MockUIGenerator requirements={state.requirements} />
      </div>
    </div>
  );
};

export default Home;
