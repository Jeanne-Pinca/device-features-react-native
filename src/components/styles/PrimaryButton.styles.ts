import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    unfilledDark: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#f2f2f2',
    },
    unfilledLabelDark: {
      color: '#f2f2f2',
      fontSize: 15,
      fontWeight: '700',
    },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 110,
    alignItems: 'center',
  },
    primaryLight: {
      backgroundColor: '#ffffff',
    },
    primaryDark: {
      backgroundColor: '#111111',
    },
    labelLight: {
      color: '#111111',
      fontSize: 15,
      fontWeight: '700',
    },
    labelDark: {
      color: '#f2f2f2',
      fontSize: 15,
      fontWeight: '700',
    },
  pressed: {
    opacity: 0.85,
  },
});
