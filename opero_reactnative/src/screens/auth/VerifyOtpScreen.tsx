import type { StackScreenProps } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import OtpInput from '../../components/OtpInput';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { colors } from '../../theme/colors';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

type Props = StackScreenProps<RootStackParamList, 'VerifyOtp'>;

function VerifyOtpScreen({ navigation, route }: Props) {
  const { dialCode, phone } = route.params;
  const insets = useSafeAreaInsets();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const canVerify = otp.length === OTP_LENGTH;

  const verifyOtp = () => {
    if (!canVerify || submitting) return;

    Keyboard.dismiss();
    setSubmitting(true);

    // simulate the verify request; wire up to the real API when available
    setTimeout(() => {
      setSubmitting(false);
      // navigate to home / next step once verification succeeds
    }, 800);
  };

  // auto-submit as soon as the last digit is entered
  useEffect(() => {
    if (canVerify) verifyOtp();
  }, [canVerify]);

  const onChangeOtp = (text: string) => {
    setOtp(text);
    if (error) setError('');
  };

  const resendOtp = () => {
    if (secondsLeft > 0 || submitting) return;
    setOtp('');
    setError('');
    setSecondsLeft(RESEND_SECONDS);
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

          <Text style={styles.title}>Verify your number</Text>
          <Text style={styles.subtitle}>
            Enter the {OTP_LENGTH}-digit code sent to {dialCode} {phone}
          </Text>

          <OtpInput
            value={otp}
            onChangeText={onChangeOtp}
            length={OTP_LENGTH}
            autoFocus
            editable={!submitting}
            error={!!error}
          />
          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <Button
            label="Verify"
            onPress={verifyOtp}
            disabled={!canVerify}
            loading={submitting}
            style={styles.button}
          />

          <Pressable
            style={styles.resendRow}
            onPress={resendOtp}
            disabled={secondsLeft > 0 || submitting}
          >
            <Text style={styles.resendText}>
              {secondsLeft > 0 ? `Resend code in ${secondsLeft}s` : 'Resend code'}
            </Text>
          </Pressable>
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
  errorText: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 12,
    color: '#E5484D',
    marginTop: 10,
    marginLeft: 4,
  },
  resendRow: {
    marginTop: 20,
    alignSelf: 'center',
  },
  resendText: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
    color: colors.gold,
  },
  button: {
    marginTop: 32,
  },
});

export default VerifyOtpScreen;
