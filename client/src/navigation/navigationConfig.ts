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
  TournamentListScreen,
  TournamentWaitingRoomScreen,
  TournamentBracketScreen,
} from '../screens';
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
];

export const unauthenticatedScreens = [
  {
    name: UnauthenticatedScreens.ConnectionSelectionScreen,
    component: ConnectionSelectionScreen,
  },
  {name: UnauthenticatedScreens.LoginScreen, component: LoginScreen},
  {name: UnauthenticatedScreens.RegisterScreen, component: RegisterScreen},
];

export const initialScreen = {
  name: InitialScreens.SplashScreen,
  component: SplashScreen,
};
