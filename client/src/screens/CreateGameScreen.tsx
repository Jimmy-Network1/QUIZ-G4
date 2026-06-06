import React, {useState} from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {useFetchTriviaCategories, useCreateGame} from '../hooks';
import {LoginScreenBg} from '../assets/images';
import LinearGradient from 'react-native-linear-gradient';
import {colorList} from '../constants/colors';
import CategoriesList from '../components/createGame/CategoriesList';
import {ButtonComponent, GoBackArrow} from '../components';
import {CategoryInterface} from '../types/categories';

type GameScreenRoute = {params: {isSinglePlayer: boolean}};

export default function CreateGameScreen({
  route,
}: {
  route: GameScreenRoute;
}): JSX.Element {
  const {isSinglePlayer} = route.params;
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryInterface | null>(null);
  const [aiTheme, setAiTheme] = useState('');

  const availableCategories = useFetchTriviaCategories();

  const {createRoom, startSinglePlayerGame} = useCreateGame(
    aiTheme ? `AI: ${aiTheme}` : selectedCategory?.name || '',
    aiTheme ? `ai_${aiTheme}` : selectedCategory?.id || '',
    isSinglePlayer,
  );

  const handleSelectCategory = (category: CategoryInterface) => {
    setSelectedCategory(category);
    setAiTheme(''); // Clear AI theme if a category is selected
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
                1. CHOISISSEZ UNE CATÉGORIE
              </Text>
              <View style={styles.glassCard}>
                <CategoriesList
                  categories={availableCategories}
                  onCategorySelect={handleSelectCategory}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                OU 2. THÈME PERSONNALISÉ (IA)
              </Text>
              <View style={styles.glassCard}>
                <Text style={styles.aiDescription}>
                  L'IA générera des questions sur le sujet de votre choix.
                </Text>
                <TextInput
                  style={styles.aiInput}
                  placeholder="Ex: Histoire du Cameroun, Marvel..."
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={aiTheme}
                  onChangeText={text => {
                    setAiTheme(text);
                    setSelectedCategory(null);
                  }}
                />
              </View>
            </View>

            <View style={styles.footer}>
              <ButtonComponent
                variant={aiTheme ? 'default' : 'bluish'}
                title={aiTheme ? "LANCER AVEC L'IA" : 'DÉMARRER'}
                onPress={isSinglePlayer ? startSinglePlayerGame : createRoom}
                disabled={!selectedCategory && !aiTheme}
                style={styles.startButton}
              />
              {selectedCategory && (
                <Text style={styles.selectionText}>
                  Sélection :{' '}
                  <Text style={styles.selectedName}>
                    {selectedCategory.name}
                  </Text>
                </Text>
              )}
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
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 10,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 242, 255, 0.5)',
    textShadowRadius: 5,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  aiDescription: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    marginBottom: 15,
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
  selectionText: {
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 15,
    fontSize: 14,
  },
  selectedName: {
    color: colorList.neonPink,
    fontWeight: 'bold',
  },
});
