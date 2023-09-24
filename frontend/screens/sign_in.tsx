import {View, Text, StyleSheet, useWindowDimensions, Alert} from 'react-native';
import CustomInput from "../components/custom_input";
import { useState } from 'react';
import CustomButton from '../components/custom_botton';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { login } from '../actions/auth';
import { connect } from 'react-redux';
import client from '../actions/client';

const SignInScreen = ({login}) => {

    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');

    const navigation = useNavigation();

    const {height} = useWindowDimensions();

    const onSignInPressed = async() => {
        if (!username ) {
            Alert.alert('Please enter your username')
            return
        } else if (!password) {
            Alert.alert('Please enter your password')
            return
        }
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };
    
        const body = JSON.stringify({ username, password });
    
        try {
            const res = await client.post('/login', body, config);
    
            if (res.data.success) {
                login(res.data.token)
            } 
        } catch(err) {
            Alert.alert(err.response.data["non_field_errors"][0])
        }
    }

    const onForgotPasswordPressed = () => {
        navigation.navigate('ResetPassword')
    }

    const onSignUpPressed = () => {
        navigation.navigate('SignUp')
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.screen}>
                <Text style={styles.title}>Sign In</Text>
                <CustomInput placeholder='username' value={username} setValue={setUsername}/>
                <CustomInput placeholder='password' value={password} setValue={setPassword} secureTextEntry/>
                <CustomButton text='Sign In' onPress={onSignInPressed}/>
                <CustomButton text='Forgot password?' onPress={onForgotPasswordPressed} type='TERTIARY'/>
                <CustomButton text="Don't have an account? Sign up" onPress={onSignUpPressed} type='TERTIARY'/>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        padding: 20,

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#051C60',
        margin: 10,
    }
})

export default connect(null, { login })(SignInScreen);

