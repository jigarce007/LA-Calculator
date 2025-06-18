import React, { useState, useEffect } from "react";
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
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LA_DRUGS } from "../data/toxicData";
import { Colors } from "../theme";
import { PieChart } from "react-native-chart-kit";

export function RemainingVolumeScreen({ route, navigation }) {
  const { dosingWeight, entries } = route.params;
  const lastUsedLA =
    entries.length > 0 ? entries[entries.length - 1].name : LA_DRUGS[0].name;
  const [selectedLA, setSelectedLA] = useState(lastUsedLA);
  const [selectedConcentration, setSelectedConcentration] = useState(
    LA_DRUGS[0].concentrations[0]
  );
  const [isCustomConcentration, setIsCustomConcentration] = useState(false);
  const [customConcentration, setCustomConcentration] = useState("");

  const drug = LA_DRUGS.find((d) => d.name === selectedLA);
  const totalAllowedDose = drug.toxicDose * dosingWeight;
  const totalUsedDoseAll = entries.reduce(
    (sum, e) => sum + parseFloat(e.dose),
    0
  );
  const totalUsedDoseThisDrug = entries
    .filter((e) => e.name === selectedLA)
    .reduce((sum, e) => sum + parseFloat(e.dose), 0);

  const percentUsedAll = (totalUsedDoseAll / totalAllowedDose) * 100;
  const percentUsedThis = (totalUsedDoseThisDrug / totalAllowedDose) * 100;

  const activeConcentration = isCustomConcentration
    ? parseFloat(customConcentration) || 0
    : selectedConcentration;

  const remainingDose = Math.max(0, totalAllowedDose - totalUsedDoseAll);
  const remainingVolume =
    activeConcentration > 0
      ? (remainingDose / activeConcentration).toFixed(2)
      : "0.00";

  const chartWidth = Dimensions.get("window").width - 40;
  const [showLASelectPicker, setShowLASelectPicker] = useState(false);
  const [showConcentrationPicker, setShowConcentrationPicker] = useState(false);

  useEffect(() => {
    if (percentUsedAll >= 90) {
      Alert.alert(
        "Warning",
        `You have already used ${percentUsedAll.toFixed(
          2
        )}% of the total toxic dose! Proceed with caution.`
      );
    }
  }, [percentUsedAll]);

  const getBarColor = (percent) => {
    if (percent < 70) return Colors.success;
    if (percent < 90) return Colors.warning;
    return Colors.danger;
  };

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

        <Text style={styles.label}>Select LA:</Text>
        {Platform.OS === "ios" ? (
          <>
            <TouchableOpacity
              style={styles.pickerTouchableIOS}
              onPress={() => setShowLASelectPicker(!showLASelectPicker)}
            >
              <Text style={styles.pickerText}>{selectedLA}</Text>
            </TouchableOpacity>
            {showLASelectPicker && (
              <Picker
                selectedValue={selectedLA}
                onValueChange={(val) => {
                  setSelectedLA(val);
                  const newDrug = LA_DRUGS.find((d) => d.name === val);
                  setSelectedConcentration(newDrug?.concentrations?.[0] || 0);
                  setShowLASelectPicker(false);
                }}
              >
                {LA_DRUGS.map((drug) => (
                  <Picker.Item
                    key={drug.name}
                    label={drug.name}
                    value={drug.name}
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
                setSelectedConcentration(newDrug?.concentrations?.[0] || 0);
              }}
              style={styles.picker}
            >
              {LA_DRUGS.map((drug) => (
                <Picker.Item
                  key={drug.name}
                  label={drug.name}
                  value={drug.name}
                />
              ))}
            </Picker>
          </View>
        )}

        <Text style={styles.label}>Concentration (mg/ml):</Text>
        {isCustomConcentration ? (
          <TextInput
            placeholder="Custom Concentration"
            placeholderTextColor="#999"
            value={customConcentration}
            onChangeText={setCustomConcentration}
            keyboardType="numeric"
            style={styles.input}
          />
        ) : Platform.OS === "ios" ? (
          <>
            <TouchableOpacity
              style={styles.pickerTouchableIOS}
              onPress={() =>
                setShowConcentrationPicker(!showConcentrationPicker)
              }
            >
              <Text style={styles.pickerText}>
                {`${selectedConcentration} mg/ml (${(
                  selectedConcentration / 10
                ).toFixed(2)}%)`}
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
                {drug?.concentrations?.map((c, i) => (
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

        <View style={styles.resultBox}>
          <Text style={styles.resultHeading}>Remaining Dose & Volume</Text>

          <View style={styles.resultContentRow}>
            <View style={styles.pieChartContainer}>
              <PieChart
                data={[
                  {
                    name: "Used",
                    population: totalUsedDoseAll,
                    color: Colors.success,
                    legendFontColor: "#333",
                    legendFontSize: 12,
                  },
                  {
                    name: "Remaining",
                    population: remainingDose,
                    color: "#d3d3d3",
                    legendFontColor: "#999",
                    legendFontSize: 12,
                  },
                ]}
                width={140}
                height={120}
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  color: () => "#000",
                }}
                accessor="population"
                backgroundColor="transparent"
                center={[20, 0]}
                hasLegend={false}
                absolute
              />
            </View>

            <View style={styles.resultDetails}>
              <Text style={styles.resultLabel}>Total Used:</Text>
              <Text style={styles.resultValue}>
                {totalUsedDoseAll.toFixed(1)} mg ({percentUsedAll.toFixed(1)}%)
              </Text>

              <Text style={styles.resultLabel}>Remaining Dose:</Text>
              <Text style={styles.resultValue}>
                {remainingDose.toFixed(1)} mg
              </Text>

              <Text style={styles.resultLabel}>Remaining Volume:</Text>
              <Text style={styles.resultValue}>{remainingVolume} ml</Text>
            </View>
          </View>
        </View>

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
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  label: {
    marginTop: 8,
    fontWeight: "600",
    fontSize: 14,
  },
  pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 0,
    minHeight: 48,
    marginTop: 4,
  },
  pickerTouchableIOS: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
    justifyContent: "center",
    marginTop: 4,
  },
  pickerText: {
    fontSize: 14,
    color: "#000",
  },
  picker: {
    width: "100%",
    color: "#000",
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 48,
    marginTop: 8,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  resultBox: {
    marginTop: 16,
    padding: 14,
    backgroundColor: Colors.lightPink,
    borderRadius: 10,
    borderColor: Colors.pink,
    borderWidth: 1,
  },
  resultHeading: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: Colors.pink,
    textAlign: "center",
  },
  resultContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pieChartContainer: {
    width: 140,
    height: 120,
  },
  resultDetails: {
    flex: 1,
    paddingLeft: 20,
  },
  resultLabel: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
  },
  resultValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
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
    fontSize: 14,
  },
  pickerTouchableIOS: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginTop: 4,
  },
  pickerText: {
    fontSize: 14,
    color: "#000",
  },
});
