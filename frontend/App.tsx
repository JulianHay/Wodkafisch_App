import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import DrawerNavigator from './navigation/drawer';
import { Provider } from 'react-redux';
import store from './store';

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer style={styles.app}>
          <DrawerNavigator/>
      </NavigationContainer>
    </Provider>
    );
}

const styles = StyleSheet.create({
  app: {
    backgroundColor: '#F9FBFC',
    flex: 1,
  }
});
