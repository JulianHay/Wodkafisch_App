import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Platform } from 'react-native';
import DrawerNavigator from './navigation/drawer';
import { Provider } from 'react-redux';
import store from './store';
import {StatusBar} from 'expo-status-bar'
import * as NavigationBar from 'expo-navigation-bar';

if (Platform.OS == 'android') {
  NavigationBar.setBackgroundColorAsync("darkblue");
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer style={styles.app}>
          <DrawerNavigator/>
      </NavigationContainer>
      <StatusBar style="light" backgroundColor='darkblue'/>
    </Provider>
    );
}

const styles = StyleSheet.create({
  app: {
    backgroundColor: '#F9FBFC',
    flex: 1,
  }
});
