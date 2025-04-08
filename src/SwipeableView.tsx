import React, {
  useCallback,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from "react";
import { View, ViewStyle } from "react-native";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
} from "react-native-reanimated";

type SwipeableViewProps = {
  children: React.ReactNode;
  leftButtons?: React.ReactNode[];
  rightButtons?: React.ReactNode[];
  style?: ViewStyle | ViewStyle[];
  enabled?: boolean;
  onSnap?: () => void;
  onPress?: () => void;
  buttonWidth?: number;
  additionalOffsetToDrag?: number;
  onSwipeLeftTillEnd?: () => void;
  onSwipeRightTillEnd?: () => void;
};

export type SwipeableViewRef = {
  closeSwipeable: () => void;
};

type ContextType = {
  x: number;
};

export const SwipeableView = forwardRef<SwipeableViewRef, SwipeableViewProps>(
  function SwipeableView(
    {
      children,
      style,
      onSnap = () => {},
      onPress = () => {},
      enabled = false,
      buttonWidth = 72.5,
      leftButtons,
      rightButtons,
      additionalOffsetToDrag = 0,
      onSwipeLeftTillEnd = () => {},
      onSwipeRightTillEnd = () => {},
    },
    ref
  ) {
    const maxOffsetLeft = (leftButtons?.length ?? 0) * buttonWidth;
    const maxOffsetRight = (rightButtons?.length ?? 0) * buttonWidth;
    const x = useSharedValue(0);
    const context = useSharedValue<ContextType>({
      x: 0,
    });
    const touchStartTime = useSharedValue(0);

    const swipeSides = useMemo(() => {
      if (leftButtons?.length && rightButtons?.length) {
        return "both";
      } else if (leftButtons?.length) {
        return "right";
      } else if (rightButtons?.length) {
        return "left";
      }
      return "none";
    }, [leftButtons, rightButtons]);

    const panGesture = Gesture.Pan()
      .enabled(enabled)
      .minDistance(30)
      .hitSlop({ top: -15, bottom: -15 })
      .onBegin(() => {
        runOnJS(onSnap)();
        touchStartTime.value = Date.now();
      })
      .onFinalize(() => {
        const duration = Date.now() - touchStartTime.value;
        if (duration <= 90) {
          runOnJS(onPress)();
        }
      })
      .onUpdate((event) => {
        const { translationX } = event;
        const currentX = context.value.x;
        const clampValue = (value: number, min: number, max: number) => {
          return Math.max(min, Math.min(max, value));
        };
        if (swipeSides === "left") {
          const maxOffset = maxOffsetRight;
          if (currentX === 0) {
            x.value = clampValue(translationX, -maxOffset, 0) + currentX;
          } else if (currentX === -maxOffset) {
            x.value = clampValue(translationX, 0, maxOffset) + currentX;
          }
        } else if (swipeSides === "right") {
          const maxOffset = maxOffsetLeft;
          if (currentX === 0) {
            x.value = clampValue(translationX, 0, maxOffset) + currentX;
          } else if (currentX === maxOffset) {
            x.value = clampValue(translationX, -maxOffset, 0) + currentX;
          }
        } else {
          if (currentX === 0) {
            x.value =
              clampValue(
                translationX,
                -maxOffsetRight - additionalOffsetToDrag,
                maxOffsetLeft + additionalOffsetToDrag
              ) + currentX;
          } else if (currentX === maxOffsetLeft) {
            x.value =
              clampValue(translationX, -maxOffsetLeft, additionalOffsetToDrag) +
              currentX;
          } else if (currentX === -maxOffsetRight) {
            x.value =
              clampValue(
                translationX,
                -additionalOffsetToDrag,
                maxOffsetRight
              ) + currentX;
          }
        }
      })
      .onEnd(() => {
        const value = x.value;
        let toValue = 0;
        if (context.value.x === 0) {
          toValue =
            value > 20 ? maxOffsetLeft : value < -20 ? -maxOffsetRight : 0;
        } else if (context.value.x === maxOffsetLeft) {
          toValue = value < maxOffsetLeft - 20 ? 0 : maxOffsetLeft;
        } else if (context.value.x === -maxOffsetRight) {
          toValue = value > -maxOffsetRight + 20 ? 0 : -maxOffsetRight;
        }
        if (value > maxOffsetLeft + additionalOffsetToDrag / 2) {
          runOnJS(onSwipeLeftTillEnd)();
        } else if (value < -maxOffsetRight - additionalOffsetToDrag / 2) {
          runOnJS(onSwipeRightTillEnd)();
        }
        x.value = withTiming(toValue);
        context.value.x = toValue;
      });

    const panStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: x.value }],
      };
    }, [x]);

    const closeSwipeable = useCallback(() => {
      x.value = withTiming(0);
      context.value = { x: 0 };
    }, [x, context]);

    useImperativeHandle(ref, () => ({
      closeSwipeable,
    }));

    const GetLeftButtonStyle = (index: number) => {
      return useAnimatedStyle(() => {
        const multiplier = (index + 1) / (leftButtons?.length || 1);
        const translateX = interpolate(
          x.value,
          [0, maxOffsetLeft],
          [-buttonWidth * multiplier * (leftButtons?.length || 1), 0],
          { extrapolateRight: "clamp" }
        );
        return {
          transform: [{ translateX }],
          zIndex: -index,
        };
      }, [x]);
    };

    const GetRightButtonStyle = (index: number) => {
      return useAnimatedStyle(() => {
        const reversedIndex = (rightButtons?.length || 1) - 1 - index;
        const multiplier = (reversedIndex + 1) / (rightButtons?.length || 1);
        const translateX = interpolate(
          x.value,
          [-maxOffsetRight, 0],
          [0, buttonWidth * multiplier * (rightButtons?.length || 1)],
          { extrapolateLeft: "clamp" }
        );

        return {
          transform: [{ translateX }],
          zIndex: index,
        };
      }, [x]);
    };

    return (
      <GestureHandlerRootView>
        <View
          style={{
            width: maxOffsetLeft,
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            alignItems: "flex-start",
            flexDirection: "row",
          }}
        >
          {leftButtons?.map((button, index) => (
            <Animated.View
              key={index}
              style={[GetLeftButtonStyle(index), { width: buttonWidth }]}
            >
              {button}
            </Animated.View>
          ))}
        </View>
        <View
          style={{
            width: maxOffsetRight,
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: "flex-end",
            flexDirection: "row",
          }}
        >
          {rightButtons?.map((button, index) => (
            <Animated.View
              key={index}
              style={[GetRightButtonStyle(index), { width: buttonWidth }]}
            >
              {button}
            </Animated.View>
          ))}
        </View>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 100,
              },
              panStyle,
              style,
            ]}
          >
            {children}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    );
  }
);
