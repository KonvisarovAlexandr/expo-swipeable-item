# expo-swipeable-item

A high-performance, gesture-driven swipeable item component for Expo and React Native apps, built on Reanimated and React Native Gesture Handler. Perfect for implementing intuitive swipe interactions in FlatList or standalone views.

# Installation in bare React Native projects

For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

### Add the package to your npm dependencies

```
npm install expo-swipeable-item
```

# Important

the library uses react-native-reanimated and react-native-gesture-handler So , before you get started you should wrap your App with <GestureHandlerRootView />

```
npx expo install react-native-gesture-handler
```

```tsx
<GestureHandlerRootView style={{ flex: 1 }}>
  <App />
</GestureHandlerRootView>
```

### Props

| Name           | Type                    | Description                                     |
| :------------- | :---------------------- | :---------------------------------------------- |
| `children`     | `React.ReactNode`       | The content to swipe.                           |
| `leftButtons`  | `React.ReactNode[]`     | buttons on left side.                           |
| `rightButtons` | `React.ReactNode[]`     | buttons on left side.                           |
| `style`        | `ViewStyle/ViewStyle[]` | style of child component's wrapper              |
| `enabled`      | `boolean`               | enables / disables swipe                        |
| `onSnap`       | `() => void`            | Called when item is swiped (on start of swipe). |
| `onPress`      | `() => void`            | Called when item is pressed.                    |
| `swipeSides`   | `left/right/both`       | Swipe sides.                                    |
| `buttonWidth`  | `number`                | width of single button                          |

### Methods

| Name             | Type       | Description      |
| :--------------- | :--------- | :--------------- |
| `closeSwipeable` | `() => {}` | closes swipeable |

### Example

![Swipeable Item demo](https://i.imgur.com/Df1rPpD.gif)


```tsx
  import { SwipeableView, SwipeableViewRef } from "expo-swipeable-item";

  ...

  const leftButtons = useMemo(
    () => [
      <TouchableOpacity key="left-1" style={[styles.smallButton, styles.red]}>
        <Ionicons name="heart" size={24} color="white" />
        <Text style={styles.buttonText}>Favourite</Text>
      </TouchableOpacity>,
      <TouchableOpacity key="left-2" style={[styles.smallButton, styles.green]}>
        <Ionicons name="pin" size={24} color="white" />
        <Text style={styles.buttonText}>Pin</Text>
      </TouchableOpacity>,
    ],
    []
  );

  const rightButtons = useMemo(
    () => [
      <TouchableOpacity
        key="right-1"
        style={[styles.smallButton, styles.lightBrown]}
      >
        <Ionicons name="volume-mute" size={24} color="white" />
        <Text style={styles.buttonText}>Mute</Text>
      </TouchableOpacity>,
      <TouchableOpacity key="right-2" style={[styles.smallButton, styles.red]}>
        <Ionicons name="trash" size={24} color="white" />
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>,
    ],
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => (
      <View style={styles.item}>
        <SwipeableView
          ref={(ref) => (itemRefs.current[item.id] = ref)}
          enabled
          swipeSides="both"
          buttonWidth={buttonWidth}
          leftButtons={leftButtons}
          rightButtons={rightButtons}
        >
          <View style={styles.itemContent}>
            <Text style={styles.itemText}>{item.text}</Text>
          </View>
        </SwipeableView>
      </View>
    ),
    [leftButtons, rightButtons, buttonWidth]
  );

...


 <GestureHandlerRootView style={styles.rootView}>
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainer}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={closeAllItems}>
          <Text>Close all</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={closeFirstItem}>
            <Text>Close first</Text>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  </GestureHandlerRootView>
```

# Contributing

Contributions are very welcome! Please refer to guidelines described in the [contributing guide](https://github.com/expo/expo#contributing).
