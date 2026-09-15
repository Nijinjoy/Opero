import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import PhoneInput from '../../components/PhoneInput';
import { DEFAULT_COUNTRY } from '../../data/countries';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState('');

  const canSubmit = phone.trim().length >= 10;

  const sendOtp = () => {
    if (!canSubmit) return;
    // navigate to OTP verification screen once available
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.content, { paddingTop: insets.top + 40 }]}>
        <Text style={styles.title}>Enter your phone number</Text>
        <Text style={styles.subtitle}>We'll send you a one-time code to verify it's you.</Text>

        <PhoneInput
          country={country}
          onChangeCountry={setCountry}
          value={phone}
          onChangeText={setPhone}
        />

        <Button
          label="Send OTP"
          onPress={sendOtp}
          disabled={!canSubmit}
          style={styles.button}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 22,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(26,26,46,0.55)',
    marginTop: 8,
    marginBottom: 32,
  },
  button: {
    marginTop: 24,
  },
});

export default LoginScreen;
