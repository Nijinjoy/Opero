import type { StackScreenProps } from '@react-navigation/stack';
import { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Ellipse, Circle, Line } from 'react-native-svg';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { colors } from '../../theme/colors';

const LANGUAGES = ['EN', 'AR'];

const SLIDES = [
  {
    key: 'community',
    title: 'Find Your Community',
    subtitle: 'Connect with people who share your interests, culture and city.',
    image: require('../../assets/images/group.png'),
  },
  {
    key: 'share',
    title: 'Share Your Story',
    subtitle: 'Post moments, updates and events for the community to see.',
    image: require('../../assets/images/share.png'),
  },
  {
    key: 'events',
    title: 'Never Miss an Event',
    subtitle: 'Discover meetups and gatherings happening near you.',
    image: require('../../assets/images/events.png'),
  },
];

type Props = StackScreenProps<RootStackParamList, 'Welcome'>;

function WelcomeScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(0);
  const [langIndex, setLangIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const cycleLanguage = () => setLangIndex(i => (i + 1) % LANGUAGES.length);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setPage(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const isLast = page === SLIDES.length - 1;

  const goNext = () => {
    if (isLast) {
      navigation.navigate('Login');
      return;
    }
    const next = Math.min(page + 1, SLIDES.length - 1);
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
        <Text style={styles.langText}>{LANGUAGES[langIndex]}</Text>
      </Pressable>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={item => item.key}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((slide, i) => (
            <View key={slide.key} style={[styles.dot, i === page && styles.dotActive]} />
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
    marginBottom: 40,
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
