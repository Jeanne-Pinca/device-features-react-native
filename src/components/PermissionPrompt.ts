import { Linking } from 'react-native';

import { showThemedPrompt } from './ThemedPrompt';

type PermissionPromptParams = {
  permissionName: string;
  reason: string;
};

export function showPermissionPrompt({ permissionName, reason }: PermissionPromptParams) {
  showThemedPrompt({
    title: `${permissionName} permission needed`,
    message: reason,
    actions: [
      {
        label: 'Not now',
        variant: 'cancel',
      },
      {
        label: 'Open Settings',
        onPress: () => {
          void Linking.openSettings();
        },
      },
    ],
  });
}
