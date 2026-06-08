import React, {useContext} from 'react';
import {ButtonComponent, GoBackArrow} from '../components/common';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import {AuthContext} from '../store/authContext';
import {useDeleteAccount, useLogout} from '../hooks';
import {colorList} from '../constants/colors';
import {LoginScreenBg} from '../assets/images';
import LinearGradient from 'react-native-linear-gradient';

export default function AccountScreen(): JSX.Element {
  const logout = useLogout();
  const {email, userName} = useContext(AuthContext);
  const {deleteAccount} = useDeleteAccount();

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={LoginScreenBg}
        style={styles.backgroundImage}
        resizeMode="cover">
        <LinearGradient
          colors={['rgba(11, 2, 53, 0.7)', colorList.darkBackgroundBlue]}
          style={styles.overlay}>
          <View style={styles.header}>
            <GoBackArrow />
            <Text style={styles.headerTitle}>Mon Profil</Text>
            <View style={{width: 40}} />
          </View>

          <View style={styles.profileContainer}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {userName?.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={styles.glassCard}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Nom d'utilisateur</Text>
                <Text style={styles.value}>{userName}</Text>
              </View>

              <View style={[styles.infoRow, styles.lastRow]}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{email}</Text>
              </View>
            </View>

            <View style={styles.actionsContainer}>
              <ButtonComponent
                title="Se déconnecter"
                variant="bluish"
                onPress={logout}
                style={styles.button}
              />
              <ButtonComponent
                title="Supprimer le compte"
                onPress={deleteAccount}
                style={{...styles.button, ...styles.deleteButton}}
              />
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorList.darkBackgroundBlue,
  },
  backgroundImage: {
    flex: 1,
    backgroundColor: colorList.darkBackgroundBlue,
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  headerTitle: {
    color: colorList.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colorList.brightPurple,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 3,
    borderColor: colorList.vibrantCyan,
    shadowColor: colorList.vibrantCyan,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 15,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colorList.white,
  },
  glassCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 25,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoRow: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  value: {
    color: colorList.white,
    fontSize: 18,
    fontWeight: '500',
  },
  actionsContainer: {
    width: '100%',
    marginTop: 40,
  },
  button: {
    marginHorizontal: 0,
    height: 55,
    marginBottom: 15,
  },
  deleteButton: {
    opacity: 0.6,
  },
});
