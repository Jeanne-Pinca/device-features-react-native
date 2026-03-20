import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

export type PromptAction = {
  label: string;
  variant?: 'primary' | 'cancel';
  onPress?: () => void;
};

export type PromptOptions = {
  title: string;
  message: string;
  actions: PromptAction[];
};

let openPrompt: ((options: PromptOptions) => void) | null = null;

export function showThemedPrompt(options: PromptOptions) {
  if (!openPrompt) {
    return;
  }

  openPrompt(options);
}

type ThemedPromptProps = {
  isDarkMode: boolean;
};

export function ThemedPrompt({ isDarkMode }: ThemedPromptProps) {
  const [options, setOptions] = useState<PromptOptions | null>(null);

  useEffect(() => {
    openPrompt = (nextOptions) => setOptions(nextOptions);

    return () => {
      openPrompt = null;
    };
  }, []);

  const closePrompt = () => setOptions(null);

  const handleAction = (action: PromptAction) => {
    closePrompt();
    action.onPress?.();
  };

  return (
    <Modal visible={!!options} animationType="fade" transparent>
      <View style={styles.backdrop}>
        <View style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]}>
          <Text style={[styles.title, isDarkMode ? styles.textDark : styles.textLight]}>{options?.title}</Text>
          <Text style={[styles.message, isDarkMode ? styles.textDark : styles.textLight]}>{options?.message}</Text>

          <View style={styles.actionsRow}>
            {options?.actions.map((action) => (
              <Pressable
                key={action.label}
                onPress={() => handleAction(action)}
                style={[
                  styles.actionButton,
                  action.variant === 'cancel'
                    ? (isDarkMode ? styles.actionButtonCancelDark : styles.actionButtonCancelLight)
                    : (isDarkMode ? styles.actionButtonDark : styles.actionButtonLight),
                ]}
              >
                <Text
                  style={[
                    styles.actionLabel,
                    action.variant === 'cancel'
                      ? (isDarkMode ? styles.actionLabelCancelDark : styles.actionLabelCancelLight)
                      : (isDarkMode ? styles.actionLabelDark : styles.actionLabelLight),
                  ]}
                >
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  cardLight: {
    backgroundColor: '#ffffff',
    borderColor: '#cfcfcf',
  },
  cardDark: {
    backgroundColor: '#151515',
    borderColor: '#3a3a3a',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  textLight: {
    color: '#111111',
  },
  textDark: {
    color: '#f2f2f2',
  },
  actionsRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  actionButton: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 92,
  },
  actionButtonLight: {
    backgroundColor: '#111111',
  },
  actionButtonDark: {
    backgroundColor: '#ffffff',
  },
  actionButtonCancelLight: {
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#111111',
  },
  actionButtonCancelDark: {
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  actionLabelLight: {
    color: '#111111',
  },
  actionLabelDark: {
    color: '#111111',
  },
  actionLabelCancelLight: {
    color: '#111111',
  },
  actionLabelCancelDark: {
    color: '#f2f2f2',
  },
});