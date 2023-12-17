import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, Platform } from "react-native";
import DrawerNavigator from "./navigation/drawer";
import { store, persistor } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import FischLoading from "./components/loading";
import usePushNotifications from "./utils/usePushNotifications";
const darkmode = true;

if (Platform.OS == "android") {
  NavigationBar.setBackgroundColorAsync(darkmode ? "#000022" : "darkblue");
}

export default function App() {
  const { expoPushToken } = usePushNotifications();
  return (
    <Provider store={store}>
      <PersistGate loading={<FischLoading />} persistor={persistor}>
        <NavigationContainer style={styles.app}>
          <DrawerNavigator />
        </NavigationContainer>
        <StatusBar
          style={darkmode ? "light" : "dark"}
          backgroundColor={darkmode ? "#000022" : "darkblue"}
        />
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  app: {
    backgroundColor: darkmode ? "#000022" : "#F9FBFC",
    flex: 1,
  },
});
