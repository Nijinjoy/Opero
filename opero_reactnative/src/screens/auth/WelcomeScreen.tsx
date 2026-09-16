import type { StackScreenProps } from '@react-navigation/stack';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Ellipse, Circle, Line } from 'react-native-svg';
import { SUPPORTED_LANGUAGES } from '../../localisation/i18n';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { colors } from '../../theme/colors';

const SLIDE_IMAGES = {
  community: require('../../assets/images/group.png'),
  share: require('../../assets/images/share.png'),
  events: require('../../assets/images/events.png'),
} as const;

const SLIDE_KEYS = ['community', 'share', 'events'] as const;
type SlideKey = (typeof SLIDE_KEYS)[number];

type Props = StackScreenProps<RootStackParamList, 'Welcome'>;

function WelcomeScreen({ navigation }: Props) {
  const { t, i18n } = useTranslation();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(0);
  const listRef = useRef<FlatList>(null);

  const langIndex = Math.max(0, SUPPORTED_LANGUAGES.indexOf(i18n.language as (typeof SUPPORTED_LANGUAGES)[number]));

  const cycleLanguage = () => {
    const next = SUPPORTED_LANGUAGES[(langIndex + 1) % SUPPORTED_LANGUAGES.length];
    i18n.changeLanguage(next);
  };

  const isLast = page === SLIDE_KEYS.length - 1;

  const goNext = () => {
    if (isLast) {
      navigation.navigate('Login');
      return;
    }
    const next = Math.min(page + 1, SLIDE_KEYS.length - 1);
    listRef.current?.scrollToIndex({ index: next, animated: true });
    setPage(next);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.langButton, { top: insets.top + 12 }]}
        onPress={cycleLanguage}
      >
        <Svg width={16} height={16} viewBox="0 0 16 16">
          <Circle cx={8} cy={8} r={7} stroke={colors.ink} strokeWidth={1.3} fill="none" />
          <Ellipse cx={8} cy={8} rx={3.2} ry={7} stroke={colors.ink} strokeWidth={1.3} fill="none" />
          <Line x1={1} y1={8} x2={15} y2={8} stroke={colors.ink} strokeWidth={1.3} />
        </Svg>
        <Text style={styles.langText}>{i18n.language.toUpperCase()}</Text>
      </Pressable>

      <FlatList
        ref={listRef}
        data={SLIDE_KEYS}
        keyExtractor={key => key}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        renderItem={({ item: key }: { item: SlideKey }) => (
          <View style={[styles.slide, { width }]}>
            <Image source={SLIDE_IMAGES[key]} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>{t(`welcome.slides.${key}.title`)}</Text>
            <Text style={styles.subtitle}>{t(`welcome.slides.${key}.subtitle`)}</Text>
          </View>
        )}
      />

      <View style={[styles.footer, { marginBottom: 40 + insets.bottom }]}>
        <View style={styles.dots}>
          {SLIDE_KEYS.map((key, i) => (
            <View key={key} style={[styles.dot, i === page && styles.dotActive]} />
          ))}
        </View>

        <Pressable style={styles.button} onPress={goNext}>
          <Text style={styles.buttonText}>{isLast ? '✓' : '→'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    direction: 'ltr',
  },
  langButton: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(26,26,46,0.2)',
    backgroundColor: 'rgba(26,26,46,0.06)',
  },
  langText: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 12,
    color: colors.ink,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 20,
  },
  image: {
    width: 160,
    height: 160,
    tintColor: colors.brand,
  },
  title: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 24,
    color: colors.ink,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(26,26,46,0.55)',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(26,26,46,0.15)',
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.brand,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
  },
  buttonText: {
    fontSize: 20,
    lineHeight: 24,
    textAlign: 'center',
    color: '#FFFFFF',
  },
});

export default WelcomeScreen;
