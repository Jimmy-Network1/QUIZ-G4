import React, {useState} from 'react';
import {
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
  TouchableOpacity,
} from 'react-native';
import {colorList} from '../../constants/colors';
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
          placeholderTextColor || colorList.applePlaceholder
        }
        keyboardType={keyboardType}
        secureTextEntry={isPasswordHidden}
        onChangeText={onChangeText}
        value={value}
      />
      {secureTextEntry && (
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setIsPasswordHidden(!isPasswordHidden)}>
          <Icon
            name={isPasswordHidden ? 'visibility-off' : 'visibility'}
            size={22}
            color={colorList.applePlaceholder}
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
    backgroundColor: colorList.appleGlassBg,
    borderWidth: 1,
    borderColor: colorList.appleGlassBorder,
    borderRadius: 14,
    height: 50,
  },
  input: {
    flex: 1,
    color: colorList.appleText,
    fontSize: 16,
    paddingHorizontal: 15,
  },
  eyeIcon: {
    paddingHorizontal: 15,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
