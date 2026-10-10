import { useApp } from '../context/AppContext';

export function useDashboard() {
  const { summary, loading, error, refreshData, isDemoMode, datasetName } = useApp();
  return {
    summary,
    loading,
    error,
    refreshData,
    isDemoMode,
    datasetName
  };
}
