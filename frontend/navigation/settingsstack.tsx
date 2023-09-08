import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/home";
import ProfileScreen from "../screens/profile";
import { useState, useEffect } from "react";
import SignInScreen from "../screens/sign_in";
import SignUpScreen from "../screens/sign_up";
import { connect } from 'react-redux';
import { checkAuthenticated } from '../actions/auth';
import ResetPasswordScreen from "../screens/reset_password";
import PictureScreen from "../screens/pictures";

const Stack = createStackNavigator()

const SettingsStack = ({isAuthenticated}) => {

    useEffect(() => {
        checkAuthenticated();
    }, []);

    return (
        <Stack.Navigator screenOptions={({ route, navigation }) => ({
            headerShown: false,
        })}>
        
            {isAuthenticated ? (
                <>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                </>
            ) : (
                <>
                
                <Stack.Screen name="Sponsor" component={PictureScreen} />
                <Stack.Screen name="SignIn" component={SignInScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                </>
            )}
        </Stack.Navigator>
    );
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {checkAuthenticated})(SettingsStack);