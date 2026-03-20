import { FlatList, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyDiaryState } from '../components/EmptyDiaryState';
import { ThemeToggle } from '../components/ThemeToggle';
import type { RootStackParamList } from './HomeScreen';
import { styles } from './styles/HomeScreen.styles';

type EmptyHomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'> & {
  onRefreshEntries: () => void;
  isRefreshingEntries: boolean;
  onToggleTheme: () => void;
  isDarkMode: boolean;
};

export function EmptyHomeScreen({
  navigation,
  onRefreshEntries,
  isRefreshingEntries,
  onToggleTheme,
  isDarkMode,
}: EmptyHomeScreenProps) {
  return (
    <SafeAreaView style={[styles.container, isDarkMode ? styles.containerDark : styles.containerLight]}>
      <View style={styles.topBar}>
        <Text style={[styles.title, isDarkMode ? styles.textDark : styles.textLight]}>Halcyon</Text>
        <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
      </View>

      <FlatList
        style={styles.scroll}
        data={[]}
        renderItem={() => null}
        keyExtractor={(_, index) => `empty-${index}`}
        contentContainerStyle={styles.scrollEmptyContent}
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <EmptyDiaryState onAddEntry={() => navigation.navigate('TravelEntry')} isDarkMode={isDarkMode} />
          </View>
        }
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshingEntries}
        onRefresh={onRefreshEntries}
        alwaysBounceVertical
        bounces
        overScrollMode="always"
      />
    </SafeAreaView>
  );
}
