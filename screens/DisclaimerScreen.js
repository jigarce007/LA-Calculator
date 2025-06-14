import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Colors } from "../theme";

export default function DisclaimerScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imgcontainer}>
        <Image style={styles.logo} source={require("../assets/logotext.png")} />
      </View>

      <Text style={styles.title}>Disclaimer</Text>
      <Text style={styles.text}>
        This app is a tool to assist with the calculation of local anaesthetic
        dosages. It is not a substitute for clinical judgment. The creator
        accepts no responsibility for incorrect use, incorrect route of
        administration, or adverse events.
      </Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.replace("IBW")}
      >
        <Text style={styles.addButtonText}>I Understand and Agree</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: Colors.pink,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: "contain",
  },
  imgcontainer: {
    width: 200,
    height: 200,
    borderRadius: 100, // Half of width/height
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    justifyContent: "center", // Center vertically
    marginBottom: 20,
    overflow: "hidden", // Ensures content stays within the circle
  },
});
