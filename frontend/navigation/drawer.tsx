import { DrawerContentScrollView, DrawerItem, createDrawerNavigator } from "@react-navigation/drawer";
import { TouchableOpacity, View, Image, SafeAreaView} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import TabBar from "./tabbar";
import { logout } from "../actions/auth";
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { checkAuthenticated } from '../actions/auth';

const Drawer = createDrawerNavigator();

const LogoutDrawerItem = ({logout}) => {
    return(
      <DrawerItem
          label="Logout"
          onPress={() => {
            logout()
          }}/>
    )
}

const ConnectedLogoutDrawerItem = connect(null, {logout})(LogoutDrawerItem)

const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItem
          label="Profile"
          onPress={() => props.navigation.navigate('Profile')}
        />
        <ConnectedLogoutDrawerItem/>
      </DrawerContentScrollView>
    );
  }

const DrawerNavigator = ({isAuthenticated}) => {

    useEffect(() => {
      checkAuthenticated();
    }, []);

    return (
        <Drawer.Navigator screenOptions={({ route, navigation }) => ({
            headerTitle: () => <View/>,
            headerLeft: () => (
            <View style={{padding: 20}}>
                <SafeAreaView>
                <Image source={require('../assets/fisch.png')} style={{ width: 50, height: 50, resizeMode: 'contain' }}  />
                </SafeAreaView>
            </View> 
            ),
            headerRight: () => (
            <View style={{padding: 20}}>
                <TouchableOpacity onPress={() => (isAuthenticated ? (navigation.openDrawer()):(''))}>
                <FontAwesome name='bars' color='white' size={18}/>
                </TouchableOpacity>
            </View>
        ),
        headerStyle: {backgroundColor: 'darkblue'},
        drawerPosition: "right",
        })} drawerContent={(props) => isAuthenticated ? <CustomDrawerContent {...props}/> : (props.navigation.closeDrawer())}>
            <Drawer.Screen name="Home" component={TabBar}/>
        </Drawer.Navigator>
    );
}


const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {checkAuthenticated})(DrawerNavigator);