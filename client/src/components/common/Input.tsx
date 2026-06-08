import React, {useState} from 'react';
import {
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface InputProps {
  placeholder: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  placeholderTextColor?: string;
  keyboardType?: any;
  secureTextEntry?: boolean;
  onChangeText?: (text: string) => void;
  value?: string;
}

export default function Input({
  placeholder,
  style,
  textStyle,
  placeholderTextColor,
  keyboardType,
  secureTextEntry,
  onChangeText,
  value,
}: InputProps) {
  const [isPasswordHidden, setIsPasswordHidden] = useState(secureTextEntry);

  return (
    <View style={[styles.container, style]}>
      <TextInput
        testID="text-input"
        placeholder={placeholder}
        style={[styles.input, textStyle]}
        placeholderTextColor={
          placeholderTextColor || 'rgba(255, 255, 255, 0.4)'
        }
        keyboardType={keyboardType}
        secureTextEntry={isPasswordHidden}
        onChangeText={onChangeText}
        value={value}
      />
      {secureTextEntry && (
        <TouchableOpacity
          style={styles.eyeIcon}
          activeOpacity={0.6}
          onPress={() => setIsPasswordHidden(!isPasswordHidden)}>
          <Icon
            name={isPasswordHidden ? 'visibility-off' : 'visibility'}
            size={22}
            color="rgba(255, 255, 255, 0.6)"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    height: 52,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingHorizontal: 16,
    height: '100%',
  },
  eyeIcon: {
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
