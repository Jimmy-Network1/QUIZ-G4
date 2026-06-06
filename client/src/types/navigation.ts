export enum InitialScreens {
  SplashScreen = 'SplashScreen',
  LoadingScreen = 'LoadingScreen',
}

export enum AuthenticatedScreens {
  MainMenuScreen = 'MainMenuScreen',
  MultiplayerLobbyScreen = 'MultiplayerLobbyScreen',
  GameScreen = 'GameScreen',
  CreateGameScreen = 'CreateGameScreen',
  SinglePlayerCreateGameScreen = 'SinglePlayerCreateGameScreen',
  AccountScreen = 'AccountScreen',
  TournamentListScreen = 'TournamentListScreen',
  TournamentWaitingRoomScreen = 'TournamentWaitingRoomScreen',
  TournamentBracketScreen = 'TournamentBracketScreen',
  LocalWifiMenuScreen = 'LocalWifiMenuScreen',
  LocalWifiHostScreen = 'LocalWifiHostScreen',
  LocalWifiJoinScreen = 'LocalWifiJoinScreen',
  LocalGameScreen = 'LocalGameScreen',
  LocalBluetoothScreen = 'LocalBluetoothScreen',
}

export enum UnauthenticatedScreens {
  LoginScreen = 'LoginScreen',
  RegisterScreen = 'RegisterScreen',
  ConnectionSelectionScreen = 'ConnectionSelectionScreen',
  LocalPseudoScreen = 'LocalPseudoScreen',
}

export type RootStackParamList = {
  [InitialScreens.SplashScreen]: undefined;
  [InitialScreens.LoadingScreen]: undefined;
  [AuthenticatedScreens.MainMenuScreen]: undefined;
  [AuthenticatedScreens.MultiplayerLobbyScreen]: undefined;
  [AuthenticatedScreens.GameScreen]: GameScreenParams;
  [AuthenticatedScreens.CreateGameScreen]: {isSinglePlayer: boolean};
  [AuthenticatedScreens.AccountScreen]: undefined;
  [AuthenticatedScreens.TournamentListScreen]: undefined;
  [AuthenticatedScreens.TournamentWaitingRoomScreen]: {
    tournamentId: string;
    isCreator: boolean;
  };
  [AuthenticatedScreens.TournamentBracketScreen]: {tournamentId: string};
  [AuthenticatedScreens.LocalWifiMenuScreen]: undefined;
  [AuthenticatedScreens.LocalWifiHostScreen]: {gameMode: '1v1' | 'tournament'};
  [AuthenticatedScreens.LocalWifiJoinScreen]: {gameMode: '1v1' | 'tournament'};
  [AuthenticatedScreens.LocalGameScreen]: LocalGameScreenParams;
  [AuthenticatedScreens.LocalBluetoothScreen]: undefined;
  [UnauthenticatedScreens.LoginScreen]: undefined;
  [UnauthenticatedScreens.RegisterScreen]: undefined;
  [UnauthenticatedScreens.ConnectionSelectionScreen]: undefined;
  [UnauthenticatedScreens.LocalPseudoScreen]: undefined;
};

export type LocalGameScreenParams = {
  isHost: boolean;
  gameMode: '1v1' | 'tournament';
  categoryId: string;
  questions?: import('./questions').QuestionInterface[];
};

export type GameScreenParams = {
  categoryId: string;
  isHost: boolean;
  isSinglePlayer: boolean;
};
