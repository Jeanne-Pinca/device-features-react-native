import { FlatList, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyDiaryState } from '../components/EmptyDiaryState';
import { EntryCard } from '../components/EntryCard';
import { PullToRefreshControl } from '../components/PullToRefreshControl';
import { PrimaryButton } from '../components/PrimaryButton';
import { ThemeToggle } from '../components/ThemeToggle';
import type { TravelEntry } from '../types/travelEntry';
import { styles } from './styles/HomeScreen.styles';

export type RootStackParamList = {
  Home: undefined;
  TravelEntry: undefined;
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
  return (
    <SafeAreaView style={[styles.container, isDarkMode ? styles.containerDark : styles.containerLight]}>
      <View style={styles.topBar}>
        <Text style={[styles.title, isDarkMode ? styles.textDark : styles.textLight]}>Halcyon</Text>
        <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
      </View>

      {entries.length === 0 ? (
        <EmptyDiaryState onAddEntry={() => navigation.navigate('TravelEntry')} isDarkMode={isDarkMode} />
      ) : (
        <>
          <PrimaryButton label="Add entry" onPress={() => navigation.navigate('TravelEntry')} />

          <FlatList
            style={styles.list}
            data={entries}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <EntryCard entry={item} onRemove={onRemoveEntry} isDarkMode={isDarkMode} />}
            refreshControl={
              <PullToRefreshControl
                refreshing={isRefreshingEntries}
                onRefresh={onRefreshEntries}
                isDarkMode={isDarkMode}
              />
            }
          />
        </>
      )}
    </SafeAreaView>
  );
}
