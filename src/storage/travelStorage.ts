import AsyncStorage from '@react-native-async-storage/async-storage';

import type { TravelEntry } from '../types/travelEntry';

const STORAGE_KEY = 'travel_entries';

export async function loadTravelEntries(): Promise<TravelEntry[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as TravelEntry[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (entry) =>
          typeof entry?.id === 'string' &&
          typeof entry?.imageUri === 'string' &&
          typeof entry?.address === 'string' &&
          typeof entry?.createdAt === 'string',
      )
      .map((entry) => ({
        id: entry.id,
        title: typeof entry.title === 'string' ? entry.title : 'Untitled Entry',
        description: typeof entry.description === 'string' ? entry.description : '',
        imageUri: entry.imageUri,
        address: entry.address,
        createdAt: entry.createdAt,
      }));
  } catch {
    return [];
  }
}

export async function saveTravelEntries(entries: TravelEntry[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
