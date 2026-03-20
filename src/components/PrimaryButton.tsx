import { Pressable, Text } from 'react-native';

import { styles } from './styles/PrimaryButton.styles';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  tone?: 'primary' | 'danger' | 'neutral';
  isDarkMode?: boolean;
};

export function PrimaryButton({ label, onPress, tone = 'primary', isDarkMode }: PrimaryButtonProps & { isDarkMode: boolean }) {
  // If tone is 'neutral', treat as unfilled button
  const isUnfilled = tone === 'neutral';
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isUnfilled && isDarkMode ? styles.unfilledDark : isDarkMode ? styles.primaryDark : styles.primaryLight,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Text style={isUnfilled && isDarkMode ? styles.unfilledLabelDark : isDarkMode ? styles.labelDark : styles.labelLight}>{label}</Text>
    </Pressable>
  );
}
