import React, { useCallback, useImperativeHandle, forwardRef } from "react";
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
} from "react-native-reanimated";

type CustomViewProps = {
  children: React.ReactNode;
  leftButtons?: React.ReactNode[];
  rightButtons?: React.ReactNode[];
  style?: ViewStyle | ViewStyle[];
  enabled?: boolean;
  onSnap?: () => void;
  onPress?: () => void;
  swipeSides?: "left" | "right" | "both";
  buttonWidth?: number;
};

export type DraggableViewRef = {
  closeDraggable: () => void;
};

type ContextType = {
  x: number;
};

export const DraggableView = forwardRef<DraggableViewRef, CustomViewProps>(
  function DraggableView(
    {
      children,
      style,
      onSnap = () => {},
      onPress = () => {},
      enabled = false,
      swipeSides = "both",
      buttonWidth = 72.5,
      leftButtons,
      rightButtons,
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
          const maxOffset = maxOffsetLeft;
          if (currentX === 0) {
            x.value = clampValue(translationX, -maxOffset, 0) + currentX;
          } else if (currentX === -maxOffset) {
            x.value = clampValue(translationX, 0, maxOffset) + currentX;
          }
        } else if (swipeSides === "right") {
          const maxOffset = maxOffsetRight;
          if (currentX === 0) {
            x.value = clampValue(translationX, 0, maxOffset) + currentX;
          } else if (currentX === maxOffset) {
            x.value = clampValue(translationX, -maxOffset, 0) + currentX;
          }
        } else {
          x.value =
            clampValue(translationX, -maxOffsetRight, maxOffsetLeft) + currentX;
        }
      })
      .onEnd(() => {
        const value = x.value;
        const toValue =
          value > 50 ? maxOffsetLeft : value < -50 ? -maxOffsetRight : 0;
        x.value = withTiming(toValue);
        context.value.x = toValue;
      });

    const panStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: x.value }],
      };
    }, [x]);

    const closeDraggable = useCallback(() => {
      x.value = withTiming(0);
      context.value = { x: 0 };
    }, [x, context]);

    useImperativeHandle(ref, () => ({
      closeDraggable,
    }));

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
          {leftButtons}
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
          {rightButtons}
        </View>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
              panStyle,
              { ...style },
            ]}
          >
            {children}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    );
  }
);
