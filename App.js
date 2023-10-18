import { SafeAreaView, StyleSheet } from "react-native";
import { Provider } from "react-redux";
import store from "./store";
import HomeScreen from "./Screens/HomeScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapScreen from "./Screens/MapScreen";
import LoginScreen from "./Screens/LoginScreen";
import Register from "./Screens/Register";
import AddChat from "./Screens/AddChat";
import Chat from "./Screens/Chat";
import SpashScreen from "./Screens/SpashScreen";

export default function App() {
  const Stack = createNativeStackNavigator();

  const globalScreenOptons = {
    headerStyle: { backgroundColor: "#2c6BED" },
    headerTitleStyle: { color: "white" },
    headerTintColor: "white",
  };

  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaProvider>
          <Stack.Navigator screenOptions={globalScreenOptons}>
            <Stack.Screen
              name="Splash"
              component={SpashScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="AddChat" component={AddChat} />
            <Stack.Screen name="Chat" component={Chat} />
          </Stack.Navigator>
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
