import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
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
import { INVENTORY, type InventoryItem } from '@/pos/demoData';

const SUMMARY = summarize(INVENTORY);

export function Home() {
  const tint = useThemeColor({}, 'tint');

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#DFF6F1', dark: '#0D2421' }}
      headerImage={
        <ThemedView style={styles.headerContent} lightColor="transparent" darkColor="transparent">
          <ThemedView
            style={[styles.orb, styles.orbOne]}
            lightColor="transparent"
            darkColor="transparent"
          />
          <ThemedView
            style={[styles.orb, styles.orbTwo]}
            lightColor="transparent"
            darkColor="transparent"
          />
          <IconSymbol name="speedometer" size={128} color={tint} style={styles.heroIcon} />
        </ThemedView>
      }>
      <ThemedView style={styles.titleBlock}>
        <ThemedText type="title" style={styles.title}>
          Performance Lab
        </ThemedText>
        <ThemedText>
          Large list rendering, fast filters, and UI-thread animation running in sync with
          gestures.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.grid} lightColor="transparent" darkColor="transparent">
        <StatCard
          label="Active SKUs"
          value={`${SUMMARY.total}`}
          hint="Live virtualized list"
          accent="#14B8A6"
        />
        <StatCard
          label="Low stock"
          value={`${SUMMARY.lowStock}`}
          hint="Auto restock signals"
          accent="#F97316"
        />
        <StatCard
          label="Avg price"
          value={`$${SUMMARY.avgPrice}`}
          hint="Mock POS catalog"
          accent="#60A5FA"
        />
        <StatCard
          label="Fast movers"
          value={`${SUMMARY.fastMovers}`}
          hint="Velocity > 70"
          accent="#A78BFA"
        />
      </ThemedView>

      <ThemedView style={styles.panel} lightColor="#F5FAF8" darkColor="#182423">
        <ThemedText type="subtitle">UI thread pulse</ThemedText>
        <ThemedText style={styles.panelText}>
          Reanimated keeps this bar moving at 60fps even while the list below is filtering.
        </ThemedText>
        <PerformanceMeter />
      </ThemedView>

      <ThemedView style={styles.panel} lightColor="#F7F8FB" darkColor="#1B1F2A">
        <ThemedText type="subtitle">Expo advantage</ThemedText>
        <ThemedText style={styles.panelText}>
          Ship OTA updates, reuse native modules, and target web and native with one codebase.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

function summarize(items: InventoryItem[]) {
  const totals = items.reduce(
    (acc, item) => {
      acc.total += 1;
      acc.sumPrice += item.price;
      acc.fastMovers += item.velocity > 70 ? 1 : 0;
      acc.lowStock += item.stock < 20 ? 1 : 0;
      return acc;
    },
    { total: 0, sumPrice: 0, lowStock: 0, fastMovers: 0 }
  );

  return {
    total: totals.total,
    lowStock: totals.lowStock,
    fastMovers: totals.fastMovers,
    avgPrice: (totals.sumPrice / totals.total).toFixed(2),
  };
}

function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent: string;
}) {
  const borderColor = useThemeColor({ light: '#DDE6E3', dark: '#223130' }, 'text');

  return (
    <ThemedView style={[styles.card, { borderColor }]} lightColor="#F3F8F6" darkColor="#162220">
      <ThemedView
        style={[styles.cardBadge, { backgroundColor: accent }]}
        lightColor="transparent"
        darkColor="transparent"
      />
      <ThemedText style={styles.cardValue}>{value}</ThemedText>
      <ThemedText type="defaultSemiBold" style={styles.cardLabel}>
        {label}
      </ThemedText>
      <ThemedText style={styles.cardHint}>{hint}</ThemedText>
    </ThemedView>
  );
}

function PerformanceMeter() {
  const width = useSharedValue(0);
  const progress = useSharedValue(0.2);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1300, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const target = width.value * (0.25 + progress.value * 0.75);
    return {
      width: Math.max(16, target),
    };
  });

  return (
    <ThemedView
      style={styles.meterTrack}
      lightColor="#E3EFEB"
      darkColor="#22302F"
      onLayout={(event) => {
        width.value = event.nativeEvent.layout.width;
      }}>
      <Animated.View style={[styles.meterFill, animatedStyle]} />
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
    backgroundColor: 'rgba(20, 184, 166, 0.18)',
  },
  orbOne: {
    width: 160,
    height: 160,
    top: 20,
    left: 30,
  },
  orbTwo: {
    width: 200,
    height: 200,
    bottom: -10,
    right: 10,
    backgroundColor: 'rgba(96, 165, 250, 0.22)',
  },
  titleBlock: {
    gap: 8,
  },
  title: {
    fontFamily: 'SpaceMono',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47%',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    gap: 6,
  },
  cardBadge: {
    width: 24,
    height: 6,
    borderRadius: 999,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'SpaceMono',
  },
  cardLabel: {
    fontSize: 14,
  },
  cardHint: {
    fontSize: 12,
    opacity: 0.7,
  },
  panel: {
    borderRadius: 20,
    padding: 16,
    gap: 10,
  },
  panelText: {
    fontSize: 14,
    opacity: 0.8,
  },
  meterTrack: {
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
  },
  meterFill: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#14B8A6',
  },
});
