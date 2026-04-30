import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { CATEGORY_OPTIONS, INVENTORY, type InventoryCategory, type InventoryItem } from '@/pos/demoData';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const ITEM_HEIGHT = 72;

export function Explore() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<InventoryCategory | 'All'>('All');
  const inputBackground = useThemeColor({ light: '#F1F5F4', dark: '#1E2A28' }, 'background');
  const inputText = useThemeColor({ light: '#0F172A', dark: '#E2E8F0' }, 'text');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return INVENTORY.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category;
      const matchesQuery =
        normalized.length === 0 || item.name.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  const renderItem = useCallback(({ item }: { item: InventoryItem }) => {
    return (
      <ThemedView style={styles.row} lightColor="#FFFFFF" darkColor="#1B2523">
        <View style={styles.rowHeader}>
          <ThemedText type="defaultSemiBold" style={styles.rowTitle}>
            {item.name}
          </ThemedText>
          <ThemedText style={styles.rowMeta}>{item.category}</ThemedText>
        </View>
        <View style={styles.rowStats}>
          <ThemedText style={styles.rowMeta}>${item.price.toFixed(2)}</ThemedText>
          <ThemedText style={styles.rowMeta}>{item.stock} in stock</ThemedText>
        </View>
      </ThemedView>
    );
  }, []);

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <ThemedText style={styles.rowTitle} type="defaultSemiBold">
              React Native (Expo)
            </ThemedText>
            <PulseRow
              label={`${filtered.length} / ${INVENTORY.length}`}
              accent="#6366F1"
              duration={1100}
            />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search"
              placeholderTextColor={inputText + '88'}
              style={[styles.input, { backgroundColor: inputBackground, color: inputText }]}
            />
            <View style={styles.filterRow}>
              {CATEGORY_OPTIONS.map((option) => (
                <FilterChip
                  key={option}
                  label={option}
                  selected={option === category}
                  onPress={() => {
                    setCategory(option);
                    if (process.env.EXPO_OS !== 'web') {
                      void Haptics.selectionAsync();
                    }
                  }}
                />
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={
          <ThemedView style={styles.empty}>
            <ThemedText type="subtitle">No matches</ThemedText>
            <ThemedText>Try a different keyword or clear the filters.</ThemedText>
          </ThemedView>
        }
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        initialNumToRender={12}
        maxToRenderPerBatch={16}
        windowSize={8}
        removeClippedSubviews
      />
    </ThemedView>
  );
}

function FilterChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const background = useThemeColor(
    { light: selected ? '#0F766E' : '#E7F0EE', dark: selected ? '#10B981' : '#243130' },
    'background'
  );
  const text = useThemeColor(
    { light: selected ? '#FFFFFF' : '#0F172A', dark: selected ? '#0B1F1C' : '#E2E8F0' },
    'text'
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: background },
        pressed && styles.chipPressed,
      ]}>
      <ThemedText style={[styles.chipText, { color: text }]}>{label}</ThemedText>
    </Pressable>
  );
}

function PulseRow({
  label,
  accent,
  duration,
}: {
  label: string;
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    gap: 12,
  },
  header: {
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'SpaceMono',
  },
  subtitle: {
    opacity: 0.8,
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    fontSize: 16,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipPressed: {
    transform: [{ scale: 0.98 }],
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  row: {
    height: ITEM_HEIGHT,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  rowHeader: {
    flex: 1,
    gap: 4,
  },
  rowTitle: {
    fontSize: 15,
  },
  rowStats: {
    alignItems: 'flex-end',
    gap: 4,
  },
  rowMeta: {
    fontSize: 12,
    opacity: 0.7,
  },
  trendBadge: {
    width: 28,
    height: 6,
    borderRadius: 999,
  },
  empty: {
    borderRadius: 16,
    padding: 20,
    gap: 6,
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
});
