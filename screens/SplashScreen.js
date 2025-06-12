import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Colors } from "../theme";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Disclaimer");
    }, 3000); // Show logo for 2 seconds
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.logoic}
        source={require("../assets/adaptive-icon.png")}
      />
      <Image style={styles.logo} source={require("../assets/logo.png")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 450,
    height: 200,
    fontWeight: "bold",
  },
  logoic: {
    width: 100,
    height: 100,
    fontWeight: "bold",
    backgroundColor: Colors.white,
  },
});
