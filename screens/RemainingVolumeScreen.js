import React, { useState, useEffect, useRef } from "react";
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
  Animated,
  Easing,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import { LA_DRUGS } from "../data/toxicData";
import { Colors } from "../theme";
import { PieChart } from "react-native-chart-kit";
import { ProgressBar } from "react-native-paper";
export function RemainingVolumeScreen({ route, navigation }) {
  const { dosingWeight, entries, totalPercentUsed } = route.params;

  const lastUsedLA =
    entries.length > 0 ? entries[entries.length - 1].name : LA_DRUGS[0].name;
  const [selectedLA, setSelectedLA] = useState(lastUsedLA);
  const initialDrug = LA_DRUGS.find((d) => d.name === lastUsedLA);
  const [selectedConcentration, setSelectedConcentration] = useState(
    initialDrug?.concentrations?.[0] || 0
  );
  const [isCustomConcentration, setIsCustomConcentration] = useState(false);
  const [customConcentration, setCustomConcentration] = useState("");

  const drug = LA_DRUGS.find((d) => d.name === selectedLA);
  const totalAllowedDose = drug.toxicDose * dosingWeight;

  const activeConcentration = isCustomConcentration
    ? parseFloat(customConcentration) || 0
    : selectedConcentration;

  // ✅ Use passed fixed totalPercentUsed
  const remainingFraction = 1 - totalPercentUsed / 100;
  const remainingDose = Math.max(0, totalAllowedDose * remainingFraction);
  const remainingVolume =
    activeConcentration > 0
      ? (remainingDose / activeConcentration).toFixed(2)
      : "0.00";

  const chartWidth = Dimensions.get("window").width - 40;
  const [showLASelectPicker, setShowLASelectPicker] = useState(false);
  const [showConcentrationPicker, setShowConcentrationPicker] = useState(false);
  const riskLevel =
    remainingFraction > 0.5
      ? "Low"
      : remainingFraction > 0.2
      ? "Caution"
      : "High";
  const riskColor =
    remainingFraction > 0.5
      ? "#4CAF50"
      : remainingFraction > 0.2
      ? "#FFC107"
      : "#F44336";

  useEffect(() => {
    if (totalPercentUsed >= 90) {
      Alert.alert(
        "Warning",
        `You have already used ${totalPercentUsed.toFixed(
          2
        )}% of the total toxic dose! Proceed with caution.`
      );
    }
  }, [totalPercentUsed]);

  const getDrugColor = (index) => {
    const presetColors = [
      "#F44388",
      "#2196F3",
      "#4CAF50",
      "#FFC107",
      "#9C27B0",
      "#FF5722",
    ];
    return presetColors[index % presetColors.length];
  };

  // ✅ Use stored entry.percent directly instead of recalculating based on selected drug
  const drugPercentMap = {};
  entries.forEach((entry) => {
    if (!drugPercentMap[entry.name]) drugPercentMap[entry.name] = 0;
    drugPercentMap[entry.name] += entry.percent;
  });

  const pieChartData = Object.entries(drugPercentMap).map(
    ([name, percent], index) => ({
      name,
      population: percent,
      color: getDrugColor(index),
      legendFontColor: "#333",
      legendFontSize: 12,
    })
  );

  // ✅ Add remaining slice
  pieChartData.push({
    name: "Remaining",
    population: Math.max(0, 100 - totalPercentUsed),
    color: "#d3d3d3",
    legendFontColor: "#999",
    legendFontSize: 12,
  });

  const legendItems = Object.entries(drugPercentMap).map(
    ([name, percent], index) => ({
      name: `${name} (${percent.toFixed(1)}%)`,
      color: getDrugColor(index),
    })
  );

  const scaleAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (riskLevel === "High") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1); // reset if not high
    }
  }, [riskLevel]);
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
                {drug?.concentrations?.map((c, i) => (
                  <Picker.Item
                    key={i}
                    label={`${c} mg/ml (${(c / 10).toFixed(2)}%)`}
                    value={c}
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
              {drug?.concentrations?.map((c, i) => (
                <Picker.Item
                  key={i}
                  label={`${c} mg/ml (${(c / 10).toFixed(2)}%)`}
                  value={c}
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
          />
        </View>

        <View style={styles.resultBox}>
          <Text style={styles.resultHeading}>Remaining Dose & Volume</Text>

          <View style={styles.resultContentRow}>
            <View style={styles.pieChartContainer}>
              <PieChart
                data={pieChartData}
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
                center={[30, 0]}
                hasLegend={false}
                absolute
              />
              <Text style={styles.pieCenterLabel}>
                {`${totalPercentUsed.toFixed(0)}%`}
              </Text>
            </View>

            <View style={styles.resultDetails}>
              <Text style={styles.resultLabel}>Remaining Toxic Dose:</Text>
              <Text style={styles.resultValue}>
                {(remainingFraction * 100).toFixed(1)}%
              </Text>

              <Text style={styles.resultLabel}>Remaining Dose:</Text>
              <Text style={styles.resultValue}>
                {remainingDose.toFixed(1)} mg
              </Text>

              <Text style={styles.resultLabel}>Remaining Volume:</Text>
              <View style={{ marginVertical: 5 }}>
                <ProgressBar
                  progress={remainingFraction}
                  color={
                    remainingFraction > 0.5
                      ? "#4CAF50"
                      : remainingFraction > 0.2
                      ? "#FFC107"
                      : "#F44336"
                  }
                  style={{ height: 10, borderRadius: 15 }}
                />
                <Text style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                  {remainingVolume} ml safe to use
                </Text>
              </View>
              <Text style={styles.resultValue}>{remainingVolume} ml</Text>
              <View style={[styles.riskBadge, { backgroundColor: riskColor }]}>
                <Animated.View
                  style={[
                    styles.riskBadge,
                    {
                      backgroundColor: riskColor,
                      transform: [{ scale: scaleAnim }],
                    },
                  ]}
                >
                  <Text style={styles.riskText}>{riskLevel} Risk</Text>
                </Animated.View>
              </View>
            </View>
          </View>

          <View style={styles.legendContainer}>
            {legendItems.map((item, index) => (
              <View style={styles.legendItem} key={`${item.name}-${index}`}>
                <View
                  style={[styles.legendDot, { backgroundColor: item.color }]}
                />
                <Text style={styles.legendText}>{item.name}</Text>
              </View>
            ))}
          </View>
          <View style={styles.breakdownBox}>
            <Text style={styles.resultHeading}>Per-Drug Dose Breakdown</Text>
            {Object.entries(drugPercentMap).map(([name, percent], index) => {
              const entryDose = entries
                .filter((e) => e.name === name)
                .reduce((sum, e) => sum + e.dose, 0);

              return (
                <View style={styles.breakdownRow} key={name}>
                  <Text style={styles.breakdownDrugName}>{name}</Text>
                  <Text style={styles.breakdownDose}>
                    {entryDose.toFixed(1)} mg ({percent.toFixed(1)}%)
                  </Text>
                </View>
              );
            })}
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
                  navigation.reset({ index: 0, routes: [{ name: "IBW" }] }),
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
    alignItems: "center",
    justifyContent: "center",
    width: 160,
    height: 140,
    position: "relative",
  },
  pieCenterLabel: {
    position: "absolute",
    top: "45%",
    textAlign: "center",
    fontSize: 10,
    fontWeight: "500",
    color: "#fff",
    lineHeight: 20, // optional for spacing
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
  riskBadge: {
    marginTop: 3,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  riskText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
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
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 15,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "33%", // 3 per row
    marginBottom: 4,
    marginHorizontal: 5,
  },
  legendDot: {
    width: 5,
    height: 5,
    borderRadius: 4,
    marginRight: 4,
    marginHorizontal: 5,
  },
  legendText: {
    fontSize: 8,
    color: "#545454",
    fontWeight: "500",
  },
  breakdownBox: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  breakdownDrugName: {
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
  },

  breakdownDose: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#555",
  },
});
