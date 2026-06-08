import React from 'react';
import AuthContextProvider from './store/authContext';
import {Navigation} from './navigation/Navigation';
import GameProvider from './store/gameContext';
import {useRetrieveCredentials, useResetNavOnAuthChange} from './hooks';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {colorList} from './constants/colors';

const MyTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colorList.darkBackgroundBlue,
    card: colorList.darkBackgroundBlue,
    text: colorList.white,
    border: 'transparent',
  },
};

export default function App() {
  return (
    <AuthContextProvider>
      <GameProvider>
        <NavigationContainer theme={MyTheme}>
          <AppContent />
        </NavigationContainer>
      </GameProvider>
    </AuthContextProvider>
  );
}

function AppContent() {
  useRetrieveCredentials();
  useResetNavOnAuthChange();

  return <Navigation />;
}
