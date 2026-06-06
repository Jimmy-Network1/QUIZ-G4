import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Input from '../components/common/Input';
import ButtonComponent from '../components/common/ButtonComponent';
import {LoginScreenBg} from '../assets/images';
import {colorList} from '../constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import {useLogin} from '../hooks';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList, UnauthenticatedScreens} from '../types/navigation';
import {AuthContext} from '../store/authContext';
import {setGlobalServerMode} from '../config';

export default function LoginScreen(): JSX.Element {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {serverMode, setServerMode} = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {loginHandler, isLoading} = useLogin(email, password);

  useEffect(() => {
    setGlobalServerMode(serverMode);
  }, [serverMode]);

  const toggleServerMode = () => {
    const newMode = serverMode === 'online' ? 'local' : 'online';
    setServerMode(newMode);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={LoginScreenBg}
        style={styles.backgroundImage}
        resizeMode="cover">
        <LinearGradient
          colors={['rgba(11, 2, 53, 0.4)', colorList.darkBackgroundBlue]}
          style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}>
              <View style={styles.headerContainer}>
                <Text style={styles.logoText}>
                  QUIZ<Text style={styles.logoAccent}>G4</Text>
                </Text>
                <Text style={styles.subtitle}>
                  S'affronter, Apprendre, Gagner
                </Text>
              </View>

              <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Connexion</Text>

                <TouchableOpacity
                  onPress={toggleServerMode}
                  style={styles.serverToggle}>
                  <Text style={styles.serverToggleText}>
                    Mode: {serverMode === 'online' ? '🌐 Cloud' : '🏠 Local'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.inputWrapper}>
                  <Input
                    placeholder="Email"
                    style={styles.input}
                    textStyle={styles.inputText}
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <Input
                    placeholder="Mot de passe"
                    style={styles.input}
                    textStyle={styles.inputText}
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    secureTextEntry={true}
                    onChangeText={setPassword}
                  />
                </View>

                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>
                    Mot de passe oublié ?
                  </Text>
                </TouchableOpacity>

                <ButtonComponent
                  title="Se connecter"
                  onPress={loginHandler}
                  style={styles.button}
                  isLoading={isLoading}
                />

                <View style={styles.footerText}>
                  <Text style={styles.registerLabel}>Nouveau ici ? </Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(UnauthenticatedScreens.RegisterScreen)
                    }>
                    <Text style={styles.registerLink}>Créer un compte</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorList.darkBackgroundBlue,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 20,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 50,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 60,
    fontWeight: '900',
    color: colorList.white,
    letterSpacing: 2,
    textShadowColor: colorList.neonPink,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
  },
  logoAccent: {
    color: colorList.neonPink,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginTop: 5,
    letterSpacing: 1,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 30,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)', // Note: backdropFilter doesn't work in standard RN, but we use opacity for similar feel
  },
  formTitle: {
    color: colorList.white,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputWrapper: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 0,
    width: '100%',
    color: colorList.white,
  },
  inputText: {
    fontSize: 16,
    fontWeight: '500',
    color: colorList.white,
    textAlign: 'left',
    paddingLeft: 15,
  },
  button: {
    marginTop: 30,
    marginHorizontal: 0,
    height: 55,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  forgotPasswordText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  footerText: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  registerLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  registerLink: {
    color: colorList.neonPink,
    fontWeight: 'bold',
    fontSize: 16,
  },
  serverToggle: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'center',
    marginBottom: 20,
  },
  serverToggleText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
