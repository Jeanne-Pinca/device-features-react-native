import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: '#f9fafb',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  content: {
    padding: 16,
    paddingBottom: 110,
    gap: 12,
  },
  topBar: {
    marginTop: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
  },
  textLight: {
    color: '#101828',
  },
  textDark: {
    color: '#f2f4f7',
  },
  cameraTile: {
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 210,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    gap: 8,
  },
  cameraTileText: {
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardLight: {
    borderColor: '#d0d5dd',
    backgroundColor: '#fff',
  },
  cardDark: {
    borderColor: '#374151',
    backgroundColor: '#1f2937',
  },
  preview: {
    width: '100%',
    height: 210,
  },
  label: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputLight: {
    borderColor: '#d0d5dd',
    color: '#101828',
    backgroundColor: '#fff',
  },
  inputDark: {
    borderColor: '#4b5563',
    color: '#f9fafb',
    backgroundColor: '#1f2937',
  },
  descriptionInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 150,
    textAlignVertical: 'top',
  },
  characterCount: {
    color: '#667085',
    fontSize: 12,
    textAlign: 'right',
    marginTop: -6,
  },
  errorText: {
    color: '#b42318',
    fontWeight: '700',
  },
  saveFab: {
    position: 'absolute',
    right: 18,
    bottom: 22,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#0f766e',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
});
