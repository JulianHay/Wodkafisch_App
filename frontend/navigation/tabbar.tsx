import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import SponsorScreen from '../screens/sponsors';
import HomeScreen from '../screens/home';
import MapScreen from '../screens/map';
import PictureScreen from '../screens/pictures';
import AboutScreen from '../screens/about';
import SettingsStack from './settingsstack';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { checkAuthenticated } from '../actions/auth';

const Tab = createBottomTabNavigator();

const TabBar = ({isAuthenticated}) => {

  useEffect(() => {
    checkAuthenticated();
  }, []);

  return (
    <Tab.Navigator screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
  
          if (route.name === 'Home') {
            iconName = focused ? 'ios-home' : 'ios-home-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'world' : 'world';
          } else if (route.name === 'Pictures') {
            iconName = focused ? 'picture' : 'picture';
          } else if (route.name === 'Sponsors') {
            iconName = focused ? 'dollar-sign' : 'dollar-sign';
          } else if (route.name === 'About') {
            iconName = focused ? 'ios-information-circle' : 'ios-information-circle-outline';
          }
           
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarActiveBackgroundColor: 'darkblue',
        tabBarInactiveBackgroundColor: 'darkblue',
        headerShown: false,
      })}>
        {isAuthenticated ? (
        <>
          <Tab.Screen name="Home" component={SettingsStack}/>
          <Tab.Screen name="Map" component={MapScreen}/>
          <Tab.Screen name="Pictures" component={PictureScreen}/>
          <Tab.Screen name="Sponsors" component={SponsorScreen}/>
          <Tab.Screen name="About" component={AboutScreen}/>
        </>
        ) : (
        <>
        <Tab.Screen name=" " component={SettingsStack}/>
        </>)}
    </Tab.Navigator>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {checkAuthenticated})(TabBar);