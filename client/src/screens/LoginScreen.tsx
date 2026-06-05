import React, {useState, useContext, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Input from '../components/common/Input';
import ButtonComponent from '../components/common/ButtonComponent';
import {LoginScreenBg} from '../assets/images';
import {ImageBackground} from 'react-native';
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

  const registerText = (
    <Text
      style={styles.hereText}
      onPress={() =>
        navigation.navigate(UnauthenticatedScreens.RegisterScreen)
      }>
      here
    </Text>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={LoginScreenBg}
        style={styles.globalView}
        resizeMode="cover">
        <LinearGradient
          colors={['transparent', colorList.darkBackgroundBlue]}
          style={styles.linearGradient}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}>
          <TouchableOpacity
            onPress={toggleServerMode}
            style={styles.serverToggle}>
            <Text style={styles.serverToggleText}>
              Mode: {serverMode === 'online' ? '🌐 Online' : '🏠 Local (Wi-Fi)'}
            </Text>
          </TouchableOpacity>

          <Input
            placeholder="Email"
            style={styles.input}
            textStyle={styles.inputText}
            placeholderTextColor={colorList.neonPink}
            keyboardType="email-address"
            onChangeText={setEmail}
          />
          <Input
            placeholder="Password"
            style={styles.input}
            textStyle={styles.inputText}
            placeholderTextColor={colorList.neonPink}
            keyboardType="default"
            secureTextEntry={true}
            onChangeText={setPassword}
          />
          <ButtonComponent
            title="Login"
            textStyle={styles.inputText}
            onPress={loginHandler}
            style={styles.button}
            isLoading={isLoading}
          />
          <View style={styles.footerText}>
            <Text style={styles.registerText}>New user? Register </Text>
            {registerText}
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  globalView: {
    flex: 1,
    width: '100%',
    height: '60%',
    justifyContent: 'flex-end',
  },
  linearGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
    justifyContent: 'flex-end',
    padding: 10,
  },
  input: {
    backgroundColor: colorList.white,
    shadowColor: colorList.white,
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: {
      height: 10,
      width: 10,
    },
    elevation: 10,
  },
  container: {
    backgroundColor: colorList.darkBackgroundBlue,
    flex: 1,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 50,
  },
  footerText: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
    marginBottom: 20,
  },
  registerText: {color: '#fff', textAlign: 'center'},
  hereText: {
    color: colorList.neonPink,
    fontWeight: 'bold',
  },
  serverToggle: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  serverToggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
