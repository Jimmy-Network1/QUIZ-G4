import React from 'react';
import AuthContextProvider from './store/authContext';
import {Navigation} from './navigation/Navigation';
import GameProvider from './store/gameContext';
import {AlertProvider} from './store/alertContext';
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
        <AlertProvider>
          <NavigationContainer theme={MyTheme}>
            <AppContent />
          </NavigationContainer>
        </AlertProvider>
      </GameProvider>
    </AuthContextProvider>
  );
}

function AppContent() {
  useRetrieveCredentials();
  useResetNavOnAuthChange();

  return <Navigation />;
}
