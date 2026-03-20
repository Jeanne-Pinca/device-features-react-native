import { Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { styles } from './styles/FloatingActionButton.styles';

type FloatingActionButtonProps = {
  onPress: () => void;
  accessibilityLabel: string;
};

export function FloatingActionButton({ onPress, accessibilityLabel }: FloatingActionButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Ionicons name="add" size={28} color="#ffffff" />
    </Pressable>
  );
}
