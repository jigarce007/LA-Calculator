import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";
import { Colors } from "./theme";

// Screens
import SplashScreen from "./screens/SplashScreen";
import DisclaimerScreen from "./screens/DisclaimerScreen";
import IBWScreen from "./screens/IBWScreen";
import LACalculatorScreen from "./screens/LACalculatorScreen";
import { RemainingVolumeScreen } from "./screens/RemainingVolumeScreen";
import InjectionPlanScreen from "./screens/InjectionPlanScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <StatusBar barStyle="light-content" backgroundColor="#2b1950" />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
              headerStyle: { backgroundColor: "#2b1950" },
              headerTintColor: "#fff",
              headerTitleStyle: { color: "#fff" },
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
              options={{ title: "IBW Calculator" }}
            />
            <Stack.Screen
              name="Calculator"
              component={LACalculatorScreen}
              options={{ title: "Local Anaesthetic Dosing" }}
            />
            <Stack.Screen
              name="RemainingVolume"
              component={RemainingVolumeScreen}
              options={{ title: "Remaining Volume" }}
            />
            <Stack.Screen
              name="InjectionPlan"
              component={InjectionPlanScreen}
              options={{ headerShown: true }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
