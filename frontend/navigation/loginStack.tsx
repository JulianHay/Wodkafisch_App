import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/home";
import ProfileScreen from "../screens/profile";
import { useState, useEffect } from "react";
import SignInScreen from "../screens/sign_in";
import SignUpScreen from "../screens/sign_up";
import { connect } from 'react-redux';
import { checkAuthenticated } from '../actions/auth';
import ResetPasswordScreen from "../screens/reset_password";

const Stack = createStackNavigator()

const LoginStack = ({isAuthenticated}) => {

    useEffect(() => {
        checkAuthenticated();
    }, []);

    return (
        <Stack.Navigator screenOptions={({ route, navigation }) => ({
            headerShown: false,
        })}>
        
            {isAuthenticated ? (
                <>
                <Stack.Screen name="HomeScreen" component={HomeScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                </>
            ) : (
                <>
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

export default connect(mapStateToProps, {checkAuthenticated})(LoginStack);