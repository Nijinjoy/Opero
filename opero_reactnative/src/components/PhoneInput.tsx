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
};

function PhoneInput({
  country,
  onChangeCountry,
  value,
  onChangeText,
  placeholder = 'Phone number',
  maxLength = 10,
}: Props) {
  return (
    <View style={styles.row}>
      <CountryPicker
        countryCode={country.cca2}
        onSelect={onChangeCountry}
        withFilter
        withCallingCode
        withCallingCodeButton
        withAlphaFilter={false}
        containerButtonStyle={styles.countryButton}
        flatListProps={{ showsVerticalScrollIndicator: false } as FlatListProps<Country>}
      />
      <Text style={styles.chevron}>▾</Text>

      <View style={styles.divider} />

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(26,26,46,0.4)"
        keyboardType="phone-pad"
        maxLength={maxLength}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(26,26,46,0.15)',
    borderRadius: 12,
    height: 56,
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
