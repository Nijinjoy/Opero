import { useRef } from 'react';
import type { ComponentRef } from 'react';
import { StyleSheet, TextInput, TextInputKeyPressEvent, View } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  length?: number;
  value: string;
  onChangeText: (value: string) => void;
  autoFocus?: boolean;
  editable?: boolean;
  error?: boolean;
};

function OtpInput({ length = 6, value, onChangeText, autoFocus, editable = true, error }: Props) {
  const inputs = useRef<Array<ComponentRef<typeof TextInput> | null>>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const setDigit = (text: string, index: number) => {
    const clean = text.replace(/[^0-9]/g, '');
    if (!clean) return;

    const chars = value.split('');
    chars[index] = clean[clean.length - 1];
    const next = chars.join('').slice(0, length);
    onChangeText(next);

    if (index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const onKeyPress = (e: TextInputKeyPressEvent, index: number) => {
    if (e.nativeEvent.key !== 'Backspace') return;

    if (digits[index]) {
      const chars = value.split('');
      chars[index] = '';
      onChangeText(chars.join(''));
      return;
    }

    if (index > 0) {
      const chars = value.split('');
      chars[index - 1] = '';
      onChangeText(chars.join(''));
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          ref={ref => {
            inputs.current[index] = ref;
          }}
          style={[styles.box, digit && styles.boxFilled, error && styles.boxError]}
          value={digit}
          onChangeText={text => setDigit(text, index)}
          onKeyPress={e => onKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          textAlign="center"
          autoFocus={autoFocus && index === 0}
          editable={editable}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(26,26,46,0.15)',
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 20,
    color: colors.ink,
  },
  boxFilled: {
    borderColor: colors.gold,
  },
  boxError: {
    borderColor: '#E5484D',
  },
});

export default OtpInput;
