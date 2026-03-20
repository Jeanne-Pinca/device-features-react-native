import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  containerLight: {
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#0b0b0b',
  },
  topBar: {
    marginTop: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  scroll: {
    flex: 1,
    marginTop: 4,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 96,
  },
  summaryContainer: {
    borderRadius: 16,
    borderWidth: 0,
    padding: 14,
    minHeight: 150,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  summaryContainerLight: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  summaryContainerDark: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  summaryLeftColumn: {
    width: '50%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 4,
  },
  logoSphere: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSphereLight: {
    backgroundColor: '#f0f0f0',
    borderColor: '#cfcfcf',
  },
  logoSphereDark: {
    backgroundColor: '#1a1a1a',
    borderColor: '#3f3f3f',
  },
  logoSphereText: {
    fontSize: 42,
    fontWeight: '800',
  },
  summaryRightColumn: {
    flex: 1,
    gap: 8,
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  entriesCapsule: {
    alignSelf: 'stretch',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  entriesCapsuleLight: {
    borderColor: '#cfcfcf',
    backgroundColor: '#ffffff',
  },
  entriesCapsuleDark: {
    borderColor: '#3f3f3f',
    backgroundColor: '#ffffff',
  },
  entriesCapsuleText: {
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  summarySubtitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  scrollEmptyContent: {
    flexGrow: 1,
    paddingTop: 8,
    paddingBottom: 16,
  },
  emptyStateContainer: {
    flexGrow: 1,
    minHeight: 420,
    justifyContent: 'center',
  },
  cardsContainer: {
    marginTop: 16,
  },
});
