import type { StackScreenProps } from '@react-navigation/stack';
import type { ComponentRef } from 'react';
import { useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import PhoneInput from '../../components/PhoneInput';
import { DEFAULT_COUNTRY } from '../../data/countries';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { colors } from '../../theme/colors';

const MIN_PHONE_LENGTH = 10;

type Props = StackScreenProps<RootStackParamList, 'Login'>;

function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const phoneInputRef = useRef<ComponentRef<typeof TextInput>>(null);

  const onChangePhone = (text: string) => {
    setPhone(text);
    if (error) setError('');
  };

  const sendOtp = () => {
    const trimmed = phone.trim();

    if (trimmed.length < MIN_PHONE_LENGTH) {
      setError(`Enter a valid ${MIN_PHONE_LENGTH}-digit phone number`);
      phoneInputRef.current?.focus();
      return;
    }

    Keyboard.dismiss();
    setSubmitting(true);

    // simulate the OTP request; wire up to the real API when available
    setTimeout(() => {
      setSubmitting(false);
      navigation.navigate('VerifyOtp', {
        dialCode: `+${country.callingCode[0]}`,
        phone: trimmed,
      });
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.content, { paddingTop: insets.top + 12 }]}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={12}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Text style={styles.eyebrow}>Welcome to Opero</Text>
          <Text style={styles.title}>Enter your phone number</Text>
          <Text style={styles.subtitle}>We'll send you a one-time code to verify it's you.</Text>

          <PhoneInput
            ref={phoneInputRef}
            country={country}
            onChangeCountry={setCountry}
            value={phone}
            onChangeText={onChangePhone}
            autoFocus
            editable={!submitting}
            error={error}
            onSubmitEditing={sendOtp}
          />

          <Button
            label="Send OTP"
            onPress={sendOtp}
            loading={submitting}
            style={styles.button}
          />
        </View>
      </TouchableWithoutFeedback>
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
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(26,26,46,0.06)',
    marginBottom: 24,
  },
  backText: {
    fontSize: 22,
    lineHeight: 22,
    color: colors.ink,
  },
  eyebrow: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.brand,
    marginBottom: 8,
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
