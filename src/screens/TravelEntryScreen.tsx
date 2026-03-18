import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { requestPermissionsAsync } from 'expo-notifications/build/NotificationPermissions';
import scheduleNotificationAsync from 'expo-notifications/build/scheduleNotificationAsync';
import setNotificationChannelAsync from 'expo-notifications/build/setNotificationChannelAsync';
import { AndroidImportance } from 'expo-notifications/build/NotificationChannelManager.types';
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';

import { showConfirmNavigationPrompt } from '../components/ConfirmNavigationPrompt';
import type { RootStackParamList } from './HomeScreen';
import type { TravelEntry } from '../types/travelEntry';
import { styles } from './styles/TravelEntryScreen.styles';

type TravelEntryScreenProps = NativeStackScreenProps<RootStackParamList, 'TravelEntry'> & {
  onSaveEntry: (entry: TravelEntry) => void;
  isDarkMode: boolean;
};

type ValidationErrors = {
  image?: string;
  title?: string;
  address?: string;
  description?: string;
};

export function TravelEntryScreen({ navigation, onSaveEntry, isDarkMode }: TravelEntryScreenProps) {
  const [entryTitle, setEntryTitle] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    const askPermissions = async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await Location.requestForegroundPermissionsAsync();
      await requestPermissionsAsync();

      await setNotificationChannelAsync('travel-entry', {
        name: 'Travel Entry Notifications',
        importance: AndroidImportance.DEFAULT,
      });

      setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
    };

    void askPermissions();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      const hasUnsavedChanges = !!(imageUri || entryTitle.trim() || address.trim() || description.trim());
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
          Alert.alert('Location denied', 'Location permission is required to resolve your current address.');
          return;
        }
      }

      const currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const geocode = await Location.reverseGeocodeAsync(currentLocation.coords);
      const firstAddress = geocode[0];

      if (!firstAddress) {
        setAddress('Address unavailable');
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
    } catch {
      setAddress('Address unavailable');
      Alert.alert('Location error', 'Unable to fetch location right now.');
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const handleTakePicture = async () => {
    const cameraPermission = await ImagePicker.getCameraPermissionsAsync();
    if (cameraPermission.status !== 'granted') {
      const requested = await ImagePicker.requestCameraPermissionsAsync();
      if (!requested.granted) {
        Alert.alert('Camera denied', 'Camera permission is required to capture a travel entry photo.');
        return;
      }
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    setImageUri(result.assets[0].uri);
    setErrors((previous) => ({ ...previous, image: undefined }));
    await getAddressFromCurrentLocation();
  };

  const notifyOnSave = async () => {
    try {
      await scheduleNotificationAsync({
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
      return;
    }

    const nextEntry: TravelEntry = {
      id: `${Date.now()}`,
      title: entryTitle.trim(),
      description: description.trim(),
      imageUri,
      address: address.trim(),
      createdAt: new Date().toISOString(),
    };

    onSaveEntry(nextEntry);
    await notifyOnSave();
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode ? styles.containerDark : styles.containerLight]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.topBar}>
          <Text style={[styles.screenTitle, isDarkMode ? styles.textDark : styles.textLight]}>New Entry</Text>
        </View>

        <Pressable
          style={[styles.cameraTile, isDarkMode ? styles.cardDark : styles.cardLight]}
          onPress={() => void handleTakePicture()}
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.preview} />
          ) : (
            <>
              <Ionicons name="camera-outline" size={34} color={isDarkMode ? '#f2f4f7' : '#101828'} />
              <Text style={[styles.cameraTileText, isDarkMode ? styles.textDark : styles.textLight]}>take a photo</Text>
            </>
          )}
        </Pressable>
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
          editable={false}
          placeholder={isLoadingAddress ? 'Resolving address...' : 'Address will auto-fill after taking a photo'}
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

      <Pressable style={styles.saveFab} onPress={() => void handleSave()} accessibilityLabel="Save entry">
        <Ionicons name="save-outline" size={24} color="#ffffff" />
      </Pressable>
    </SafeAreaView>
  );
}
