import { showThemedPrompt } from './ThemedPrompt';

type ConfirmNavigationPromptParams = {
  onConfirm: () => void;
  onCancel?: () => void;
};

export function showConfirmNavigationPrompt({ onConfirm, onCancel }: ConfirmNavigationPromptParams) {
  showThemedPrompt({
    title: 'Unsaved changes',
    message: 'Leave this screen? Your unsaved changes will be lost.',
    actions: [
      {
        label: 'No',
        variant: 'cancel',
        onPress: onCancel,
      },
      {
        label: 'Yes',
        onPress: onConfirm,
      },
    ],
  });
}
