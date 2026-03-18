import { Pressable, Text } from 'react-native';

import { styles } from './styles/PrimaryButton.styles';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  tone?: 'primary' | 'danger' | 'neutral';
};

export function PrimaryButton({ label, onPress, tone = 'primary' }: PrimaryButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        tone === 'primary' && styles.primary,
        tone === 'danger' && styles.danger,
        tone === 'neutral' && styles.neutral,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
