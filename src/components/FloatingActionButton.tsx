import { Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { styles } from './styles/FloatingActionButton.styles';

type FloatingActionButtonProps = {
  onPress: () => void;
  accessibilityLabel: string;
  isDarkMode: boolean;
};

export function FloatingActionButton({ onPress, accessibilityLabel, isDarkMode }: FloatingActionButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [isDarkMode ? styles.buttonLight : styles.buttonDark, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Ionicons name="add" size={28} color={isDarkMode ? '#111111' : '#ffffff'} />
    </Pressable>
  );
}
