import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from 'react-native';

import { styles } from './styles/ThemeToggle.styles';

type ThemeToggleProps = {
  isDarkMode: boolean;
  onToggle: () => void;
};

export function ThemeToggle({ isDarkMode, onToggle }: ThemeToggleProps) {
  return (
    <Pressable
      style={[styles.button, isDarkMode ? styles.buttonDark : styles.buttonLight]}
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Ionicons
        name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
        size={20}
        color={isDarkMode ? '#facc15' : '#1f2937'}
      />
    </Pressable>
  );
}
