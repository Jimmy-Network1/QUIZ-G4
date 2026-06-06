import {
  LoginScreen,
  RegisterScreen,
  CreateGameScreen,
  MainMenuScreen,
  MultiplayerLobbyScreen,
  GameScreen,
  AccountScreen,
  SplashScreen,
  ConnectionSelectionScreen,
  LocalPseudoScreen,
  TournamentListScreen,
  TournamentWaitingRoomScreen,
  TournamentBracketScreen,
} from '../screens';
import LocalWifiMenuScreen from '../screens/local/LocalWifiMenuScreen';
import LocalWifiHostScreen from '../screens/local/LocalWifiHostScreen';
import LocalWifiJoinScreen from '../screens/local/LocalWifiJoinScreen';
import LocalGameScreen from '../screens/local/LocalGameScreen';
import LocalBluetoothScreen from '../screens/local/LocalBluetoothScreen';
import {
  AuthenticatedScreens,
  UnauthenticatedScreens,
  InitialScreens,
} from '../types/navigation';

export const authenticatedScreens = [
  {name: AuthenticatedScreens.MainMenuScreen, component: MainMenuScreen},
  {
    name: AuthenticatedScreens.MultiplayerLobbyScreen,
    component: MultiplayerLobbyScreen,
  },
  {name: AuthenticatedScreens.CreateGameScreen, component: CreateGameScreen},
  {name: AuthenticatedScreens.GameScreen, component: GameScreen},
  {name: AuthenticatedScreens.AccountScreen, component: AccountScreen},
  {
    name: AuthenticatedScreens.TournamentListScreen,
    component: TournamentListScreen,
  },
  {
    name: AuthenticatedScreens.TournamentWaitingRoomScreen,
    component: TournamentWaitingRoomScreen,
  },
  {
    name: AuthenticatedScreens.TournamentBracketScreen,
    component: TournamentBracketScreen,
  },
  {
    name: AuthenticatedScreens.LocalWifiMenuScreen,
    component: LocalWifiMenuScreen,
  },
  {
    name: AuthenticatedScreens.LocalWifiHostScreen,
    component: LocalWifiHostScreen,
  },
  {
    name: AuthenticatedScreens.LocalWifiJoinScreen,
    component: LocalWifiJoinScreen,
  },
  {name: AuthenticatedScreens.LocalGameScreen, component: LocalGameScreen},
  {
    name: AuthenticatedScreens.LocalBluetoothScreen,
    component: LocalBluetoothScreen,
  },
];

export const unauthenticatedScreens = [
  {
    name: UnauthenticatedScreens.ConnectionSelectionScreen,
    component: ConnectionSelectionScreen,
  },
  {
    name: UnauthenticatedScreens.LocalPseudoScreen,
    component: LocalPseudoScreen,
  },
  {name: UnauthenticatedScreens.LoginScreen, component: LoginScreen},
  {name: UnauthenticatedScreens.RegisterScreen, component: RegisterScreen},
];

export const initialScreen = {
  name: InitialScreens.SplashScreen,
  component: SplashScreen,
};
