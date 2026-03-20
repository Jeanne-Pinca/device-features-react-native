import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

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
        <Ionicons
          name="globe-outline"
          size={110}
          color={isDarkMode ? '#f2f2f2' : '#111111'}
          style={{ alignSelf: 'center' }}
        />
      </View>

      <Text style={[styles.bodyText, isDarkMode ? styles.textDark : styles.textLight]}>
        Your personal travel diary. Log your first entry.
      </Text>

      <PrimaryButton label="Add entry" onPress={onAddEntry} isDarkMode={!isDarkMode} />
    </View>
  );
}
