import { Image, Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import type { TravelEntry } from '../types/travelEntry';
import { styles } from './styles/EntryCard.styles';

type EntryCardProps = {
  entry: TravelEntry;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
  isDarkMode: boolean;
};

export function EntryCard({ entry, onView, onEdit, onRemove, isDarkMode }: EntryCardProps) {
  return (
    <Pressable
      style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]}
      onPress={() => onView(entry.id)}
      accessibilityRole="button"
      accessibilityLabel={`View ${entry.title}`}
    >
      <Image source={{ uri: entry.imageUri }} style={styles.image} />
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode ? styles.textDark : styles.textLight]}>{entry.title}</Text>
        <Text style={[styles.address, isDarkMode ? styles.textDark : styles.textLight]}>{entry.address}</Text>
        {entry.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {entry.description}
          </Text>
        ) : null}
        <View style={styles.actionsRow}>
          <Text style={styles.date}>{new Date(entry.createdAt).toLocaleString()}</Text>
          <View style={styles.actionsGroup}>
            <Pressable
              onPress={() => onEdit(entry.id)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Edit ${entry.title}`}
              style={styles.iconButton}
            >
              <Ionicons name="create-outline" size={20} color={isDarkMode ? '#f2f4f7' : '#101828'} />
            </Pressable>
            <Pressable
              onPress={() => onRemove(entry.id)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${entry.title}`}
              style={styles.iconButton}
            >
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
