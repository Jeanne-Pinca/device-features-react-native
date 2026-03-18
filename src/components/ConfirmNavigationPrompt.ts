import { Alert } from 'react-native';

type ConfirmNavigationPromptParams = {
  onConfirm: () => void;
  onCancel?: () => void;
};

export function showConfirmNavigationPrompt({ onConfirm, onCancel }: ConfirmNavigationPromptParams) {
  Alert.alert(
    'Unsaved changes',
    'Are you sure you want to go to the home screen? your changes will not be saved.',
    [
      {
        text: 'No',
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: onConfirm,
      },
    ],
  );
}
