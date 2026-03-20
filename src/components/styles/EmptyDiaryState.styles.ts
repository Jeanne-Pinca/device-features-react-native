import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  logoCircleLight: {
    backgroundColor: '#f0f0f0',
    borderColor: '#cfcfcf',
  },
  logoCircleDark: {
    backgroundColor: '#111111',
    borderColor: '#3a3a3a',
  },
  logoText: {
    fontSize: 44,
    fontWeight: '800',
  },
  bodyText: {
    textAlign: 'center',
    fontSize: 15,
    maxWidth: 280,
    lineHeight: 22,
  },
  textLight: {
    color: '#111111',
  },
  textDark: {
     color: '#ffffff',
  },
});
