import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LA_DRUGS } from "../data/toxicData";
import { Colors } from "../theme";

export function RemainingVolumeScreen({ route, navigation }) {
  const { dosingWeight, entries } = route.params;

  const [selectedLA, setSelectedLA] = useState(LA_DRUGS[0].name);
  const [selectedConcentration, setSelectedConcentration] = useState(
    LA_DRUGS[0].concentrations[0]
  );
  const [isCustomConcentration, setIsCustomConcentration] = useState(false);
  const [customConcentration, setCustomConcentration] = useState("");

  const drug = LA_DRUGS.find((d) => d.name === selectedLA);
  const totalAllowedDose = drug.toxicDose * dosingWeight;
  const totalUsedDose = entries
    .filter((e) => e.name === selectedLA)
    .reduce((sum, e) => sum + parseFloat(e.dose), 0);

  const activeConcentration = isCustomConcentration
    ? parseFloat(customConcentration) || 0
    : selectedConcentration;

  const remainingDose = Math.max(0, totalAllowedDose - totalUsedDose);
  const remainingVolume =
    activeConcentration > 0
      ? (remainingDose / activeConcentration).toFixed(2)
      : "0.00";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Remaining Volume Calculator</Text>
        <Text style={styles.subtitle}>Dosing Weight: {dosingWeight} kg</Text>

        {/* LA Drug Picker */}
        <Text style={styles.label}>Select LA:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedLA}
            onValueChange={(val) => {
              setSelectedLA(val);
              const newDrug = LA_DRUGS.find((d) => d.name === val);
              setSelectedConcentration(newDrug?.concentrations?.[0] || 0);
            }}
            style={styles.picker}
          >
            {LA_DRUGS.map((drug) => (
              <Picker.Item
                label={drug.name}
                value={drug.name}
                key={drug.name}
              />
            ))}
          </Picker>
        </View>

        {/* Concentration Picker or Custom Input */}
        <Text style={styles.label}>Concentration (mg/ml):</Text>
        {isCustomConcentration ? (
          <TextInput
            placeholder="Custom Concentration (mg/ml)"
            placeholderTextColor="#999"
            value={customConcentration}
            onChangeText={setCustomConcentration}
            keyboardType="numeric"
            style={styles.input}
          />
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedConcentration}
              onValueChange={(val) => setSelectedConcentration(val)}
              style={styles.picker}
            >
              {drug?.concentrations?.map((c, i) => (
                <Picker.Item
                  label={`${c} mg/ml (${(c / 10).toFixed(2)}%)`}
                  value={c}
                  key={i}
                />
              ))}
            </Picker>
          </View>
        )}

        {/* Custom Switch */}
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Use Custom Concentration</Text>
          <Switch
            value={isCustomConcentration}
            onValueChange={(val) => {
              setIsCustomConcentration(val);
              if (!val) setCustomConcentration("");
            }}
            trackColor={{ false: "#ccc", true: Colors.accentlight }}
            thumbColor={isCustomConcentration ? Colors.accent : "#f4f3f4"}
            ios_backgroundColor="#ccc"
          />
        </View>

        {/* Result */}
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            Remaining Dose: {remainingDose.toFixed(2)} mg
          </Text>
          <Text style={styles.resultText}>
            Remaining Volume: {remainingVolume} ml
          </Text>
        </View>

        {/* Start Again Button */}
        <TouchableOpacity
          style={styles.startAgainButton}
          onPress={() =>
            Alert.alert("Start Again", "Reset everything?", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Yes",
                onPress: () =>
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "IBW" }],
                  }),
              },
            ])
          }
        >
          <Text style={styles.startAgainButtonText}>Start Again</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 50,
    marginTop: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  resultBox: {
    marginTop: 20,
    padding: 15,
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
