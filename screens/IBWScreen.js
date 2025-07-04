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
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function IBWScreen({ navigation }) {
  const [sex, setSex] = useState("M");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [showSexPicker, setShowSexPicker] = useState(false);

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
      {Platform.OS === "ios" ? (
        <>
          <TouchableOpacity
            style={styles.pickerDisplay}
            onPress={() => setShowSexPicker(!showSexPicker)}
          >
            <Text>{sex === "M" ? "Male" : "Female"}</Text>
          </TouchableOpacity>
          {showSexPicker && (
            <Picker
              selectedValue={sex}
              onValueChange={(val) => {
                setSex(val);
                setShowSexPicker(false);
              }}
            >
              <Picker.Item label="Male" value="M" />
              <Picker.Item label="Female" value="F" />
            </Picker>
          )}
        </>
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={sex}
            onValueChange={(val) => setSex(val)}
            style={styles.picker}
          >
            <Picker.Item label="Male" value="M" />
            <Picker.Item label="Female" value="F" />
          </Picker>
        </View>
      )}

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
    height: 50,
    color: "#000",
    fontSize: 16,
  },
  pickerContainer: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  pickerDisplay: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 12,
    backgroundColor: "#f0f0f0",
    marginBottom: 6,
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
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    backgroundColor: Colors.white,
  },
});
