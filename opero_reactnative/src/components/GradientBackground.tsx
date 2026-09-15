import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '../theme/colors';

type Props = {
  width: number;
  height: number;
};

function GradientBackground({ width, height }: Props) {
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id="bg" x1="0%" y1="0%" x2="70%" y2="100%">
          <Stop offset="0%" stopColor={colors.brand} />
          <Stop offset="100%" stopColor={colors.brandDeep} />
        </LinearGradient>
        <RadialGradient id="glow" cx="50%" cy="36%" r="45%">
          <Stop offset="0%" stopColor={colors.gold} stopOpacity={0.2} />
          <Stop offset="100%" stopColor={colors.gold} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill="url(#bg)" />
      <Rect x={0} y={0} width={width} height={height} fill="url(#glow)" />
    </Svg>
  );
}

export default GradientBackground;
