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
import {Input, ButtonComponent, GlassCard} from '../components/common';
import {LoginScreenBg} from '../assets/images';
import {colorList} from '../constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import {useLogin} from '../hooks';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList, UnauthenticatedScreens} from '../types/navigation';
import {AuthContext} from '../store/authContext';
import {setGlobalServerMode} from '../config';
import Animated, {FadeInDown} from 'react-native-reanimated';

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
          colors={[colorList.appleGradientStart, colorList.appleGradientEnd]}
          style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}>
              <Animated.View
                entering={FadeInDown.duration(800)}
                style={styles.headerContainer}>
                <Text style={styles.logoText}>
                  QUIZ<Text style={styles.logoAccent}>G4</Text>
                </Text>
                <Text style={styles.subtitle}>
                  S'affronter, Apprendre, Gagner
                </Text>
              </Animated.View>

              <GlassCard delay={200} style={styles.formContainer}>
                <Text style={styles.formTitle}>Connexion</Text>

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
                    keyboardType="email-address"
                    onChangeText={setEmail}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>MOT DE PASSE</Text>
                  <Input
                    placeholder="••••••••"
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
              </GlassCard>
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
    backgroundColor: colorList.darkBackgroundBlue,
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 22,
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
    marginBottom: 35,
  },
  logoText: {
    fontSize: 52,
    fontWeight: '800',
    color: '#1D1D1F',
    letterSpacing: -1,
  },
  logoAccent: {
    color: colorList.appleAccent,
  },
  subtitle: {
    color: '#6E6E73',
    fontSize: 15,
    marginTop: 8,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  formTitle: {
    color: '#1D1D1F',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  serverToggle: {
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.15)',
    alignSelf: 'center',
    marginBottom: 24,
  },
  serverToggleText: {
    color: colorList.appleAccent,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 18,
    width: '100%',
  },
  inputLabel: {
    color: colorList.vibrantCyan,
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 6,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  forgotPasswordText: {
    color: colorList.vibrantCyan,
    fontSize: 13,
    fontWeight: '500',
  },
  button: {
    marginTop: 25,
    marginHorizontal: 0,
    height: 52,
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
    fontWeight: '600',
    fontSize: 14,
  },
});
