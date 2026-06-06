import React, {useState, ReactNode, createContext} from 'react';

type AuthContextType = {
  token: string;
  email: string;
  userName: string;
  userId: string;
  serverMode: 'online' | 'local';
  isLocalSession: boolean;
  isAuthenticated: boolean;
  authenticate: (
    token: string,
    email: string,
    userName: string,
    userId: string,
  ) => void;
  authenticateLocal: (pseudo: string) => void;
  setServerMode: (mode: 'online' | 'local') => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  token: '',
  email: '',
  userName: '',
  userId: '',
  serverMode: 'online',
  isLocalSession: false,
  isAuthenticated: false,
  authenticate: () => {},
  authenticateLocal: () => {},
  setServerMode: () => {},
  logout: () => {},
});

interface AuthContextProviderProps {
  children: ReactNode;
}

function AuthContextProvider({children}: AuthContextProviderProps) {
  const [authToken, setAuthToken] = useState<string>('');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authUserName, setAuthUserName] = useState<string>('');
  const [authUserId, setAuthUserId] = useState<string>('');
  const [serverMode, setServerMode] = useState<'online' | 'local'>('online');
  const [isLocalSession, setIsLocalSession] = useState(false);

  function authenticate(
    token: string,
    email: string,
    userName: string,
    userId: string,
  ) {
    setAuthToken(token);
    setAuthEmail(email);
    setAuthUserName(userName);
    setAuthUserId(userId);
    setIsLocalSession(false);
  }

  function authenticateLocal(pseudo: string) {
    setAuthUserName(pseudo);
    setAuthUserId(`local_${Date.now()}`);
    setAuthToken('');
    setAuthEmail('');
    setIsLocalSession(true);
  }

  function logout() {
    setAuthToken('');
    setAuthEmail('');
    setAuthUserName('');
    setAuthUserId('');
    setIsLocalSession(false);
  }

  const value = {
    token: authToken,
    email: authEmail,
    userName: authUserName,
    userId: authUserId,
    serverMode: serverMode,
    isLocalSession: isLocalSession,
    isAuthenticated: !!authToken || isLocalSession,
    authenticate: authenticate,
    authenticateLocal: authenticateLocal,
    setServerMode: setServerMode,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
