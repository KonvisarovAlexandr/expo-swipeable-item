import React, { useCallback, useMemo, useRef } from "react";
import { DraggableView, DraggableViewRef } from "expo-swipeable-item";
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
  const data: ListItem[] = Array.from({ length: 10 }, (_, index) => ({
    id: `item-${index}`,
    text: `Item ${index + 1}`,
  }));

  const buttonWidth = 72.5;
  const itemRefs = useRef<Record<string, DraggableViewRef | null>>({});

  const leftButtons = useMemo(
    () => [
      <TouchableOpacity
        style={[styles.smallButton, styles.blue, { width: buttonWidth }]}
      >
        <Text>Left</Text>
      </TouchableOpacity>,
      <TouchableOpacity
        style={[styles.smallButton, styles.yellow, { width: buttonWidth }]}
      >
        <Text>Left</Text>
      </TouchableOpacity>,
      <TouchableOpacity
        style={[styles.smallButton, styles.green, { width: buttonWidth }]}
      >
        <Text>Left</Text>
      </TouchableOpacity>,
    ],
    []
  );

  const rightButtons = useMemo(
    () => [
      <TouchableOpacity
        style={[styles.smallButton, styles.yellow, { width: buttonWidth }]}
      >
        <Text>Right</Text>
      </TouchableOpacity>,
      <TouchableOpacity
        style={[styles.smallButton, styles.red, { width: buttonWidth }]}
      >
        <Text>Right</Text>
      </TouchableOpacity>,
    ],
    []
  );

  const renderItem = ({ item }: { item: ListItem }) => {
    return (
      <View style={styles.item}>
        <DraggableView
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
        </DraggableView>
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={data}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
          keyExtractor={(item) => item.id}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              Object.values(itemRefs.current).forEach((ref) => {
                ref?.closeDraggable();
              });
            }}
          >
            <Text>Close all</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              itemRefs.current[data[0].id]?.closeDraggable();
            }}
          >
            <Text>Close first</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
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
  yellow: {
    backgroundColor: "yellow",
  },
  buttonContainer: {
    gap: 10,
  },
});
