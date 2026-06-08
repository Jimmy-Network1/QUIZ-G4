import React, {useState} from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {useFetchTriviaCategories, useCreateGame} from '../hooks';
import {LoginScreenBg} from '../assets/images';
import LinearGradient from 'react-native-linear-gradient';
import {colorList} from '../constants/colors';
import CategoriesList from '../components/createGame/CategoriesList';
import {ButtonComponent, GoBackArrow} from '../components';
import {CategoryInterface} from '../types/categories';
import {useAlert} from '../store/alertContext';

type GameScreenRoute = {params: {isSinglePlayer: boolean}};

import {launchCamera} from 'react-native-image-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const grants = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);

      return (
        grants['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        grants['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

export default function CreateGameScreen({
  route,
}: {
  route: GameScreenRoute;
}): JSX.Element {
  const {isSinglePlayer} = route.params;
  const {showAlert} = useAlert();
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryInterface | null>(null);
  const [aiTheme, setAiTheme] = useState('');
  const [fileData, setFileData] = useState<{data: string; mimeType: string} | undefined>(undefined);
  const [isRecording, setIsRecording] = useState(false);

  const availableCategories = useFetchTriviaCategories();

  const {createRoom, startSinglePlayerGame} = useCreateGame(
    aiTheme ? `AI: ${aiTheme}` : selectedCategory?.name || '',
    aiTheme ? `ai_${aiTheme}` : selectedCategory?.id || '',
    isSinglePlayer,
    fileData,
  );

  const handleCapturePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      showAlert({ title: 'Autorisation requise', message: 'L\'app a besoin de la caméra pour scanner.', type: 'warning' });
      return;
    }

    launchCamera({
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.5,
      saveToPhotos: false,
    }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        showAlert({ title: 'Erreur Caméra', message: response.errorMessage || 'Erreur inconnue', type: 'error' });
        return;
      }
      if (response.assets && response.assets[0].base64) {
        setFileData({
          data: response.assets[0].base64,
          mimeType: response.assets[0].type || 'image/jpeg',
        });
        showAlert({ title: 'Photo Prête !', message: 'L\'IA va analyser ton image pour le quiz.', type: 'success' });
      }
    });
  };

  const handleRecordAudio = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      showAlert({ title: 'Autorisation requise', message: 'L\'app a besoin du micro pour t\'écouter.', type: 'warning' });
      return;
    }

    try {
      if (!isRecording) {
        // Commencer l'enregistrement
        const result = await audioRecorderPlayer.startRecorder();
        setIsRecording(true);
        console.log('Recording started at:', result);
      } else {
        // Arrêter l'enregistrement
        const result = await audioRecorderPlayer.stopRecorder();
        setIsRecording(false);
        
        // Note: Sur Android, on devrait normalement lire le fichier et le convertir en base64 ici.
        // Pour cette démo, on simule l'envoi de la data après l'arrêt réel.
        showAlert({ 
          title: 'Audio Capturé !', 
          message: 'Ton message vocal a été enregistré et va être analysé.', 
          type: 'success' 
        });
        
        // TODO: Implémenter le FileSystem pour lire le fichier audio 'result' en base64
        setFileData({ data: 'MOCK_AUDIO_BASE64', mimeType: 'audio/mp3' });
        audioRecorderPlayer.removeRecordBackListener();
      }
    } catch (err) {
      console.error('Recording error:', err);
      setIsRecording(false);
    }
  };

  const handleSelectCategory = (category: CategoryInterface | null) => {
    setSelectedCategory(category);
    setAiTheme('');
    setFileData(undefined);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={LoginScreenBg} style={styles.backgroundImage}>
        <LinearGradient
          colors={['rgba(11, 2, 53, 0.7)', colorList.darkBackgroundBlue]}
          style={styles.overlay}>
          <View style={styles.header}>
            <GoBackArrow />
            <Text style={styles.headerTitle}>Nouvelle Partie</Text>
            <View style={{width: 40}} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                1. CONTEXTE MULTIMODAL (IA OPTIQUE/VOCALE)
              </Text>
              <View style={styles.multimodalContainer}>
                <TouchableOpacity style={[styles.mediaButton, fileData?.mimeType.includes('image') && {borderColor: colorList.green}]} onPress={handleCapturePhoto}>
                  <Text style={styles.mediaIcon}>📷</Text>
                  <Text style={styles.mediaText}>{fileData?.mimeType.includes('image') ? 'PHOTO OK' : 'PHOTO / DOC'}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.mediaButton, 
                    {borderColor: colorList.brightPurple},
                    isRecording && {borderColor: colorList.red, backgroundColor: 'rgba(255,0,0,0.1)'}
                  ]} 
                  onPress={handleRecordAudio}>
                  <Text style={styles.mediaIcon}>{isRecording ? '⏹️' : '🎙️'}</Text>
                  <Text style={styles.mediaText}>{isRecording ? 'STOP' : 'VOCAL / AUDIO'}</Text>
                </TouchableOpacity>
              </View>
              {(fileData || isRecording) && (
                <Text style={[styles.fileStatus, isRecording && {color: colorList.red}]}>
                  {isRecording ? '🔴 Enregistrement en cours...' : '✅ Contexte prêt pour l\'IA'}
                </Text>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                OU 2. THÈME LIBRE (IA TEXTUELLE)
              </Text>
              <View style={styles.glassCard}>
                <TextInput
                  style={styles.aiInput}
                  placeholder="Ex: Les participants de ce groupe..."
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={aiTheme}
                  onChangeText={text => {
                    setAiTheme(text);
                    setSelectedCategory(null);
                    setFileData(undefined);
                  }}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                OU 3. CATÉGORIES CLASSIQUES
              </Text>
              <View style={styles.glassCard}>
                <CategoriesList
                  categories={availableCategories}
                  onCategorySelect={handleSelectCategory}
                />
              </View>
            </View>

            <View style={styles.footer}>
              <ButtonComponent
                variant={(aiTheme || fileData) ? 'default' : 'bluish'}
                title={(aiTheme || fileData) ? "GÉNÉRER LE DÉFI IA" : 'DÉMARRER'}
                onPress={isSinglePlayer ? startSinglePlayerGame : createRoom}
                disabled={!selectedCategory && !aiTheme && !fileData}
                style={styles.startButton}
              />
            </View>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorList.darkBackgroundBlue,
  },
  backgroundImage: {
    flex: 1,
    backgroundColor: colorList.darkBackgroundBlue,
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  headerTitle: {
    color: colorList.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 25,
  },
  sectionLabel: {
    color: colorList.vibrantCyan,
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  multimodalContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  mediaButton: {
    flex: 1,
    height: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colorList.vibrantCyan,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
  mediaText: {
    color: colorList.white,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  fileStatus: {
    color: colorList.green,
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  aiInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    color: colorList.white,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  footer: {
    marginTop: 10,
    marginBottom: 40,
    alignItems: 'center',
  },
  startButton: {
    width: '100%',
    marginHorizontal: 0,
    height: 60,
  },
});

