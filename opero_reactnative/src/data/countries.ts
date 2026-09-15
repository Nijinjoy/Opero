import type { Country } from 'react-native-country-picker-modal';

// Initial country shown before the user picks one.
// The full country list itself now comes from react-native-country-picker-modal.
export const DEFAULT_COUNTRY: Country = {
  cca2: 'IN',
  callingCode: ['91'],
  currency: ['INR'],
  flag: '🇮🇳',
  name: 'India',
  region: 'Asia',
  subregion: 'Southern Asia',
};
