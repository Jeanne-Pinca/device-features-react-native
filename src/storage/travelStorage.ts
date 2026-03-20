import AsyncStorage from '@react-native-async-storage/async-storage';

import type { TravelEntry } from '../types/travelEntry';

const STORAGE_KEY = 'travel_entries';
const MAX_DESCRIPTION_LENGTH = 1000;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isValidTravelEntry(entry: unknown): entry is TravelEntry {
  if (!entry || typeof entry !== 'object') {
    return false;
  }

  const candidate = entry as Partial<TravelEntry>;

  if (!isNonEmptyString(candidate.id)) {
    return false;
  }

  if (!isNonEmptyString(candidate.title)) {
    return false;
  }

  if (!isNonEmptyString(candidate.imageUri)) {
    return false;
  }

  if (!isNonEmptyString(candidate.address) || candidate.address.trim().length < 5) {
    return false;
  }

  if (!isNonEmptyString(candidate.description) || candidate.description.length > MAX_DESCRIPTION_LENGTH) {
    return false;
  }

  if (!isNonEmptyString(candidate.createdAt) || Number.isNaN(Date.parse(candidate.createdAt))) {
    return false;
  }

  return true;
}

function normalizeEntry(entry: TravelEntry): TravelEntry {
  return {
    id: entry.id.trim(),
    title: entry.title.trim(),
    description: entry.description.trim(),
    imageUri: entry.imageUri.trim(),
    address: entry.address.trim(),
    createdAt: entry.createdAt,
  };
}

export async function loadTravelEntries(): Promise<TravelEntry[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isValidTravelEntry).map(normalizeEntry);
  } catch {
    return [];
  }
}

export async function saveTravelEntries(entries: TravelEntry[]): Promise<void> {
  const validEntries = entries.filter(isValidTravelEntry).map(normalizeEntry);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(validEntries));
}

export async function clearTravelEntries(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
