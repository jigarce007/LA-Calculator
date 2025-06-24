import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Colors } from "../theme";

export default function InjectionPlanScreen({ route, navigation }) {
  const { gender, height, weight, ibw, dosingWeight } = route.params;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      <Text style={styles.question}>
        Do you plan to do more than one local anaesthetic injection?
      </Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate("Calculator", {
            gender,
            height,
            weight,
            ibw,
            dosingWeight,
          })
        }
      >
        <Text style={styles.addButtonText}>Yes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() =>
          navigation.navigate("RemainingVolume", {
            gender,
            height,
            weight,
            ibw,
            dosingWeight,
            entries: [], // Empty since no drugs yet
            totalPercentUsed: 0,
          })
        }
      >
        <Text style={styles.secondaryButtonText}>No</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    justifyContent: "center",
  },
  question: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 30,
    color: Colors.primary, // or any color you're using for headings
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: Colors.accent,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: Colors.pink,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  secondaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
