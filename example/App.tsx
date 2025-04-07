import React, { useCallback, useMemo, useRef } from "react";
import { SwipeableView, SwipeableViewRef } from "expo-swipeable-item";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface ListItem {
  id: string;
  text: string;
}

export default function App() {
  const data: ListItem[] = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => ({
        id: `item-${index}`,
        text: `Item ${index + 1}`,
      })),
    []
  );

  const buttonWidth = 72.5;
  const itemRefs = useRef<Record<string, SwipeableViewRef | null>>({});

  const closeAllItems = useCallback(() => {
    Object.values(itemRefs.current).forEach((ref) => {
      ref?.closeSwipeable();
    });
  }, []);

  const closeFirstItem = useCallback(() => {
    itemRefs.current[data[0].id]?.closeSwipeable();
  }, [data]);

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

  return (
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
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  item: {
    width: "100%",
    height: 55,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  contentContainer: {
    paddingBottom: 100,
    gap: 5,
  },
  itemText: {
    fontSize: 16,
  },
  itemContent: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  button: {
    width: "80%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "blue",
  },
  smallButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    height: "100%",
    gap: 4,
  },
  red: {
    backgroundColor: "red",
  },
  blue: {
    backgroundColor: "blue",
  },
  green: {
    backgroundColor: "green",
  },
  lightBrown: {
    backgroundColor: "#D2B48C", // light brown color using hex code
  },
  yellow: {
    backgroundColor: "yellow",
  },
  buttonContainer: {
    gap: 10,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "white",
  },
});
