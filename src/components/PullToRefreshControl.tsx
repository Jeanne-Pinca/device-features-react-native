import { RefreshControl } from 'react-native';

type PullToRefreshControlProps = {
  refreshing: boolean;
  onRefresh: () => void;
  isDarkMode?: boolean;
};

export function PullToRefreshControl({ refreshing, onRefresh, isDarkMode = false }: PullToRefreshControlProps) {
  const tintColor = isDarkMode ? '#f2f4f7' : '#1f2937';
  const spinnerColor = isDarkMode ? '#60a5fa' : '#0f766e';

  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={tintColor}
      colors={[spinnerColor]}
      progressBackgroundColor={isDarkMode ? '#111827' : '#ffffff'}
    />
  );
}
