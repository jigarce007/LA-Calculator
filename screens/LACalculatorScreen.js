import React, { useState } from "react";
import { Colors } from "../theme";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LA_DRUGS } from "../data/toxicData";

export default function LACalculatorScreen({ route, navigation }) {
  const { dosingWeight } = route.params;

  const [selectedLA, setSelectedLA] = useState(LA_DRUGS[0].name);
  const [selectedConcentration, setSelectedConcentration] = useState(
    LA_DRUGS[0].concentrations[0]
  );
  const [volume, setVolume] = useState("");
  const [entries, setEntries] = useState([]);
  const [totalPercentUsed, setTotalPercentUsed] = useState(0);

  const drug = LA_DRUGS.find((d) => d.name === selectedLA);
  const numericWeight = Number(dosingWeight) || 0;
  const maxDose = drug.toxicDose * numericWeight;
  const maxVolume = maxDose / selectedConcentration;

  const addDrug = () => {
    const vol = parseFloat(volume);
    if (isNaN(vol) || vol <= 0) {
      Alert.alert("Invalid Volume", "Enter a valid volume.");
      return;
    }

    const doseUsed = vol * selectedConcentration;
    const percentUsed = (doseUsed / (drug.toxicDose * dosingWeight)) * 100;
    const newTotal = totalPercentUsed + percentUsed;

    if (newTotal > 100) {
      Alert.alert("Overdose Warning", "This would exceed 100% of toxic dose.");
      return;
    }

    const newEntry = {
      id: entries.length + 1,
      name: selectedLA,
      concentration: selectedConcentration,
      volume: vol,
      dose: doseUsed.toFixed(1),
      percent: percentUsed.toFixed(1),
    };

    setEntries([...entries, newEntry]);
    setTotalPercentUsed(newTotal);
    setVolume("");
  };

  const canAddMore = totalPercentUsed < 95;

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.title}>
          Dosing Weight:{" "}
          {isNaN(dosingWeight) ? "Invalid" : Number(dosingWeight).toFixed(2)} kg
        </Text>
        <Text style={styles.subtitle}>
          Total Toxic Dose Used: {totalPercentUsed.toFixed(1)}%
        </Text>

        {canAddMore ? (
          <View style={styles.form}>
            <Text style={styles.label}>Select Local Anaesthetic:</Text>
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
                  <Picker.Item
                    label={drug.name}
                    value={drug.name}
                    key={drug.name}
                    style={styles.pickerItem}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Concentration (mg/ml):</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedConcentration}
                onValueChange={setSelectedConcentration}
                style={styles.picker}
              >
                {drug.concentrations.map((c, i) => (
                  <Picker.Item
                    label={`${c} mg/ml (${(c / 10).toFixed(1)}%)`}
                    value={c}
                    key={i}
                    style={styles.pickerItem}
                  />
                ))}
              </Picker>
            </View>
            <TextInput
              placeholder="Planned Volume (ml)"
              value={volume}
              placeholderTextColor="#999"
              onChangeText={setVolume}
              keyboardType="numeric"
              style={styles.input}
            />

            <TouchableOpacity style={styles.addButton} onPress={addDrug}>
              <Text style={styles.addButtonText}>Add Local Anaesthetic</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.warning}>
            Cumulative toxic dose ≥ 95%. No more LAs can be added.
          </Text>
        )}
      </View>

      <View style={styles.bottomSection}>
        {entries.length > 0 && <Text style={styles.resultTitle}>Summary</Text>}

        <FlatList
          data={entries}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.entry}>
              <Text>
                {item.name} {item.concentration} mg/ml (
                {(item.concentration / 10).toFixed(1)}%)
              </Text>
              <Text>Volume: {item.volume} ml</Text>
              <Text>
                Dose: {item.dose} mg ({item.percent}%)
              </Text>
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() =>
            navigation.navigate("RemainingVolume", {
              dosingWeight,
              entries,
            })
          }
        >
          <Text style={styles.secondaryButtonText}>
            Calculate Remaining Volume
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  topSection: {
    paddingBottom: 10,
  },
  bottomSection: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 10,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    marginTop: 10,
  },
  picker: {
    width: "100%",
    height: 50, // Match container height
    color: "#000", // Picker text color
    fontSize: 16, // Adjust font size
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginTop: 10,
    borderRadius: 10,
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
  warning: {
    marginTop: 20,
    color: "red",
    fontWeight: "bold",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  entry: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.accent,
    borderRadius: 8,
    backgroundColor: "#f4ffff",
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
});
