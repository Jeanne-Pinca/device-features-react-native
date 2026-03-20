import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type BackHeaderProps = {
  title: string;
  isDarkMode: boolean;
  onBack: () => void;
};

export function BackHeader({ title, isDarkMode, onBack }: BackHeaderProps) {
  return (
    <View style={[styles.container, isDarkMode ? styles.containerDark : styles.containerLight]}>
      <Pressable
        style={[styles.iconButton, isDarkMode ? styles.iconButtonDark : styles.iconButtonLight]}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Back"
      >
        <Ionicons name="arrow-back" size={20} color={isDarkMode ? '#f2f2f2' : '#111111'} />
      </Pressable>
      <Text style={[styles.title, isDarkMode ? styles.textDark : styles.textLight]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    marginBottom: 12,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
    paddingHorizontal: 0,
  },
  containerLight: {
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#0b0b0b',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonLight: {
    backgroundColor: '#ffffff',
    borderColor: '#cfcfcf',
  },
  iconButtonDark: {
    backgroundColor: '#111111',
    borderColor: '#3a3a3a',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  textLight: {
    color: '#111111',
  },
  textDark: {
    color: '#f2f2f2',
  },
});