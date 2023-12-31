import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import SponsorScreen from '../screens/sponsors';
import MapScreen from '../screens/map';
import PictureScreen from '../screens/pictures';
import AboutScreen from '../screens/about';
import LoginStack from './loginStack';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { checkAuthenticated } from '../actions/auth';

const darkmode = true

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
            iconName = 'home';
          } else if (route.name === 'Map') {
            iconName = 'map-marker';
          } else if (route.name === 'Pictures') {
            iconName = 'picture-o';
          } else if (route.name === 'Sponsors') {
            iconName = 'money';
          } else if (route.name === 'About') {
            iconName = 'info';
          }
          const colorFocused = focused ? '#047d7f' : 'white'
           
          return <FontAwesome name={iconName} size={size} color={colorFocused} />;
        },
        tabBarActiveTintColor: '#047d7f',
        tabBarInactiveTintColor: 'white',
        tabBarActiveBackgroundColor: darkmode ? '#000022' : 'darkblue',
        tabBarInactiveBackgroundColor: darkmode ? '#000022' : 'darkblue',
        headerShown: false,
        tabBarStyle: {backgroundColor: darkmode ? '#000022' : 'darkblue'}
      })}>
        {isAuthenticated ? (
        <>
        <Tab.Screen name="Home" component={LoginStack} 
          listeners={({ navigation }) => ({
          tabPress: (e) => {
          e.preventDefault();
          navigation.navigate("HomeScreen");
        },})}/>
          <Tab.Screen name="Map" component={MapScreen}/>
          <Tab.Screen name="Pictures" component={PictureScreen}/>
          <Tab.Screen name="Sponsors" component={SponsorScreen}/>
          <Tab.Screen name="About" component={AboutScreen}/>
        </>
        ) : (
        <>
        <Tab.Screen name=" " component={LoginStack}/>
        </>)}
    </Tab.Navigator>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {checkAuthenticated})(TabBar);