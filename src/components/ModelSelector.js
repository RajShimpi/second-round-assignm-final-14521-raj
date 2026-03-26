import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectModels,
  selectModelsLoading,
  selectModelsError,
  selectSelectedModel,
  setSelectedModel,
  fetchModels,
} from '../redux/chatSlice';
import '../styles/ModelSelector.css';

function ModelSelector() {
  const dispatch = useDispatch();
  const models = useSelector(selectModels);
  const modelsLoading = useSelector(selectModelsLoading);
  const modelsError = useSelector(selectModelsError);
  const selectedModel = useSelector(selectSelectedModel);

  const handleChange = (e) => {
    dispatch(setSelectedModel(e.target.value));
  };

  const handleRetry = () => {
    dispatch(fetchModels());
  };

  if (modelsLoading) {
    return <span className="model-selector-loading">Loading models...</span>;
  }

  if (modelsError) {
    return (
      <button className="model-selector-retry" onClick={handleRetry}>
        Retry
      </button>
    );
  }

  return (
    <select
      className="model-selector"
      value={selectedModel}
      onChange={handleChange}
    >
      {models.length === 0 && (
        <option value={selectedModel}>{selectedModel}</option>
      )}
      {models.map((model) => (
        <option key={model} value={model}>
          {model}
        </option>
      ))}
    </select>
  );
}

export default ModelSelector;
