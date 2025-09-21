// src/contexts/AppContext.jsx
import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  requirements: null,
  mockUI: null,
  loading: false,
  error: null,
  savedProject: null, // Add this for MongoDB integration
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_REQUIREMENTS':
      return { ...state, requirements: action.payload, loading: false };
    case 'SET_MOCK_UI':
      return { ...state, mockUI: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_SAVED_PROJECT': // Add this
      return { ...state, savedProject: action.payload };
    default:
      return state;
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setRequirements = (requirements) => {
    dispatch({ type: 'SET_REQUIREMENTS', payload: requirements });
  };

  const setSavedProject = (project) => {
    dispatch({ type: 'SET_SAVED_PROJECT', payload: project });
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      dispatch, 
      setRequirements,
      setSavedProject
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};