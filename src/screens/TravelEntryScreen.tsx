import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { ThemeToggle } from '../components/ThemeToggle';

import { BackHeader } from '../components/BackHeader';
import { showConfirmNavigationPrompt } from '../components/ConfirmNavigationPrompt';
import { showPermissionPrompt } from '../components/PermissionPrompt';
import { showThemedPrompt } from '../components/ThemedPrompt';
import type { RootStackParamList } from './HomeScreen';
import type { TravelEntry } from '../types/travelEntry';
import { styles } from './styles/TravelEntryScreen.styles';

type TravelEntryScreenProps = NativeStackScreenProps<RootStackParamList, 'TravelEntry'> & {
  entries: TravelEntry[];
  onSaveEntry: (entry: TravelEntry) => boolean;
  onUpdateEntry: (entry: TravelEntry) => boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
};

type ValidationErrors = {
  image?: string;
  title?: string;
  address?: string;
  description?: string;
};

export function TravelEntryScreen({
  navigation,
  route,
  entries,
  onSaveEntry,
  onUpdateEntry,
  isDarkMode,
  onToggleTheme,
}: TravelEntryScreenProps & { onToggleTheme: () => void }) {
  const [entryTitle, setEntryTitle] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const skipUnsavedPromptRef = useRef(false);
  const initialValuesRef = useRef({
    entryTitle: '',
    imageUri: '',
    address: '',
    description: '',
  });

  const editingEntry = useMemo(() => {
    const entryId = route.params?.entryId;
    if (!entryId) {
      return undefined;
    }

    return entries.find((entry) => entry.id === entryId);
  }, [route.params?.entryId, entries]);

  const isEditing = !!editingEntry;

  useEffect(() => {
    const nextValues = {
      entryTitle: editingEntry?.title ?? '',
      imageUri: editingEntry?.imageUri ?? '',
      address: editingEntry?.address ?? '',
      description: editingEntry?.description ?? '',
    };

    setEntryTitle(nextValues.entryTitle);
    setImageUri(nextValues.imageUri);
    setAddress(nextValues.address);
    setDescription(nextValues.description);
    setErrors({});
    initialValuesRef.current = nextValues;
  }, [editingEntry]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      if (skipUnsavedPromptRef.current) {
        return;
      }

      const hasUnsavedChanges =
        imageUri !== initialValuesRef.current.imageUri
        || entryTitle.trim() !== initialValuesRef.current.entryTitle.trim()
        || address.trim() !== initialValuesRef.current.address.trim()
        || description.trim() !== initialValuesRef.current.description.trim();
      if (!hasUnsavedChanges) {
        return;
      }

      event.preventDefault();
      showConfirmNavigationPrompt({
        onConfirm: () => navigation.dispatch(event.data.action),
      });
    });

    return unsubscribe;
  }, [navigation, imageUri, entryTitle, address, description]);

  useFocusEffect(
    useCallback(() => {
      skipUnsavedPromptRef.current = false;

      return () => {
        setEntryTitle('');
        setImageUri('');
        setAddress('');
        setDescription('');
        setErrors({});
        setIsLoadingAddress(false);
      };
    }, []),
  );

  const validationErrors = useMemo(() => {
    const nextErrors: ValidationErrors = {};

    if (!entryTitle.trim()) {
      nextErrors.title = 'Entry title is required.';
    }

    if (!imageUri) {
      nextErrors.image = 'Photo is required.';
    }

    if (!address.trim()) {
      nextErrors.address = 'Address is required.';
    } else if (address.trim().length < 5) {
      nextErrors.address = 'Address must be at least 5 characters.';
    }

    if (!description.trim()) {
      nextErrors.description = 'Description is required.';
    } else if (description.length > 1000) {
      nextErrors.description = 'Description must be 1000 characters or less.';
    }

    return nextErrors;
  }, [address, description, entryTitle, imageUri]);

  const validateBeforeSave = () => {
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const getAddressFromCurrentLocation = async () => {
    setIsLoadingAddress(true);

    try {
      const locationPermission = await Location.getForegroundPermissionsAsync();
      if (locationPermission.status !== 'granted') {
        const requested = await Location.requestForegroundPermissionsAsync();
        if (requested.status !== 'granted') {
          setAddress('Location permission denied');
          setErrors((previous) => ({ ...previous, address: undefined }));
          showPermissionPrompt({
            permissionName: 'Location',
            reason: 'Enable location permission in settings to auto-fill your current address.',
          });
          return;
        }
      }

      const currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const geocode = await Location.reverseGeocodeAsync(currentLocation.coords);
      const firstAddress = geocode[0];

      if (!firstAddress) {
        setAddress('Address unavailable');
        setErrors((previous) => ({ ...previous, address: undefined }));
        return;
      }

      const formatted = [
        firstAddress.name,
        firstAddress.street,
        firstAddress.city,
        firstAddress.region,
        firstAddress.postalCode,
        firstAddress.country,
      ]
        .filter(Boolean)
        .join(', ');

      setAddress(formatted || 'Address unavailable');
      setErrors((previous) => ({ ...previous, address: undefined }));
    } catch {
      setAddress('Address unavailable');
      setErrors((previous) => ({ ...previous, address: undefined }));
      showThemedPrompt({
        title: 'Location error',
        message: 'Unable to fetch location right now.',
        actions: [{ label: 'OK' }],
      });
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const handleTakePicture = async () => {
    const cameraPermission = await ImagePicker.getCameraPermissionsAsync();
    if (cameraPermission.status !== 'granted') {
      const requestedCamera = await ImagePicker.requestCameraPermissionsAsync();
      const cameraGranted = requestedCamera.status === 'granted';

      if (!cameraGranted) {
        showPermissionPrompt({
          permissionName: 'Camera',
          reason: 'Enable camera permission in settings to capture travel photos.',
        });
        return;
      }
    }

    const locationPermission = await Location.getForegroundPermissionsAsync();
    if (locationPermission.status !== 'granted') {
      const requestedLocation = await Location.requestForegroundPermissionsAsync();
      const locationGranted = requestedLocation.status === 'granted';

      if (!locationGranted) {
        showPermissionPrompt({
          permissionName: 'Location',
          reason: 'Enable location permission in settings to auto-fill your address after taking a photo.',
        });
      }
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    if (!result.assets?.length) {
      return;
    }

    const capturedImageUri = result.assets[0].uri;
    setImageUri(capturedImageUri);
    setErrors((previous) => ({ ...previous, image: undefined }));
    await getAddressFromCurrentLocation();
  };

  const handleRemovePhoto = () => {
    showThemedPrompt({
      title: 'Remove photo?',
      message: 'This will remove the selected photo from this entry.',
      actions: [
        {
          label: 'Cancel',
          variant: 'cancel',
        },
        {
          label: 'Remove',
          onPress: () => {
            setImageUri('');
            setIsImagePreviewOpen(false);
          },
        },
      ],
    });
  };

  const notifyOnSave = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Travel entry saved',
          body: 'Your travel diary entry has been saved successfully.',
        },
        trigger: null,
      });
    } catch {
      // Notification failures should not block save flow.
    }
  };

  const handleSave = async () => {
    if (!validateBeforeSave()) {
      showThemedPrompt({
        title: 'Incomplete entry',
        message: 'Please complete all required fields before saving.',
        actions: [{ label: 'OK' }],
      });
      return;
    }

    const nextEntry: TravelEntry = {
      id: editingEntry?.id ?? `${Date.now()}`,
      title: entryTitle.trim(),
      description: description.trim(),
      imageUri,
      address: address.trim(),
      createdAt: editingEntry?.createdAt ?? new Date().toISOString(),
    };

    const saved = isEditing ? onUpdateEntry(nextEntry) : onSaveEntry(nextEntry);
    if (!saved) {
      showThemedPrompt({
        title: 'Save failed',
        message: 'Entry did not pass validation. Please review your fields and try again.',
        actions: [{ label: 'OK' }],
      });
      return;
    }

    await notifyOnSave();
    skipUnsavedPromptRef.current = true;
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode ? styles.containerDark : styles.containerLight]}>
      <View style={styles.topBar}>
        <BackHeader
          title={isEditing ? 'Edit Entry' : 'New Entry'}
          isDarkMode={isDarkMode}
          onBack={() => navigation.goBack()}
        />
        <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {imageUri ? (
          <Pressable
            style={[styles.cameraTile, isDarkMode ? styles.cardDark : styles.cardLight]}
            onPress={() => setIsImagePreviewOpen(true)}
          >
            <Image source={{ uri: imageUri }} style={styles.preview} />
          </Pressable>
        ) : (
          <Pressable
            style={[styles.cameraTile, isDarkMode ? styles.cameraTileDark : styles.cameraTileLight]}
            onPress={() => void handleTakePicture()}
          >
            <View style={{ flex: 1, width: '100%', height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="camera-outline" size={34} color={isDarkMode ? '#f2f2f2' : '#111111'} style={{ marginBottom: 8 }} />
              <Text style={[styles.cameraTileText, { color: isDarkMode ? '#f2f2f2' : '#111111', textAlign: 'center', width: '100%' }]}>TAKE A PHOTO</Text>
            </View>
          </Pressable>
        )}
        {!!imageUri && (
          <View style={styles.photoActionsRow}>
            <Pressable
              style={[styles.photoActionIconButton, isDarkMode ? styles.photoActionIconButtonDark : styles.photoActionIconButtonLight]}
              onPress={() => void handleTakePicture()}
              accessibilityRole="button"
              accessibilityLabel="Retake photo"
            >
              <Ionicons name="camera-reverse-outline" size={20} color={isDarkMode ? '#f2f2f2' : '#111111'} />
            </Pressable>

            <Pressable
              style={[styles.photoActionIconButton, isDarkMode ? styles.photoActionIconButtonDark : styles.photoActionIconButtonLight]}
              onPress={handleRemovePhoto}
              accessibilityRole="button"
              accessibilityLabel="Remove photo"
            >
              <Ionicons name="trash-outline" size={20} color="#b42318" />
            </Pressable>
          </View>
        )}
        {!!errors.image && <Text style={styles.errorText}>{errors.image}</Text>}

        <Text style={[styles.label, isDarkMode ? styles.textDark : styles.textLight]}>Entry Title</Text>
        <TextInput
          value={entryTitle}
          onChangeText={(value) => {
            setEntryTitle(value);
            setErrors((previous) => ({ ...previous, title: undefined }));
          }}
          placeholder="Give this entry a title"
          placeholderTextColor="#98a2b3"
          style={[styles.input, isDarkMode ? styles.inputDark : styles.inputLight]}
          maxLength={120}
        />
        {!!errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

        <Text style={[styles.label, isDarkMode ? styles.textDark : styles.textLight]}>Location</Text>
        <TextInput
          value={address}
          onChangeText={(value) => {
            setAddress(value);
            setErrors((previous) => ({ ...previous, address: undefined }));
          }}
          placeholder={
            isLoadingAddress
              ? 'Resolving address...'
              : 'Address auto-fills after photo, but you can edit it'
          }
          placeholderTextColor="#98a2b3"
          style={[styles.input, isDarkMode ? styles.inputDark : styles.inputLight]}
          multiline
        />
        {!!errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

        <Text style={[styles.label, isDarkMode ? styles.textDark : styles.textLight]}>Description</Text>
        <TextInput
          value={description}
          onChangeText={(value) => {
            setDescription(value);
            setErrors((previous) => ({ ...previous, description: undefined }));
          }}
          placeholder="Write your travel notes"
          placeholderTextColor="#98a2b3"
          style={[styles.descriptionInput, isDarkMode ? styles.inputDark : styles.inputLight]}
          multiline
          maxLength={1000}
        />
        <Text style={styles.characterCount}>{description.length}/1000</Text>
        {!!errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
      </ScrollView>

      <Pressable
        style={isDarkMode ? styles.saveFabDark : styles.saveFabLight}
        onPress={() => void handleSave()}
        accessibilityLabel="Save entry"
      >
        <Ionicons
          name="save-outline"
          size={24}
          color={isDarkMode ? '#111111' : '#ffffff'}
        />
      </Pressable>

      <Modal visible={isImagePreviewOpen} animationType="fade" transparent>
        <View style={styles.previewModalBackdrop}>
          <Pressable style={styles.previewModalCloseButton} onPress={() => setIsImagePreviewOpen(false)}>
            <Ionicons name="close" size={22} color="#ffffff" />
          </Pressable>
          <Image source={{ uri: imageUri }} style={styles.previewModalImage} resizeMode="contain" />
        </View>
      </Modal>
    </SafeAreaView>
  );
}
