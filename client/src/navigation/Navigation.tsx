import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SplashScreen} from '../screens';
import {AuthContext} from '../store/authContext';
import {InitialScreens, RootStackParamList} from '../types/navigation';
import {authenticatedScreens, unauthenticatedScreens} from './navigationConfig';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Navigation() {
  const {isAuthenticated} = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={InitialScreens.SplashScreen}
        component={SplashScreen}
      />

      {isAuthenticated
        ? (authenticatedScreens as any[]).map(screen => (
            <Stack.Screen
              key={screen.name}
              name={screen.name}
              component={screen.component}
            />
          ))
        : (unauthenticatedScreens as any[]).map(screen => (
            <Stack.Screen
              key={screen.name}
              name={screen.name}
              component={screen.component}
            />
          ))}
    </Stack.Navigator>
  );
}
