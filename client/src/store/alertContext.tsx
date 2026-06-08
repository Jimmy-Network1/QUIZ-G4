import React, {createContext, useContext, useState, ReactNode} from 'react';
import {Modal, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {colorList} from '../constants/colors';
import {GlassCard} from '../components/common';
import Icon from 'react-native-vector-icons/MaterialIcons';

type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

type AlertOptions = {
  title: string;
  message: string;
  buttons?: AlertButton[];
  type?: 'error' | 'success' | 'info' | 'warning';
};

type AlertContextType = {
  showAlert: (options: AlertOptions) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({children}: {children: ReactNode}) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<AlertOptions>({
    title: '',
    message: '',
  });

  const showAlert = (newOptions: AlertOptions) => {
    setOptions(newOptions);
    setVisible(true);
  };

  const hideAlert = () => setVisible(false);

  const renderIcon = () => {
    switch (options.type) {
      case 'error':
        return <Icon name="error-outline" size={50} color={colorList.red} />;
      case 'success':
        return <Icon name="check-circle-outline" size={50} color={colorList.green} />;
      case 'warning':
        return <Icon name="warning" size={50} color={colorList.orange} />;
      default:
        return <Icon name="info-outline" size={50} color={colorList.vibrantCyan} />;
    }
  };

  return (
    <AlertContext.Provider value={{showAlert}}>
      {children}
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={hideAlert}>
        <View style={styles.overlay}>
          <GlassCard style={styles.alertCard}>
            <View style={styles.content}>
              <View style={styles.iconContainer}>{renderIcon()}</View>
              <Text style={styles.title}>{options.title}</Text>
              <Text style={styles.message}>{options.message}</Text>
              
              <View style={styles.buttonContainer}>
                {options.buttons && options.buttons.length > 0 ? (
                  options.buttons.map((btn, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.button,
                        btn.style === 'cancel' && styles.cancelButton,
                        btn.style === 'destructive' && styles.destructiveButton,
                      ]}
                      onPress={() => {
                        hideAlert();
                        btn.onPress?.();
                      }}>
                      <Text style={[
                        styles.buttonText,
                        btn.style === 'cancel' && styles.cancelButtonText
                      ]}>
                        {btn.text.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <TouchableOpacity style={styles.button} onPress={hideAlert}>
                    <Text style={styles.buttonText}>D'ACCORD</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </GlassCard>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertCard: {
    width: '100%',
    maxWidth: 340,
    padding: 25,
    borderWidth: 2,
    borderColor: 'rgba(0, 242, 255, 0.3)',
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: colorList.white,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 1,
  },
  message: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    height: 50,
    backgroundColor: colorList.brightPurple,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colorList.vibrantCyan,
  },
  buttonText: {
    color: colorList.white,
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cancelButtonText: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  destructiveButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderColor: colorList.red,
  },
});
