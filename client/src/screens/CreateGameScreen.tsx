import React, {useState} from 'react';
import {ImageBackground, StyleSheet, View, Text, TextInput} from 'react-native';
import {useFetchTriviaCategories, useCreateGame} from '../hooks';
import {LobbyBg} from '../assets/images';
import {LinearGradient} from 'react-native-linear-gradient';
import {colorList} from '../constants/colors';
import CategoriesList from '../components/createGame/CategoriesList';
import {ButtonComponent} from '../components';
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
    <ImageBackground source={LobbyBg} style={styles.imageBackground}>
      <LinearGradient
        colors={[
          'rgba(0,0,0,0.8)',
          'rgba(0,0,0,0.3)',
          'rgba(0,0,0,0.2)',
          'rgba(0,0,0,0.4)',
          'rgba(0,0,0,1)',
        ]}
        style={styles.linearGradient}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}>
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>1. CHOOSE CATEGORY</Text>
          <CategoriesList
            categories={availableCategories}
            onCategorySelect={handleSelectCategory}
          />

          <View style={styles.aiSection}>
            <Text style={styles.sectionTitle}>OR 2. ASK THE AI A THEME</Text>
            <TextInput
              style={styles.aiInput}
              placeholder="Ex: Cameroonian History, Marvel Movies..."
              placeholderTextColor="#888"
              value={aiTheme}
              onChangeText={text => {
                setAiTheme(text);
                setSelectedCategory(null);
              }}
            />
          </View>

          <ButtonComponent
            variant="bluish"
            title={aiTheme ? 'START AI BATTLE' : 'START GAME'}
            onPress={isSinglePlayer ? startSinglePlayerGame : createRoom}
            disabled={!selectedCategory && !aiTheme}
          />
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  linearGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingTop: 40,
  },
  sectionTitle: {
    color: colorList.vibrantCyan,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 10,
    textShadowColor: colorList.vibrantCyan,
    textShadowRadius: 5,
  },
  aiSection: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    margin: 10,
    borderRadius: 15,
    borderColor: colorList.brightPurple,
    borderWidth: 1,
  },
  aiInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
  },
  title: {
    textAlign: 'center',
    padding: 20,
    color: '#fff',
    textShadowColor: colorList.brightPurple,
    textShadowRadius: 10,
    fontWeight: '400',
    fontSize: 25,
  },
});
