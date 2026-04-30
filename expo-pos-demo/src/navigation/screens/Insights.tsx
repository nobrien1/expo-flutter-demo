import type { ComponentProps } from 'react';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';

type IconName = ComponentProps<typeof IconSymbol>['name'];

export function Insights() {
  const tint = useThemeColor({}, 'tint');

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#EFF3FF', dark: '#101621' }}
      headerImage={
        <View style={styles.headerContent}>
          <View style={[styles.orb, styles.orbOne]} />
          <View style={[styles.orb, styles.orbTwo]} />
          <IconSymbol name="sparkles" size={128} color={tint} style={styles.heroIcon} />
        </View>
      }>
      <ThemedView style={styles.titleBlock}>
        <ThemedText type="title" style={styles.title}>
          Expo strengths
        </ThemedText>
        <ThemedText>
          These pulses run on the UI thread while your JavaScript keeps filtering and sorting the
          list.
        </ThemedText>
      </ThemedView>

      <View style={styles.pulseGrid}>
        <PulseRow
          label="UI thread animation"
          caption="Reanimated + worklets"
          accent="#6366F1"
          duration={1100}
        />
        <PulseRow
          label="Navigation latency"
          caption="Native stacks"
          accent="#22C55E"
          duration={1500}
        />
        <PulseRow
          label="Gesture handling"
          caption="Native driver"
          accent="#F97316"
          duration={1300}
        />
      </View>

      <View style={styles.advantageGrid}>
        <AdvantageCard
          icon="bolt.fill"
          title="Fast iteration"
          body="Expo Go and OTA updates keep the build-test loop tight across platforms."
          accent="#0EA5E9"
        />
        <AdvantageCard
          icon="speedometer"
          title="Shared surface"
          body="One codebase for native + web makes performance baselines easy to compare."
          accent="#14B8A6"
        />
        <AdvantageCard
          icon="sparkles"
          title="Polished UX"
          body="Haptics, blur, and animations ship with the SDK, ready for production."
          accent="#A855F7"
        />
      </View>
    </ParallaxScrollView>
  );
}

function PulseRow({
  label,
  caption,
  accent,
  duration,
}: {
  label: string;
  caption: string;
  accent: string;
  duration: number;
}) {
  const width = useSharedValue(0);
  const progress = useSharedValue(0.15);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [duration, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const target = width.value * (0.2 + progress.value * 0.8);
    return {
      width: Math.max(12, target),
    };
  });

  return (
    <ThemedView style={styles.pulseCard} lightColor="#F6F7FB" darkColor="#1A202B">
      <View style={styles.pulseHeader}>
        <ThemedText type="defaultSemiBold">{label}</ThemedText>
        <ThemedText style={styles.pulseCaption}>{caption}</ThemedText>
      </View>
      <ThemedView
        style={styles.pulseTrack}
        lightColor="#E4EBF5"
        darkColor="#2A3341"
        onLayout={(event) => {
          width.value = event.nativeEvent.layout.width;
        }}>
        <Animated.View style={[styles.pulseFill, { backgroundColor: accent }, animatedStyle]} />
      </ThemedView>
    </ThemedView>
  );
}

function AdvantageCard({
  icon,
  title,
  body,
  accent,
}: {
  icon: IconName;
  title: string;
  body: string;
  accent: string;
}) {
  return (
    <ThemedView style={styles.advCard} lightColor="#F5FAF8" darkColor="#182321">
      <View style={[styles.advIcon, { backgroundColor: `${accent}1F` }]}>
        <IconSymbol name={icon} size={18} color={accent} />
      </View>
      <View style={styles.advText}>
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        <ThemedText style={styles.advBody}>{body}</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIcon: {
    opacity: 0.9,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(99, 102, 241, 0.16)',
  },
  orbOne: {
    width: 150,
    height: 150,
    top: 30,
    left: 40,
  },
  orbTwo: {
    width: 200,
    height: 200,
    bottom: -10,
    right: 0,
    backgroundColor: 'rgba(20, 184, 166, 0.2)',
  },
  titleBlock: {
    gap: 8,
  },
  title: {
    fontFamily: 'SpaceMono',
  },
  pulseGrid: {
    gap: 12,
  },
  pulseCard: {
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  pulseHeader: {
    gap: 4,
  },
  pulseCaption: {
    fontSize: 12,
    opacity: 0.7,
  },
  pulseTrack: {
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
  },
  pulseFill: {
    height: 10,
    borderRadius: 999,
  },
  advantageGrid: {
    gap: 12,
  },
  advCard: {
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },
  advIcon: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  advText: {
    flex: 1,
    gap: 4,
  },
  advBody: {
    fontSize: 12,
    opacity: 0.75,
  },
});
