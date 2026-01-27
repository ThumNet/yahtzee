import React from 'react';
import Svg, { Defs, Filter, FeGaussianBlur, FeMerge, FeMergeNode, RadialGradient, Stop, Rect, G, Circle, Text, Line, Path } from 'react-native-svg';

interface LogoProps {
  size?: 'splash' | 'small';
}

export function Logo({ size = 'splash' }: LogoProps) {
  if (size === 'small') {
    return <SmallLogo />;
  }
  return <SplashLogo />;
}

function SplashLogo() {
  return (
    <Svg width={300} height={300} viewBox="0 0 400 400">
      <Defs>
        <Filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
          <FeGaussianBlur stdDeviation={4} result="blur1" />
          <FeGaussianBlur stdDeviation={8} result="blur2" />
          <FeMerge>
            <FeMergeNode in="blur2" />
            <FeMergeNode in="blur1" />
            <FeMergeNode in="SourceGraphic" />
          </FeMerge>
        </Filter>
        <Filter id="magentaGlow" x="-50%" y="-50%" width="200%" height="200%">
          <FeGaussianBlur stdDeviation={3} result="blur" />
          <FeMerge>
            <FeMergeNode in="blur" />
            <FeMergeNode in="SourceGraphic" />
          </FeMerge>
        </Filter>
        <Filter id="yellowGlow" x="-50%" y="-50%" width="200%" height="200%">
          <FeGaussianBlur stdDeviation={4} result="blur" />
          <FeMerge>
            <FeMergeNode in="blur" />
            <FeMergeNode in="SourceGraphic" />
          </FeMerge>
        </Filter>
      </Defs>

      {/* Decorative dice - top left */}
      <G transform="translate(60, 80) rotate(-15)">
        <Rect x={0} y={0} width={50} height={50} rx={8} fill="#12122a" stroke="#00f0ff" strokeWidth={2} filter="url(#cyanGlow)" opacity={0.6} />
        <Circle cx={25} cy={25} r={5} fill="#00f0ff" />
      </G>

      {/* Decorative dice - top right */}
      <G transform="translate(290, 70) rotate(20)">
        <Rect x={0} y={0} width={50} height={50} rx={8} fill="#12122a" stroke="#ff00ff" strokeWidth={2} filter="url(#magentaGlow)" opacity={0.6} />
        <Circle cx={15} cy={15} r={4} fill="#ff00ff" />
        <Circle cx={35} cy={35} r={4} fill="#ff00ff" />
      </G>

      {/* Decorative dice - bottom left */}
      <G transform="translate(50, 280) rotate(10)">
        <Rect x={0} y={0} width={45} height={45} rx={7} fill="#12122a" stroke="#ff00ff" strokeWidth={2} filter="url(#magentaGlow)" opacity={0.5} />
        <Circle cx={12} cy={12} r={4} fill="#ff00ff" />
        <Circle cx={22} cy={22} r={4} fill="#ff00ff" />
        <Circle cx={33} cy={33} r={4} fill="#ff00ff" />
      </G>

      {/* Decorative dice - bottom right */}
      <G transform="translate(300, 290) rotate(-10)">
        <Rect x={0} y={0} width={48} height={48} rx={7} fill="#12122a" stroke="#00f0ff" strokeWidth={2} filter="url(#cyanGlow)" opacity={0.5} />
        <Circle cx={14} cy={14} r={4} fill="#00f0ff" />
        <Circle cx={34} cy={14} r={4} fill="#00f0ff" />
        <Circle cx={14} cy={34} r={4} fill="#00f0ff" />
        <Circle cx={34} cy={34} r={4} fill="#00f0ff" />
      </G>

      {/* Main center dice (showing 5) */}
      <G transform="translate(140, 130)">
        <Rect x={0} y={0} width={120} height={120} rx={16} fill="#1a1a3a" stroke="#00f0ff" strokeWidth={3} filter="url(#cyanGlow)" />
        <Circle cx={30} cy={30} r={10} fill="#ffffff" />
        <Circle cx={90} cy={30} r={10} fill="#ffffff" />
        <Circle cx={60} cy={60} r={10} fill="#ffffff" />
        <Circle cx={30} cy={90} r={10} fill="#ffffff" />
        <Circle cx={90} cy={90} r={10} fill="#ffffff" />
      </G>

      {/* YAHTZEE Text */}
      <Text
        x={200}
        y={300}
        textAnchor="middle"
        fontFamily="Arial Black, Arial, sans-serif"
        fontSize={48}
        fontWeight="bold"
        fill="#00f0ff"
        filter="url(#cyanGlow)"
        letterSpacing={6}
      >
        YAHTZEE
      </Text>

      {/* Underline */}
      <Line x1={80} y1={315} x2={320} y2={315} stroke="#ff00ff" strokeWidth={3} filter="url(#magentaGlow)" />

      {/* NEON EDITION subtitle */}
      <Text
        x={200}
        y={345}
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize={16}
        fill="#ff00ff"
        filter="url(#magentaGlow)"
        letterSpacing={8}
      >
        NEON EDITION
      </Text>

      {/* Corner accents */}
      <Path d="M 20 40 L 20 20 L 40 20" stroke="#ffff00" strokeWidth={2} fill="none" filter="url(#yellowGlow)" opacity={0.8} />
      <Path d="M 380 40 L 380 20 L 360 20" stroke="#ffff00" strokeWidth={2} fill="none" filter="url(#yellowGlow)" opacity={0.8} />
      <Path d="M 20 360 L 20 380 L 40 380" stroke="#ffff00" strokeWidth={2} fill="none" filter="url(#yellowGlow)" opacity={0.8} />
      <Path d="M 380 360 L 380 380 L 360 380" stroke="#ffff00" strokeWidth={2} fill="none" filter="url(#yellowGlow)" opacity={0.8} />
    </Svg>
  );
}

