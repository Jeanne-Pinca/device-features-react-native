import { FlatList, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EntryCard } from '../components/EntryCard';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { showThemedPrompt } from '../components/ThemedPrompt';
import { ThemeToggle } from '../components/ThemeToggle';
import type { TravelEntry } from '../types/travelEntry';
import { styles } from './styles/HomeScreen.styles';

export type RootStackParamList = {
  Home: undefined;
  TravelEntry: { entryId?: string } | undefined;
  EntryDetails: { entryId: string };
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'> & {
  entries: TravelEntry[];
  onRemoveEntry: (id: string) => void;
  onRefreshEntries: () => void;
  isRefreshingEntries: boolean;
  onToggleTheme: () => void;
  isDarkMode: boolean;
};

export function HomeScreen({
  navigation,
  entries,
  onRemoveEntry,
  onRefreshEntries,
  isRefreshingEntries,
  onToggleTheme,
  isDarkMode,
}: HomeScreenProps) {
  const openNewEntry = () => navigation.navigate('TravelEntry');
  const openEntryDetails = (entryId: string) => navigation.navigate('EntryDetails', { entryId });
  const openEditEntry = (entryId: string) => navigation.navigate('TravelEntry', { entryId });

  const confirmRemoveEntry = (entryId: string) => {
    showThemedPrompt({
      title: 'Delete entry?',
      message: 'This entry will be permanently removed.',
      actions: [
        {
          label: 'Cancel',
          variant: 'cancel',
        },
        {
          label: 'Delete',
          onPress: () => onRemoveEntry(entryId),
        },
      ],
    });
  };

  const entryCountLabel = `${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`;

  return (
    <SafeAreaView style={[styles.container, isDarkMode ? styles.containerDark : styles.containerLight]}>
      <View style={styles.topBar}>
        <Text style={[styles.title, isDarkMode ? styles.textDark : styles.textLight]}>Halcyon</Text>
        <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
      </View>

      <FlatList
        style={styles.scroll}
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EntryCard
            entry={item}
            onView={openEntryDetails}
            onEdit={openEditEntry}
            onRemove={confirmRemoveEntry}
            isDarkMode={isDarkMode}
          />
        )}
        ListHeaderComponent={
          <View style={[styles.summaryContainer, isDarkMode ? styles.summaryContainerDark : styles.summaryContainerLight]}>
            <View style={styles.summaryLeftColumn}>
              <View style={[styles.logoSphere, isDarkMode ? styles.logoSphereDark : styles.logoSphereLight]}>
                <Text style={[styles.logoSphereText, isDarkMode ? styles.textDark : styles.textLight]}>H</Text>
              </View>
            </View>

            <View style={styles.summaryRightColumn}>
              <View style={[styles.entriesCapsule, isDarkMode ? styles.entriesCapsuleDark : styles.entriesCapsuleLight]}>
                <Text style={[styles.entriesCapsuleText, isDarkMode ? styles.textDark : styles.textLight]}>
                  {entryCountLabel}
                </Text>
              </View>
              <Text style={[styles.summarySubtitle, isDarkMode ? styles.textDark : styles.textLight]}>
                View your entries! Revisit your moments, places, and memories from every trip.
              </Text>
            </View>
          </View>
        }
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshingEntries}
        onRefresh={onRefreshEntries}
        alwaysBounceVertical
        bounces
        overScrollMode="always"
      />

      <FloatingActionButton onPress={openNewEntry} accessibilityLabel="Add new entry" isDarkMode={isDarkMode} />
    </SafeAreaView>
  );
}
