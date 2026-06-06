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
          colors={['rgba(11, 2, 53, 0.7)', colorList.darkBackgroundBlue]}
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
                <Text style={styles.formTitle}>CONNEXION</Text>

                <TouchableOpacity
                  onPress={toggleServerMode}
                  style={styles.serverToggle}>
                  <Text style={styles.serverToggleText}>
                    MODE: {serverMode === 'online' ? '🌐 CLOUD' : '🏠 LOCAL'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>EMAIL</Text>
                  <Input
                    placeholder="votre@email.com"
                    style={styles.input}
                    textStyle={styles.inputText}
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>MOT DE PASSE</Text>
                  <Input
                    placeholder="••••••••"
                    style={styles.input}
                    textStyle={styles.inputText}
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
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
                  title="ENTRER DANS L'ARÈNE"
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
    marginBottom: 30,
  },
  logoText: {
    fontSize: 50,
    fontWeight: '900',
    color: colorList.white,
    letterSpacing: 2,
    textShadowColor: colorList.neonPink,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 15,
  },
  logoAccent: {
    color: colorList.vibrantCyan,
  },
  subtitle: {
    color: colorList.softPink,
    fontSize: 16,
    marginTop: 5,
    letterSpacing: 1,
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 25,
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 255, 0.3)',
    shadowColor: colorList.vibrantCyan,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  formTitle: {
    color: colorList.white,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 15,
    textAlign: 'center',
    letterSpacing: 2,
  },
  serverToggle: {
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colorList.vibrantCyan,
    alignSelf: 'center',
    marginBottom: 20,
  },
  serverToggleText: {
    color: colorList.vibrantCyan,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    color: colorList.vibrantCyan,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
    marginBottom: -10,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 0,
    width: '100%',
    color: colorList.white,
    borderRadius: 10,
  },
  inputText: {
    fontSize: 16,
    fontWeight: '500',
    color: colorList.white,
    textAlign: 'left',
    paddingLeft: 15,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  forgotPasswordText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontStyle: 'italic',
  },
  button: {
    marginTop: 25,
    marginHorizontal: 0,
    height: 55,
    backgroundColor: colorList.brightPurple,
    borderColor: colorList.neonPink,
    borderWidth: 2,
  },
  footerText: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  registerLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  registerLink: {
    color: colorList.vibrantCyan,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
