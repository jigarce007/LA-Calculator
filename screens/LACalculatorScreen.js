import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Switch,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Easing,
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topSection}>
            <Text style={styles.title}>
              Dosing Weight:{" "}
              {isNaN(dosingWeight)
                ? "Invalid"
                : Number(dosingWeight).toFixed(2)}{" "}
              kg
            </Text>
            <Text style={styles.subtitle}>
              Total Toxic Dose Used: {totalPercentUsed.toFixed(2)}%
            </Text>
            {totalPercentUsed >= 90 && (
              <View
                style={[styles.warningBadge, { backgroundColor: "#F44336" }]}
              >
                <Text style={styles.warningBadgeText}>
                  High Risk: Close to Toxic Limit
                </Text>
              </View>
            )}
            <View style={styles.progressBarContainer}>
              {entries.length > 0 && (
                <View style={styles.drugSummaryBadge}>
                  <Text style={styles.drugSummaryText}>
                    💉{" "}
                    {[...new Set(entries.map((entry) => entry.name))].join(
                      ", "
                    )}{" "}
                    ({[...new Set(entries.map((entry) => entry.name))].length}{" "}
                    drug{entries.length > 1 ? "s" : ""} added)
                  </Text>
                </View>
              )}
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
                <Text style={styles.formHeading}>Add Local Anaesthetic</Text>
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
                  <Text style={styles.addButtonText}>
                    Add Local Anaesthetic
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.warning}>
                Cumulative toxic dose ≥ 95%. No more LAs can be added.
              </Text>
            )}
          </View>

          <View style={styles.bottomSection}>
            {entries.length > 0 && (
              <Text style={styles.resultTitle}>Summary</Text>
            )}

            {entries.map((item) => (
              <View style={styles.cardEntry} key={item.id}>
                <View style={styles.cardHeader}>
                  <Text style={styles.drugName}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => deleteEntry(item.id)}
                    style={styles.iconButton}
                  >
                    <Ionicons name="close" size={20} color={Colors.pink} />
                  </TouchableOpacity>
                </View>

                <View style={styles.cardContentRow}>
                  <Text style={styles.entryText}>
                    {item.concentration} mg/ml (
                    {(item.concentration / 10).toFixed(2)}%)
                  </Text>
                  <Text style={styles.entryText}>Volume: {item.volume} ml</Text>
                </View>

                <View style={styles.cardContentRow}>
                  <Text style={styles.entryText}>
                    Dose: {item.dose.toFixed(1)} mg
                  </Text>
                  <Text style={styles.entryText}>
                    {item.percent.toFixed(1)}% of toxic dose
                  </Text>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() =>
                navigation.navigate("RemainingVolume", {
                  dosingWeight,
                  entries,
                  totalPercentUsed, // 👈 pass total percent used
                })
              }
            >
              <Text style={styles.secondaryButtonText}>
                Calculate Remaining Volume
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
  cardEntry: {
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3", // blue stripe for visual branding
  },
  warningBadge: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  warningBadgeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  drugName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },

  cardContentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },

  entryText: {
    fontSize: 14,
    color: "#555",
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
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
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
    borderRadius: 5,
    padding: 12,
    marginTop: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    marginBottom: 12,
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
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  drugSummaryBadge: {
    backgroundColor: "#E0F7FA",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  drugSummaryText: {
    color: "#00796B",
    fontSize: 13,
    fontWeight: "600",
  },
  progressText: {
    fontSize: 12,
    color: "#555",
    marginTop: 5,
  },
  form: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android
  },
  formHeading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
    color: "#333",
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
    backgroundColor: Colors.lightgreen,
    padding: 10,
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.accent,
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
