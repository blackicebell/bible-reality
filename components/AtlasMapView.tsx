import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, ImageBackground, PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Polyline } from "react-native-svg";

import { PlaceBottomSheet } from "@/components/PlaceBottomSheet";
import { mapAssets } from "@/utils/mapAssets";
import { getPlacesForMap, getRoutePoints, PassageMap, Place } from "@/utils/mapHelpers";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type AtlasMapViewProps = {
  map: PassageMap;
  compact?: boolean;
};

const labelOffsets: Record<string, { x: number; y: number }> = {
  bethel: { x: -18, y: 11 },
  ai: { x: 18, y: 11 },
  shechem: { x: -4, y: 8 },
  haran: { x: 0, y: 7 },
  capernaum: { x: 18, y: 10 },
  galilee: { x: -15, y: 10 },
  jerusalem: { x: -18, y: 10 },
  damascus: { x: 16, y: 10 }
};

export function AtlasMapView({ map, compact = false }: AtlasMapViewProps) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const places = useMemo(() => getPlacesForMap(map), [map]);
  const route = useMemo(() => getRoutePoints(map), [map]);
  const points = route.map((place) => `${place.mapPosition.x},${place.mapPosition.y}`).join(" ");
  const routeProgress = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.ValueXY()).current;
  const mapSource = mapAssets[map.mapAsset];
  const AnimatedPolyline = useMemo(() => Animated.createAnimatedComponent(Polyline), []);
  const routeDashOffset = routeProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [180, 0]
  });

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => zoomed && Math.abs(gesture.dx) + Math.abs(gesture.dy) > 6,
        onPanResponderGrant: () => {
          pan.extractOffset();
        },
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false
        }),
        onPanResponderRelease: () => {
          pan.flattenOffset();
        }
      }),
    [pan, zoomed]
  );

  useEffect(() => {
    routeProgress.setValue(0);
    Animated.timing(routeProgress, {
      toValue: 1,
      duration: compact ? 900 : 1250,
      useNativeDriver: false
    }).start();
  }, [compact, map.id, routeProgress]);

  function toggleZoom() {
    setZoomed((current) => {
      if (current) {
        pan.setValue({ x: 0, y: 0 });
      }
      return !current;
    });
  }

  return (
    <View style={[styles.shell, compact && styles.compactShell]}>
      <View style={compact ? styles.locatorCompact : styles.locator}>
        <View style={styles.locatorHeader}>
          <Text style={styles.locatorKicker}>Modern locator</Text>
          <Text style={styles.locatorTitle}>{map.modernContext.locator}</Text>
        </View>
        {!compact ? <Text style={styles.locatorSummary}>{map.modernContext.summary}</Text> : null}
      </View>
      <View style={[styles.mapFrame, compact && styles.compactMapFrame]}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.zoomLayer,
            {
              transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale: zoomed ? 1.45 : 1 }]
            }
          ]}
        >
          <ImageBackground imageStyle={styles.mapImage} resizeMode="stretch" source={mapSource} style={styles.mapSurface}>
            <View style={styles.assetShade} />
            <Svg height="100%" pointerEvents="none" style={StyleSheet.absoluteFill} viewBox="0 0 100 100" width="100%">
              <Polyline fill="none" points={points} stroke="rgba(255,255,255,0.68)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.85" />
              <AnimatedPolyline
                fill="none"
                points={points}
                stroke={colors.route}
                strokeDasharray="180"
                strokeDashoffset={routeDashOffset}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.15"
              />
              {route.map((place) => (
                <Circle cx={place.mapPosition.x} cy={place.mapPosition.y} fill="rgba(255,255,255,0.9)" key={place.id} r="1.7" stroke={colors.route} strokeWidth="0.7" />
              ))}
            </Svg>
            {map.modernContext.regions.map((region) => (
              <View
                key={`${region.label}-${region.x}-${region.y}`}
                style={{
                  ...styles.modernTag,
                  left: `${region.x}%`,
                  top: `${region.y}%`
                }}
              >
                <Text numberOfLines={1} style={styles.modernTagText}>
                  {region.label}
                </Text>
              </View>
            ))}
            {places.map((place) => {
              const selected = selectedPlace?.id === place.id;
              const labelOffset = labelOffsets[place.id] ?? { x: 0, y: 8 };
              const labelStyle = selected ? { ...styles.pinLabel, ...styles.pinLabelSelected } : styles.pinLabel;
              return (
                <Pressable
                  accessibilityLabel={`Open ${place.name} details`}
                  key={place.id}
                  onPress={() => setSelectedPlace(place)}
                  style={{
                    ...styles.pin,
                    left: `${place.mapPosition.x}%`,
                    top: `${place.mapPosition.y}%`
                  }}
                >
                  <View style={selected ? { ...styles.pinDot, ...styles.pinDotSelected } : styles.pinDot} />
                  <Text
                    numberOfLines={1}
                    style={{
                      ...labelStyle,
                      transform: [{ translateX: labelOffset.x }, { translateY: labelOffset.y }]
                    }}
                  >
                    {place.name}
                  </Text>
                </Pressable>
              );
            })}
          </ImageBackground>
        </Animated.View>
        {!compact ? (
          <Pressable accessibilityLabel={zoomed ? "Reset map zoom" : "Zoom map"} onPress={toggleZoom} style={styles.zoomButton}>
            <Text style={styles.zoomText}>{zoomed ? "Reset" : "Zoom"}</Text>
          </Pressable>
        ) : null}
        {zoomed ? (
          <View style={styles.panHint}>
            <Text style={styles.panHintText}>Drag to pan</Text>
          </View>
        ) : null}
      </View>
      <PlaceBottomSheet place={selectedPlace} onClose={() => setSelectedPlace(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    gap: spacing.sm,
    minHeight: 548,
    position: "relative"
  },
  compactShell: {
    minHeight: 390
  },
  locator: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md
  },
  locatorCompact: {
    backgroundColor: colors.goldSoft,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    padding: spacing.md
  },
  locatorHeader: {
    gap: 2
  },
  locatorKicker: {
    ...typography.small,
    color: colors.gold,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  locatorTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: "900"
  },
  locatorSummary: {
    ...typography.small,
    color: colors.textMuted
  },
  mapFrame: {
    aspectRatio: 0.78,
    backgroundColor: colors.raised,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
    width: "100%"
  },
  compactMapFrame: {
    aspectRatio: 0.92
  },
  zoomLayer: {
    ...StyleSheet.absoluteFillObject
  },
  mapSurface: {
    height: "100%",
    width: "100%"
  },
  mapImage: {
    borderRadius: 10
  },
  assetShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.06)"
  },
  pin: {
    alignItems: "center",
    minHeight: 48,
    minWidth: 74,
    paddingTop: 2,
    position: "absolute",
    transform: [{ translateX: -34 }, { translateY: -22 }]
  },
  pinDot: {
    backgroundColor: colors.navy,
    borderColor: colors.surfaceElevated,
    borderRadius: 11,
    borderWidth: 3,
    height: 22,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 7,
    width: 22
  },
  pinDotSelected: {
    backgroundColor: colors.gold,
    borderColor: colors.surfaceElevated,
    transform: [{ scale: 1.12 }]
  },
  pinLabel: {
    ...typography.small,
    backgroundColor: "rgba(255,255,255,0.88)",
    borderColor: "rgba(51,51,51,0.1)",
    borderRadius: 999,
    borderWidth: 1,
    color: colors.text,
    marginTop: 3,
    overflow: "hidden",
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6
  },
  pinLabelSelected: {
    backgroundColor: colors.navy,
    color: colors.surface
  },
  modernTag: {
    backgroundColor: "rgba(255,255,255,0.72)",
    borderColor: "rgba(51,51,51,0.12)",
    borderRadius: 999,
    borderWidth: 1,
    maxWidth: 168,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    position: "absolute",
    transform: [{ translateX: -58 }, { translateY: -10 }]
  },
  modernTagText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  zoomButton: {
    alignItems: "center",
    backgroundColor: colors.navy,
    borderRadius: 999,
    bottom: spacing.md,
    minHeight: 38,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    position: "absolute",
    right: spacing.md
  },
  zoomText: {
    ...typography.small,
    color: colors.surface,
    fontWeight: "900"
  },
  panHint: {
    backgroundColor: "rgba(51,51,51,0.76)",
    borderRadius: 999,
    bottom: spacing.md,
    left: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    position: "absolute"
  },
  panHintText: {
    ...typography.small,
    color: colors.surface,
    fontWeight: "800"
  }
});