function SmallLogo() {
  return (
    <Svg width={200} height={80} viewBox="0 0 200 80">
      <Defs>
        <Filter id="cyanGlowSmall" x="-50%" y="-50%" width="200%" height="200%">
          <FeGaussianBlur stdDeviation={2} result="blur1" />
          <FeGaussianBlur stdDeviation={4} result="blur2" />
          <FeMerge>
            <FeMergeNode in="blur2" />
            <FeMergeNode in="blur1" />
            <FeMergeNode in="SourceGraphic" />
          </FeMerge>
        </Filter>
        <Filter id="magentaGlowSmall" x="-50%" y="-50%" width="200%" height="200%">
          <FeGaussianBlur stdDeviation={2} result="blur" />
          <FeMerge>
            <FeMergeNode in="blur" />
            <FeMergeNode in="SourceGraphic" />
          </FeMerge>
        </Filter>
      </Defs>

      {/* Mini dice icon */}
      <G transform="translate(10, 18)">
        <Rect x={0} y={0} width={44} height={44} rx={8} fill="#1a1a3a" stroke="#00f0ff" strokeWidth={2} filter="url(#cyanGlowSmall)" />
        <Circle cx={12} cy={12} r={4} fill="#ffffff" />
        <Circle cx={32} cy={12} r={4} fill="#ffffff" />
        <Circle cx={22} cy={22} r={4} fill="#ffffff" />
        <Circle cx={12} cy={32} r={4} fill="#ffffff" />
        <Circle cx={32} cy={32} r={4} fill="#ffffff" />
      </G>

      {/* YAHTZEE Text */}
      <Text
        x={125}
        y={48}
        textAnchor="middle"
        fontFamily="Arial Black, Arial, sans-serif"
        fontSize={28}
        fontWeight="bold"
        fill="#00f0ff"
        filter="url(#cyanGlowSmall)"
        letterSpacing={2}
      >
        YAHTZEE
      </Text>

      {/* Underline accent */}
      <Line x1={68} y1={56} x2={182} y2={56} stroke="#ff00ff" strokeWidth={2} filter="url(#magentaGlowSmall)" />
    </Svg>
  );
}
