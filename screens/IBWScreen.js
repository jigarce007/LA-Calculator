import React, { useState } from "react";
import { Colors } from "../theme";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function IBWScreen({ navigation }) {
  const [sex, setSex] = useState("M");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const calculateIBW = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (!["M", "F"].includes(sex) || isNaN(h) || isNaN(w)) {
      Alert.alert(
        "Invalid input",
        "Please enter valid sex, height, and weight."
      );
      return;
    }

    const ibw = sex === "M" ? 50 + 0.9 * (h - 152) : 45.5 + 0.9 * (h - 152);
    const dosingWeight = Math.min(ibw, w);

    navigation.navigate("InjectionPlan", {
      sex,
      height: h,
      weight: w,
      ibw: ibw.toFixed(2),
      dosingWeight: dosingWeight.toFixed(2),
    });
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../assets/logoround.png")} />
      <Text style={styles.title}>Enter Patient Details</Text>

      <Text style={styles.label}>Sex</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={sex}
          onValueChange={(val) => setSex(val)}
          style={styles.picker}
        >
          <Picker.Item style={styles.pickerItem} label="Male" value="M" />
          <Picker.Item style={styles.pickerItem} label="Female" value="F" />
        </Picker>
      </View>

      <TextInput
        placeholder="Height (cm)"
        value={height}
        placeholderTextColor="#999"
        onChangeText={setHeight}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Actual Weight (kg)"
        value={weight}
        placeholderTextColor="#999"
        onChangeText={setWeight}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity style={styles.addButton} onPress={calculateIBW}>
        <Text style={styles.addButtonText}>Calculate IBW & Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,

    padding: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    marginBottom: 20,
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: 5,
    marginBottom: 5,
    fontWeight: "600",
  },
  picker: {
    width: "100%",
    height: 50, // Match container height
    color: "#000", // Picker text color
    fontSize: 16, // Adjust font size
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    backgroundColor: "#fff",
    marginVertical: 10,
    width: "100%",
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: Colors.pink,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  pickerContainer: {
    width: "100%",
    height: 50, // Slightly taller for better spacing
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#fff",
    justifyContent: "center", // Not necessary but fine to keep
  },
  pickerItem: {
    fontSize: 14,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    fontWeight: "bold",
    backgroundColor: Colors.white,
  },
});
