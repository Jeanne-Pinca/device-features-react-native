import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';

import { EmptyHomeScreen } from './src/screens/EmptyHomeScreen';
import { EntryDetailsScreen } from './src/screens/EntryDetailsScreen';
import { HomeScreen, RootStackParamList } from './src/screens/HomeScreen';
import { ThemedPrompt } from './src/components/ThemedPrompt';
import { TravelEntryScreen } from './src/screens/TravelEntryScreen';
import { showPermissionPrompt } from './src/components/PermissionPrompt';
import { isValidTravelEntry, loadTravelEntries, saveTravelEntries } from './src/storage/travelStorage';
import type { TravelEntry } from './src/types/travelEntry';

const Stack = createNativeStackNavigator<RootStackParamList>();

const MIN_REFRESH_MS = 500;
const LIGHT_NOIR_THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f5f5f5',
    card: '#ffffff',
    text: '#111111',
    border: '#cfcfcf',
    primary: '#111111',
    notification: '#111111',
  },
};

const DARK_NOIR_THEME = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0b0b0b',
    card: '#151515',
    text: '#f2f2f2',
    border: '#383838',
    primary: '#f2f2f2',
    notification: '#f2f2f2',
  },
};

type SnackbarProps = {
  isVisible: boolean;
  message: string;
  isDarkMode: boolean;
};

function Snackbar({ isVisible, message, isDarkMode }: SnackbarProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: isVisible ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: isVisible ? 0 : 20,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isVisible, opacity, translateY]);

  if (!message) {
    return null;
  }

  return (
    <View style={styles.snackbarContainer} pointerEvents="none">
      <Animated.View
        style={[
          styles.snackbar,
          isDarkMode ? styles.snackbarDark : styles.snackbarLight,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <Text style={[styles.snackbarMessage, isDarkMode ? styles.snackbarTextDark : styles.snackbarTextLight]}>
          {message}
        </Text>
      </Animated.View>
    </View>
  );
}

export default function App() {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshingEntries, setIsRefreshingEntries] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const snackbarTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setIsSnackbarVisible(true);

    if (snackbarTimeoutRef.current) {
      clearTimeout(snackbarTimeoutRef.current);
    }

    snackbarTimeoutRef.current = setTimeout(() => {
      setIsSnackbarVisible(false);
    }, 2200);
  };

  useEffect(() => {
    const hydrateEntries = async () => {
      const stored = await loadTravelEntries();
      setEntries(stored);
      setIsLoading(false);
    };

    void hydrateEntries();
  }, []);

  useEffect(() => {
    const setupNotificationPermission = async () => {
      let permission = await Notifications.getPermissionsAsync();

      if (!permission.granted) {
        permission = await Notifications.requestPermissionsAsync();
      }

      if (!permission.granted) {
        showPermissionPrompt({
          permissionName: 'Notification',
          reason: 'Enable notifications in settings so you can receive save confirmations.',
        });
      }

      await Notifications.setNotificationChannelAsync('travel-entry', {
        name: 'Travel Entry Notifications',
        importance: Notifications.AndroidImportance.DEFAULT,
      });

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
    };

    void setupNotificationPermission();
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    void saveTravelEntries(entries);
  }, [entries, isLoading]);

  useEffect(() => {
    return () => {
      if (!snackbarTimeoutRef.current) {
        return;
      }

      clearTimeout(snackbarTimeoutRef.current);
    };
  }, []);

  const navigationTheme = useMemo(() => {
    return isDarkMode ? DARK_NOIR_THEME : LIGHT_NOIR_THEME;
  }, [isDarkMode]);

  const validEntries = useMemo(() => entries.filter(isValidTravelEntry), [entries]);

  const addEntry = (entry: TravelEntry) => {
    if (!isValidTravelEntry(entry)) {
      return false;
    }

    setEntries((previous) => [entry, ...previous]);
    return true;
  };

  const updateEntry = (entry: TravelEntry) => {
    if (!isValidTravelEntry(entry)) {
      return false;
    }

    const entryExists = entries.some((candidate) => candidate.id === entry.id);
    if (!entryExists) {
      return false;
    }

    setEntries((previous) => previous.map((candidate) => (candidate.id === entry.id ? entry : candidate)));
    showSnackbar('Entry updated');
    return true;
  };

  const removeEntry = (id: string) => {
    let wasRemoved = false;
    setEntries((previous) => {
      const next = previous.filter((entry) => entry.id !== id);
      wasRemoved = next.length !== previous.length;
      return next;
    });

    if (wasRemoved) {
      showSnackbar('Entry removed');
    }
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
    <View style={{ flex: 1 }}>
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
            {(props) => (
              <TravelEntryScreen
                {...props}
                entries={validEntries}
                onSaveEntry={addEntry}
                onUpdateEntry={updateEntry}
                isDarkMode={isDarkMode}
                onToggleTheme={toggleTheme}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="EntryDetails" options={{ headerShown: false }}>
            {(props) => (
              <EntryDetailsScreen
                {...props}
                entries={validEntries}
                isDarkMode={isDarkMode}
                onToggleTheme={toggleTheme}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>

      <Snackbar isVisible={isSnackbarVisible} message={snackbarMessage} isDarkMode={isDarkMode} />
      <ThemedPrompt isDarkMode={isDarkMode} />
    </View>
  );
}

const styles = StyleSheet.create({
  snackbarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 28,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  snackbar: {
    minHeight: 44,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    justifyContent: 'center',
    maxWidth: '100%',
  },
  snackbarLight: {
    backgroundColor: '#111111',
    borderColor: '#2c2c2c',
  },
  snackbarDark: {
    backgroundColor: '#f2f2f2',
    borderColor: '#cdcdcd',
  },
  snackbarMessage: {
    fontSize: 14,
    fontWeight: '700',
  },
  snackbarTextLight: {
    color: '#f2f2f2',
  },
  snackbarTextDark: {
    color: '#111111',
  },
});
