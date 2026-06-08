import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {Input, ButtonComponent, GlassCard} from '../components/common';
import {LoginScreenBg} from '../assets/images';
import {colorList} from '../constants/colors';
import {useRegisterUser} from '../hooks';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList, UnauthenticatedScreens} from '../types/navigation';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {useAlert} from '../store/alertContext';

export default function RegisterScreen(): JSX.Element {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {showAlert} = useAlert();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userName, setUserName] = useState('');

  const {registerHandler, isLoading} = useRegisterUser(
    userName,
    email,
    password,
  );

  const handleRegister = () => {
    if (!userName || !email || !password || !confirmPassword) {
      showAlert({
        title: 'Champs incomplets',
        message: 'Hé champion ! Remplis tous les champs pour créer ton profil.',
        type: 'warning',
      });
      return;
    }
    if (password !== confirmPassword) {
      showAlert({
        title: 'Mots de passe différents',
        message: 'Tes mots de passe ne se ressemblent pas. Vérifie bien !',
        type: 'error',
      });
      return;
    }
    registerHandler();
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
              <Animated.View
                entering={FadeInDown.duration(400)}
                style={styles.headerContainer}>
                <Text style={styles.logoText}>
                  QUIZ<Text style={styles.logoAccent}>G4</Text>
                </Text>
                <Text style={styles.subtitle}>
                  Créez votre profil de Champion
                </Text>
              </Animated.View>

              <GlassCard delay={200} style={styles.formContainer}>
                <Text style={styles.formTitle}>INSCRIPTION</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>PSEUDO</Text>
                  <Input
                    placeholder="Ex: CyberNinja99"
                    onChangeText={setUserName}
                  />
                </View>

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

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>CONFIRMER MOT DE PASSE</Text>
                  <Input
                    placeholder="••••••••"
                    secureTextEntry={true}
                    onChangeText={setConfirmPassword}
                  />
                </View>

                <ButtonComponent
                  title="REJOINDRE L'ARÈNE"
                  onPress={handleRegister}
                  style={styles.button}
                  isLoading={isLoading}
                />

                <View style={styles.footerText}>
                  <Text style={styles.loginLabel}>Déjà inscrit ? </Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(UnauthenticatedScreens.LoginScreen)
                    }>
                    <Text style={styles.loginLink}>Se connecter</Text>
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
    fontWeight: '600',
    letterSpacing: 1,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  formTitle: {
    color: colorList.white,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 2,
  },
  inputGroup: {
    marginBottom: 18,
    width: '100%',
  },
  inputLabel: {
    color: colorList.vibrantCyan,
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 6,
    marginBottom: 6,
    letterSpacing: 1,
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
  loginLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  loginLink: {
    color: colorList.vibrantCyan,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
