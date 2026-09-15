import { forwardRef } from 'react';
import type { ComponentRef } from 'react';
import { FlatListProps, StyleSheet, Text, TextInput, View } from 'react-native';
import CountryPicker, { Country } from 'react-native-country-picker-modal';
import { colors } from '../theme/colors';

type Props = {
  country: Country;
  onChangeCountry: (country: Country) => void;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  autoFocus?: boolean;
  editable?: boolean;
  error?: string;
  onSubmitEditing?: () => void;
};

const PhoneInput = forwardRef<ComponentRef<typeof TextInput>, Props>(function PhoneInput(
  {
    country,
    onChangeCountry,
    value,
    onChangeText,
    placeholder = 'Phone number',
    maxLength = 10,
    autoFocus,
    editable = true,
    error,
    onSubmitEditing,
  },
  ref,
) {
  return (
    <View>
      <View style={[styles.row, !!error && styles.rowError]}>
        <View pointerEvents={editable ? 'auto' : 'none'}>
          <CountryPicker
            countryCode={country.cca2}
            onSelect={onChangeCountry}
            withFilter
            withCallingCode
            withCallingCodeButton
            withAlphaFilter={false}
            containerButtonStyle={styles.countryButton}
            flatListProps={
              {
                indicatorStyle: 'black',
                persistentScrollbar: true,
              } as FlatListProps<Country>
            }
          />
        </View>
        <Text style={styles.chevron}>▾</Text>

        <View style={styles.divider} />

        <TextInput
          ref={ref}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(26,26,46,0.4)"
          keyboardType="phone-pad"
          maxLength={maxLength}
          autoFocus={autoFocus}
          editable={editable}
          onSubmitEditing={onSubmitEditing}
        />
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(26,26,46,0.15)',
    borderRadius: 12,
    height: 56,
  },
  rowError: {
    borderColor: '#E5484D',
  },
  errorText: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 12,
    color: '#E5484D',
    marginTop: 6,
    marginLeft: 4,
  },
  countryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  chevron: {
    fontSize: 12,
    color: 'rgba(26,26,46,0.5)',
    marginLeft: 2,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(26,26,46,0.15)',
    marginLeft: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 16,
    color: colors.ink,
    paddingHorizontal: 14,
  },
});

export default PhoneInput;
