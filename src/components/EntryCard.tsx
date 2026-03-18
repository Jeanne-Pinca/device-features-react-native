import { Image, Text, View } from 'react-native';

import type { TravelEntry } from '../types/travelEntry';
import { PrimaryButton } from './PrimaryButton';
import { styles } from './styles/EntryCard.styles';

type EntryCardProps = {
  entry: TravelEntry;
  onRemove: (id: string) => void;
  isDarkMode: boolean;
};

export function EntryCard({ entry, onRemove, isDarkMode }: EntryCardProps) {
  return (
    <View style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]}>
      <Image source={{ uri: entry.imageUri }} style={styles.image} />
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode ? styles.textDark : styles.textLight]}>{entry.title}</Text>
        <Text style={[styles.address, isDarkMode ? styles.textDark : styles.textLight]}>{entry.address}</Text>
        {entry.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {entry.description}
          </Text>
        ) : null}
        <Text style={styles.date}>{new Date(entry.createdAt).toLocaleString()}</Text>
        <PrimaryButton label="Remove" tone="danger" onPress={() => onRemove(entry.id)} />
      </View>
    </View>
  );
}
