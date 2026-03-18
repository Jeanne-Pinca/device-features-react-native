import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 24,
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
    backgroundColor: '#eaf2ff',
    borderColor: '#b3ccff',
  },
  logoCircleDark: {
    backgroundColor: '#1f2a44',
    borderColor: '#3f5fa0',
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
    color: '#101828',
  },
  textDark: {
    color: '#f2f4f7',
  },
});
