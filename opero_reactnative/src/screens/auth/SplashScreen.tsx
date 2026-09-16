import type { StackScreenProps } from '@react-navigation/stack';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { colors } from '../../theme/colors';

type Props = StackScreenProps<RootStackParamList, 'Splash'>;

function SplashScreen({ navigation }: Props) {
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Welcome'), 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.lockup}>
        <Svg width={64} height={64} viewBox="0 0 64 64">
          <Path d="M32 14 L16 46 L48 46 Z" stroke={colors.gold} strokeWidth={1.5} fill="none" opacity={0.5} />
          <Circle cx={32} cy={14} r={6} fill={colors.gold} />
          <Circle cx={16} cy={46} r={6} fill={colors.gold} />
          <Circle cx={48} cy={46} r={6} fill={colors.gold} />
        </Svg>
        <Text style={styles.wordmark}>{t('common.appName')}</Text>
      </View>
      <Text style={styles.tagline}>{t('splash.tagline')}</Text>
      <View style={styles.rule} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  lockup: {
    alignItems: 'center',
    gap: 6,
  },
  wordmark: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 40,
    letterSpacing: 8,
    color: colors.text,
  },
  tagline: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 11,
    letterSpacing: 3,
    color: 'rgba(246,239,224,0.55)',
  },
  rule: {
    position: 'absolute',
    bottom: 64,
    width: 34,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.gold,
  },
});

export default SplashScreen;
