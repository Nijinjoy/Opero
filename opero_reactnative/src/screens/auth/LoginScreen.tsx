import type { StackScreenProps } from '@react-navigation/stack';
import type { ComponentRef } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { ApiError } from '../../services/apiClient';
import * as authService from '../../services/authService';
import { colors } from '../../theme/colors';

const MIN_PHONE_LENGTH = 10;

type Props = StackScreenProps<RootStackParamList, 'Login'>;

function LoginScreen({ navigation }: Props) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const rtlTextStyle = { textAlign: 'auto' as const, writingDirection: isRTL ? ('rtl' as const) : ('ltr' as const) };
  const insets = useSafeAreaInsets();
  useEffect(() => {
    i18n.changeLanguage('ar');
  }, [i18n]);
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const phoneInputRef = useRef<ComponentRef<typeof TextInput>>(null);

  const onChangePhone = (text: string) => {
    setPhone(text);
    if (error) setError('');
  };

  const dialCode = `+${country.callingCode[0]}`;

  const sendOtp = async () => {
    const trimmed = phone.trim();

    if (trimmed.length < MIN_PHONE_LENGTH) {
      setError(t('login.errors.invalidPhone', { length: MIN_PHONE_LENGTH }));
      phoneInputRef.current?.focus();
      return;
    }

    Keyboard.dismiss();
    setSubmitting(true);

    try {
      await authService.sendOtp(`${dialCode}${trimmed}`);
      navigation.navigate('VerifyOtp', { dialCode, phone: trimmed });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('login.errors.sendOtpFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.content, { paddingTop: insets.top + 12 }]}>
          <Pressable
            style={[styles.backButton, { alignSelf: isRTL ? 'flex-end' : 'flex-start' }]}
            onPress={() => navigation.goBack()}
            hitSlop={12}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Text style={[styles.eyebrow, rtlTextStyle]}>{t('login.eyebrow')}</Text>
          <Text style={[styles.title, rtlTextStyle]}>{t('login.title')}</Text>
          <Text style={[styles.subtitle, rtlTextStyle]}>{t('login.subtitle')}</Text>

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
            label={t('login.sendOtp')}
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
