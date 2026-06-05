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
}

export enum UnauthenticatedScreens {
  LoginScreen = 'LoginScreen',
  RegisterScreen = 'RegisterScreen',
  ConnectionSelectionScreen = 'ConnectionSelectionScreen',
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
  [AuthenticatedScreens.TournamentWaitingRoomScreen]: {tournamentId: string; isCreator: boolean};
  [AuthenticatedScreens.TournamentBracketScreen]: {tournamentId: string};
  [UnauthenticatedScreens.LoginScreen]: undefined;
  [UnauthenticatedScreens.RegisterScreen]: undefined;
  [UnauthenticatedScreens.ConnectionSelectionScreen]: undefined;
};

export type GameScreenParams = {
  categoryId: string;
  isHost: boolean;
  isSinglePlayer: boolean;
};
