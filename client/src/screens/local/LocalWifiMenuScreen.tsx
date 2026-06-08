import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import {LoginScreenBg} from '../../assets/images';
import {colorList} from '../../constants/colors';
import {ButtonComponent, GoBackArrow, GlassCard} from '../../components/common';
import LinearGradient from 'react-native-linear-gradient';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AuthenticatedScreens, RootStackParamList} from '../../types/navigation';
import Animated, {FadeInDown} from 'react-native-reanimated';

export default function LocalWifiMenuScreen(): JSX.Element {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={LoginScreenBg}
        style={styles.bg}
        resizeMode="cover">
        <LinearGradient
          colors={['rgba(11, 2, 53, 0.4)', colorList.darkBackgroundBlue]}
          style={styles.overlay}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <GoBackArrow />
              <Text style={styles.headerTitle}>WI-FI LOCAL</Text>
              <View style={{width: 40}} />
            </View>

            <Animated.View
                entering={FadeInDown.duration(400)}
                style={styles.content}>
              <GlassCard delay={100} style={styles.glassContainer}>
                <Text style={styles.sectionLabel}>CRÉER UNE ARÈNE</Text>
                <ButtonComponent
                  title="Partie 1 contre 1"
                  onPress={() =>
                    navigation.navigate(
                      AuthenticatedScreens.LocalWifiHostScreen,
                      {
                        gameMode: '1v1',
                      },
                    )
                  }
                  style={styles.button}
                />
                <ButtonComponent
                  title="Compétition (jusqu'à 8 joueurs)"
                  variant="bluish"
                  onPress={() =>
                    navigation.navigate(
                      AuthenticatedScreens.LocalWifiHostScreen,
                      {
                        gameMode: 'tournament',
                      },
                    )
                  }
                  style={styles.button}
                />
              </GlassCard>

              <GlassCard
                delay={200}
                style={[styles.glassContainer, {marginTop: 20}]}>
                <Text style={styles.sectionLabel}>REJOINDRE</Text>
                <ButtonComponent
                  title="Rejoindre une partie 1v1"
                  onPress={() =>
                    navigation.navigate(
                      AuthenticatedScreens.LocalWifiJoinScreen,
                      {
                        gameMode: '1v1',
                      },
                    )
                  }
                  style={styles.button}
                />
                <ButtonComponent
                  title="Rejoindre une compétition"
                  variant="bluish"
                  onPress={() =>
                    navigation.navigate(
                      AuthenticatedScreens.LocalWifiJoinScreen,
                      {
                        gameMode: 'tournament',
                      },
                    )
                  }
                  style={styles.button}
                />
              </GlassCard>
            </Animated.View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colorList.darkBackgroundBlue},
  bg: {flex: 1, backgroundColor: colorList.darkBackgroundBlue},
  overlay: {flex: 1},
  safeArea: {flex: 1, paddingHorizontal: 20, backgroundColor: 'transparent'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    marginTop: 20,
  },
  headerTitle: {
    color: colorList.white,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  content: {flex: 1, justifyContent: 'center', paddingBottom: 40},
  glassContainer: {padding: 20},
  sectionLabel: {
    color: colorList.applePlaceholder,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {marginHorizontal: 0, height: 55, marginTop: 10},
});
