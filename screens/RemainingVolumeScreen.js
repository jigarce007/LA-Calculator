import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LA_DRUGS } from "../data/toxicData";
import { Colors } from "../theme";

export function RemainingVolumeScreen({ route, navigation }) {
  const { dosingWeight, entries } = route.params;

  const [selectedLA, setSelectedLA] = useState(LA_DRUGS[0].name);
  const [selectedConcentration, setSelectedConcentration] = useState(
    LA_DRUGS[0].concentrations[0]
  );

  const drug = LA_DRUGS.find((d) => d.name === selectedLA);
  const totalAllowedDose = drug.toxicDose * dosingWeight;
  const totalUsedDose = entries
    .filter((e) => e.name === selectedLA)
    .reduce((sum, e) => sum + parseFloat(e.dose), 0);

  const remainingDose = Math.max(0, totalAllowedDose - totalUsedDose);
  const remainingVolume = (remainingDose / selectedConcentration).toFixed(1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Remaining Volume Calculator</Text>
      <Text style={styles.subtitle}>Dosing Weight: {dosingWeight} kg</Text>

      <Text style={styles.label}>Select LA:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedLA}
          onValueChange={(val) => {
            setSelectedLA(val);
            const newDrug = LA_DRUGS.find((d) => d.name === val);
            setSelectedConcentration(newDrug.concentrations[0]);
          }}
          style={styles.picker}
        >
          {LA_DRUGS.map((drug) => (
            <Picker.Item label={drug.name} value={drug.name} key={drug.name} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Concentration:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedConcentration}
          onValueChange={(val) => setSelectedConcentration(val)}
          style={styles.picker}
        >
          {drug.concentrations.map((c, i) => (
            <Picker.Item
              label={`${c} mg/ml (${(c / 10).toFixed(1)}%)`}
              value={c}
              key={i}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.resultBox}>
        <Text style={styles.resultText}>
          Remaining Dose: {remainingDose.toFixed(1)} mg
        </Text>
        <Text style={styles.resultText}>
          Remaining Volume: {remainingVolume} ml
        </Text>
      </View>
      <TouchableOpacity
        style={styles.startAgainButton}
        onPress={() =>
          Alert.alert(
            "Start Again",
            "Are you sure you want to reset everything?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Yes",
                onPress: () =>
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "IBW" }],
                  }),
              },
            ]
          )
        }
      >
        <Text style={styles.startAgainButtonText}>Start Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  label: {
    marginTop: 10,
    fontWeight: "600",
  },
  picker: {
    width: "100%",
    height: 50, // Match container height
    color: "#000", // Picker text color
    fontSize: 16, // Adjust font size
  },
  resultBox: {
    marginTop: 20,
    padding: 15,
    borderCurve: 10,
    backgroundColor: Colors.lightPink,
    borderRadius: 10,
    borderColor: Colors.pink,
    borderWidth: 1,
  },
  resultText: {
    margin: 5,
    fontSize: 16,
    fontWeight: "500",
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
  startAgainButton: {
    backgroundColor: Colors.accent,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
  },
  startAgainButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
