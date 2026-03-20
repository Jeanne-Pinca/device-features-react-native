import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { ThemeToggle } from '../components/ThemeToggle';

import { BackHeader } from '../components/BackHeader';
import type { RootStackParamList } from './HomeScreen';
import type { TravelEntry } from '../types/travelEntry';

type EntryDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'EntryDetails'> & {
  entries: TravelEntry[];
  isDarkMode: boolean;
  onToggleTheme: () => void;
};

export function EntryDetailsScreen({ navigation, route, entries, isDarkMode, onToggleTheme }: EntryDetailsScreenProps) {
  const entry = entries.find((item) => item.id === route.params.entryId);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  if (!entry) {
    return (
      <SafeAreaView style={[styles.container, isDarkMode ? styles.containerDark : styles.containerLight]}>
        <View style={styles.missingContainer}>
          <Text style={[styles.missingTitle, isDarkMode ? styles.textDark : styles.textLight]}>Entry not found</Text>
          <Pressable
            style={[styles.backButton, isDarkMode ? styles.backButtonDark : styles.backButtonLight]}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Back to home"
          >
            <Text style={[styles.backButtonText, isDarkMode ? styles.textDark : styles.textLight]}>Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDarkMode ? styles.containerDark : styles.containerLight]}>
      <View style={styles.topBar}>
        <BackHeader title="Entry" isDarkMode={isDarkMode} onBack={() => navigation.goBack()} />
        <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => setIsImagePreviewOpen(true)} accessibilityRole="button" accessibilityLabel="View photo full screen">
          <Image source={{ uri: entry.imageUri }} style={styles.image} />
        </Pressable>

        <View style={[styles.sectionCard, isDarkMode ? styles.cardDark : styles.cardLight]}>
          <Text style={[styles.title, isDarkMode ? styles.textDark : styles.textLight]}>{entry.title}</Text>
          <Text style={styles.date}>{new Date(entry.createdAt).toLocaleString()}</Text>
        </View>

        <View style={[styles.sectionCard, isDarkMode ? styles.cardDark : styles.cardLight]}>
          <Text style={styles.sectionLabel}>Location</Text>
          <Text style={[styles.sectionBody, isDarkMode ? styles.textDark : styles.textLight]}>{entry.address}</Text>
        </View>

        <View style={[styles.sectionCard, isDarkMode ? styles.cardDark : styles.cardLight]}>
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={[styles.sectionBody, isDarkMode ? styles.textDark : styles.textLight]}>{entry.description}</Text>
        </View>
      </ScrollView>

      <Modal visible={isImagePreviewOpen} animationType="fade" transparent>
        <View style={styles.previewModalBackdrop}>
          <Pressable style={styles.previewModalCloseButton} onPress={() => setIsImagePreviewOpen(false)}>
            <Ionicons name="close" size={22} color="#ffffff" />
          </Pressable>
          <Image source={{ uri: entry.imageUri }} style={styles.previewModalImage} resizeMode="contain" />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#0b0b0b',
  },
  content: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 96,
    gap: 12,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 14,
  },
  sectionCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  cardLight: {
    borderColor: '#cfcfcf',
    backgroundColor: '#ffffff',
  },
  cardDark: {
    borderColor: '#3a3a3a',
    backgroundColor: '#151515',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  date: {
    fontSize: 12,
    color: '#667085',
  },
  sectionLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '700',
    color: '#667085',
  },
  sectionBody: {
    fontSize: 15,
    lineHeight: 22,
  },
  textLight: {
    color: '#111111',
  },
  textDark: {
    color: '#f2f2f2',
  },
  missingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    padding: 24,
  },
  missingTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  backButton: {
    minWidth: 110,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonLight: {
    borderColor: '#cfcfcf',
    backgroundColor: '#ffffff',
  },
  backButtonDark: {
    borderColor: '#3a3a3a',
    backgroundColor: '#ffffff',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  topBar: {
    marginTop: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  previewModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  previewModalCloseButton: {
    position: 'absolute',
    top: 52,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  previewModalImage: {
    width: '100%',
    height: '84%',
  },
});
