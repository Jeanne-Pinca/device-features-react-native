import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { EmptyHomeScreen } from './src/screens/EmptyHomeScreen';
import { HomeScreen, RootStackParamList } from './src/screens/HomeScreen';
import { TravelEntryScreen } from './src/screens/TravelEntryScreen';
import { isValidTravelEntry, loadTravelEntries, saveTravelEntries } from './src/storage/travelStorage';
import type { TravelEntry } from './src/types/travelEntry';

const Stack = createNativeStackNavigator<RootStackParamList>();

const MIN_REFRESH_MS = 500;

export default function App() {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshingEntries, setIsRefreshingEntries] = useState(false);

  useEffect(() => {
    const hydrateEntries = async () => {
      const stored = await loadTravelEntries();
      setEntries(stored);
      setIsLoading(false);
    };

    void hydrateEntries();
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    void saveTravelEntries(entries);
  }, [entries, isLoading]);

  const navigationTheme = useMemo(() => {
    return isDarkMode ? DarkTheme : DefaultTheme;
  }, [isDarkMode]);

  const validEntries = useMemo(() => entries.filter(isValidTravelEntry), [entries]);

  const addEntry = (entry: TravelEntry) => {
    if (!isValidTravelEntry(entry)) {
      return false;
    }

    setEntries((previous) => [entry, ...previous]);
    return true;
  };

  const removeEntry = (id: string) => {
    setEntries((previous) => previous.filter((entry) => entry.id !== id));
  };

  const toggleTheme = () => {
    setIsDarkMode((previous) => !previous);
  };

  const refreshEntries = async () => {
    setIsRefreshingEntries(true);
    const refreshStartedAt = Date.now();

    try {
      const stored = await loadTravelEntries();
      setEntries(stored);
    } finally {
      const elapsed = Date.now() - refreshStartedAt;
      const remainingDelay = Math.max(0, MIN_REFRESH_MS - elapsed);
      if (remainingDelay > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingDelay));
      }

      setIsRefreshingEntries(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {(props) => (
            validEntries.length === 0 ? (
              <EmptyHomeScreen
                {...props}
                onRefreshEntries={refreshEntries}
                isRefreshingEntries={isRefreshingEntries}
                onToggleTheme={toggleTheme}
                isDarkMode={isDarkMode}
              />
            ) : (
              <HomeScreen
                {...props}
                entries={validEntries}
                onRemoveEntry={removeEntry}
                onRefreshEntries={refreshEntries}
                isRefreshingEntries={isRefreshingEntries}
                onToggleTheme={toggleTheme}
                isDarkMode={isDarkMode}
              />
            )
          )}
        </Stack.Screen>
        <Stack.Screen name="TravelEntry" options={{ headerShown: false }}>
          {(props) => <TravelEntryScreen {...props} onSaveEntry={addEntry} isDarkMode={isDarkMode} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
