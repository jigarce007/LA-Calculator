import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  Platform,
  Switch,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ProgressBar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../theme";
import { LA_DRUGS } from "../data/toxicData";

export default function LACalculatorScreen({ route, navigation }) {
  const { dosingWeight } = route.params;
  const [selectedLA, setSelectedLA] = useState(LA_DRUGS[0].name);
  const [selectedConcentration, setSelectedConcentration] = useState(
    LA_DRUGS[0].concentrations[0]
  );
  const [useCustomConcentration, setUseCustomConcentration] = useState(false);
  const [customConcentration, setCustomConcentration] = useState("");
  const [volume, setVolume] = useState("");
  const [entries, setEntries] = useState([]);
  const [totalPercentUsed, setTotalPercentUsed] = useState(0);
  const [showLAPicker, setShowLAPicker] = useState(false);
  const [showConcentrationPicker, setShowConcentrationPicker] = useState(false);

  const drug = LA_DRUGS.find((d) => d.name === selectedLA);
  const numericWeight = Number(dosingWeight) || 0;

  const effectiveConcentration = useCustomConcentration
    ? parseFloat(customConcentration)
    : selectedConcentration;

  const maxDose = drug.toxicDose * numericWeight;
  const maxVolume = maxDose / effectiveConcentration;

  const addDrug = () => {
    const vol = parseFloat(volume);
    const conc = effectiveConcentration;

    if (isNaN(vol) || vol <= 0 || isNaN(conc) || conc <= 0) {
      Alert.alert(
        "Invalid Input",
        "Please enter valid concentration and volume."
      );
      return;
    }

    const doseUsed = vol * conc;
    const percentUsed = (doseUsed / maxDose) * 100;
    const newTotal = totalPercentUsed + percentUsed;

    if (newTotal > 100) {
      Alert.alert("Overdose Warning", "This would exceed 100% of toxic dose.");
      return;
    }

    const newEntry = {
      id: entries.length + 1,
      name: selectedLA,
      concentration: conc,
      volume: vol,
      dose: doseUsed,
      percent: percentUsed,
    };

    setEntries([...entries, newEntry]);
    setTotalPercentUsed(newTotal);
    setVolume("");
    setCustomConcentration("");
    setUseCustomConcentration(false);
  };

  const deleteEntry = (id) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id);
    const updatedTotal = updatedEntries.reduce(
      (sum, entry) => sum + parseFloat(entry.percent),
      0
    );
    setEntries(updatedEntries);
    setTotalPercentUsed(updatedTotal);
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
          Total Toxic Dose Used: {totalPercentUsed.toFixed(2)}%
        </Text>

        <View style={styles.progressBarContainer}>
          <ProgressBar
            progress={totalPercentUsed / 100}
            color={
              totalPercentUsed > 85
                ? "red"
                : totalPercentUsed > 50
                ? "orange"
                : "green"
            }
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>
            {totalPercentUsed.toFixed(2)}% of Toxic Dose Used
          </Text>
        </View>

        {canAddMore ? (
          <View style={styles.form}>
            <Text style={styles.label}>Select Local Anaesthetic:</Text>
            {Platform.OS === "ios" ? (
              <>
                <TouchableOpacity
                  style={styles.pickerDisplay}
                  onPress={() => setShowLAPicker(!showLAPicker)}
                >
                  <Text>{selectedLA}</Text>
                </TouchableOpacity>
                {showLAPicker && (
                  <Picker
                    selectedValue={selectedLA}
                    onValueChange={(val) => {
                      setSelectedLA(val);
                      const newDrug = LA_DRUGS.find((d) => d.name === val);
                      setSelectedConcentration(newDrug.concentrations[0]);
                      setShowLAPicker(false);
                    }}
                  >
                    {LA_DRUGS.map((drug) => (
                      <Picker.Item
                        label={drug.name}
                        value={drug.name}
                        key={drug.name}
                      />
                    ))}
                  </Picker>
                )}
              </>
            ) : (
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
                    />
                  ))}
                </Picker>
              </View>
            )}

            <Text style={styles.label}>Use Custom Concentration?</Text>
            <Switch
              value={useCustomConcentration}
              onValueChange={setUseCustomConcentration}
            />

            {useCustomConcentration ? (
              <TextInput
                placeholder="Enter custom concentration (mg/ml)"
                value={customConcentration}
                onChangeText={setCustomConcentration}
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor="#999"
              />
            ) : (
              <>
                <Text style={styles.label}>Concentration (mg/ml):</Text>
                {Platform.OS === "ios" ? (
                  <>
                    <TouchableOpacity
                      style={styles.pickerDisplay}
                      onPress={() =>
                        setShowConcentrationPicker(!showConcentrationPicker)
                      }
                    >
                      <Text>
                        {selectedConcentration} mg/ml (
                        {(selectedConcentration / 10).toFixed(2)}%)
                      </Text>
                    </TouchableOpacity>
                    {showConcentrationPicker && (
                      <Picker
                        selectedValue={selectedConcentration}
                        onValueChange={(val) => {
                          setSelectedConcentration(val);
                          setShowConcentrationPicker(false);
                        }}
                      >
                        {drug.concentrations.map((c, i) => (
                          <Picker.Item
                            label={`${c} mg/ml (${(c / 10).toFixed(2)}%)`}
                            value={c}
                            key={i}
                          />
                        ))}
                      </Picker>
                    )}
                  </>
                ) : (
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={selectedConcentration}
                      onValueChange={setSelectedConcentration}
                      style={styles.picker}
                    >
                      {drug.concentrations.map((c, i) => (
                        <Picker.Item
                          label={`${c} mg/ml (${(c / 10).toFixed(2)}%)`}
                          value={c}
                          key={i}
                        />
                      ))}
                    </Picker>
                  </View>
                )}
              </>
            )}

            <TextInput
              placeholder="Planned Volume (ml)"
              value={volume}
              onChangeText={setVolume}
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#999"
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
            <View style={styles.entryRow}>
              <View style={styles.entryDetails}>
                <Text style={styles.entrytext}>
                  {item.name} — {item.concentration} mg/ml (
                  {(item.concentration / 10).toFixed(2)}%)
                </Text>
                <Text style={styles.entrytext}>Volume: {item.volume} ml</Text>
                <Text style={styles.entrytext}>
                  Dose: {item.dose} mg ({item.percent}%)
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => deleteEntry(item.id)}
                style={styles.iconButton}
              >
                <Ionicons name="close" size={20} color={Colors.accent} />
              </TouchableOpacity>
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
    backgroundColor: Colors.white,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
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
  picker: {
    width: "100%",
    height: 50,
    color: "#000",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    backgroundColor: "#fff",
    marginVertical: 10,
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
  warning: {
    color: "red",
    marginTop: 10,
    fontWeight: "bold",
  },
  progressBarContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    color: "#555",
    marginTop: 5,
  },
  form: {
    marginTop: 10,
  },
  bottomSection: {
    flex: 1,
    marginTop: 10,
  },
  resultTitle: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginBottom: 8,
    borderRadius: 5,
  },
  entryDetails: {
    flex: 1,
  },
  entrytext: {
    fontSize: 14,
  },
  iconButton: {
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: Colors.accent,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  secondaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
