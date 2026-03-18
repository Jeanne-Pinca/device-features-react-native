import { Text, View } from 'react-native';

import { PrimaryButton } from './PrimaryButton';
import { styles } from './styles/EmptyDiaryState.styles';

type EmptyDiaryStateProps = {
  onAddEntry: () => void;
  isDarkMode: boolean;
};

export function EmptyDiaryState({ onAddEntry, isDarkMode }: EmptyDiaryStateProps) {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.logoCircle, isDarkMode ? styles.logoCircleDark : styles.logoCircleLight]}>
        <Text style={[styles.logoText, isDarkMode ? styles.textDark : styles.textLight]}>H</Text>
      </View>

      <Text style={[styles.bodyText, isDarkMode ? styles.textDark : styles.textLight]}>
        Your personal diary for your travelsm log your first entry!
      </Text>

      <PrimaryButton label="Add entry" onPress={onAddEntry} />
    </View>
  );
}
