import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 110,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#007a5e',
  },
  danger: {
    backgroundColor: '#b42318',
  },
  neutral: {
    backgroundColor: '#475467',
  },
  label: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});
