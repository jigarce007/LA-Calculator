import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Colors } from "./theme";
import { StatusBar } from "react-native";
import SplashScreen from "./screens/SplashScreen";
import DisclaimerScreen from "./screens/DisclaimerScreen";
import IBWScreen from "./screens/IBWScreen";
import LACalculatorScreen from "./screens/LACalculatorScreen";
import { RemainingVolumeScreen } from "./screens/RemainingVolumeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#2b1950" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerStyle: { backgroundColor: "#2b1950" }, // header background
            headerTintColor: "#fff", // back button and icons
            headerTitleStyle: { color: "#fff" }, // title text color
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Disclaimer"
            component={DisclaimerScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="IBW"
            component={IBWScreen}
            options={{ title: "IBW Calculator" }} // shows back button
          />
          <Stack.Screen
            name="Calculator"
            component={LACalculatorScreen}
            options={{ title: "Local Anaesthetic Dosing" }} // shows back button
          />
          <Stack.Screen
            name="RemainingVolume"
            component={RemainingVolumeScreen}
            options={{ title: "Remaining Volume" }} // shows back button
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
