import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
  },
  cardLight: {
    backgroundColor: '#fff',
    borderColor: '#d0d5dd',
  },
  cardDark: {
    backgroundColor: '#151515',
    borderColor: '#3a3a3a',
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 12,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  address: {
    fontSize: 15,
    fontWeight: '700',
  },
  description: {
    color: '#667085',
    fontSize: 13,
  },
  textLight: {
    color: '#111111',
  },
  textDark: {
    color: '#f2f2f2',
  },
  date: {
    color: '#667085',
    fontSize: 12,
  },
  actionsRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 2,
  },
});
