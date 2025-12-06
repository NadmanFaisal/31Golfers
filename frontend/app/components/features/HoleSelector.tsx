import React, { useEffect, useMemo, useRef } from "react";
import {
  Text,
  Pressable,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Animated,
  StyleSheet,
  FlatList,
} from "react-native";

type Props = {
  value: number;
  onChange: (holes: number) => void;
  options?: number[];
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_WIDTH = 90;
const ITEM_SPACING = 12;
const ITEM_SIZE = ITEM_WIDTH + ITEM_SPACING;
const SIDE = (SCREEN_WIDTH - ITEM_WIDTH) / 2; // horizontal padding on each side

export default function HoleSelector({
  value,
  onChange,
  options = [9, 12, 14, 16, 18],
}: Props) {
  const flatListRef = useRef<FlatList<number>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const data = useMemo(() => options.slice(), [options]);

  // Center the current value on mount & when value changes
  useEffect(() => {
    const idx = options.findIndex((n) => n === value);
    if (idx >= 0) {
      const offset = idx * ITEM_SIZE;
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToOffset({ offset, animated: false });
      });
    }
  }, [options, value]);

  function onSnap(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const x = e.nativeEvent.contentOffset.x;
    // With padding, item i is centered when x === i * ITEM_SIZE
    const i = Math.round(x / ITEM_SIZE);
    const clamped = Math.min(Math.max(i, 0), options.length - 1);
    const holes = options[clamped];
    if (holes !== value) onChange(holes);
  }

  function onPressItem(index: number) {
    const offset = index * ITEM_SIZE;
    flatListRef.current?.scrollToOffset({ offset, animated: true });
    onChange(options[index]);
  }

  return (
    <Animated.FlatList
      ref={flatListRef}
      data={data}
      keyExtractor={(n) => String(n)}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        alignItems: "center",
        paddingHorizontal: SIDE, // ✅ center first/last items without spacers
      }}
      snapToOffsets={options.map((_, i) => i * ITEM_SIZE)} // ✅ 0, 1*ITEM_SIZE, ...
      decelerationRate="fast"
      scrollEventThrottle={16}
      bounces={false}
      onMomentumScrollEnd={onSnap}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true },
      )}
      // ✅ Exact measurements for buttery performance
      getItemLayout={(_data, index) => ({
        length: ITEM_SIZE,
        offset: index * ITEM_SIZE,
        index,
      })}
      onScrollToIndexFailed={(info) => {
        // As a fallback, compute the exact offset and scroll there
        const offset = info.index * ITEM_SIZE;
        requestAnimationFrame(() => {
          flatListRef.current?.scrollToOffset({ offset, animated: true });
        });
      }}
      renderItem={({ item, index }) => {
        // Center offset for this item (no SIDE needed because we use padding)
        const centerOffset = index * ITEM_SIZE;
        const inputRange = [
          centerOffset - ITEM_SIZE,
          centerOffset,
          centerOffset + ITEM_SIZE,
        ];

        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.9, 1.0, 0.9],
          extrapolate: "clamp",
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.6, 1.0, 0.6],
          extrapolate: "clamp",
        });

        const isSelected = item === value;

        return (
          <Animated.View
            style={{
              width: ITEM_WIDTH,
              marginRight: ITEM_SPACING,
              transform: [{ scale }],
              opacity,
            }}
          >
            <Pressable
              onPress={() => onPressItem(index)}
              style={[styles.card, isSelected && styles.cardSelected]}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${item} holes`}
            >
              <Text style={styles.holeNumber}>{item}</Text>
              <Text style={styles.holeLabel}>Hole</Text>
            </Pressable>
          </Animated.View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    height: 96,
    borderRadius: 16,
    backgroundColor: "#2ecc71",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  cardSelected: {
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  holeNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
    lineHeight: 32,
  },
  holeLabel: { fontSize: 12, marginTop: 2, color: "white", opacity: 0.9 },
});
