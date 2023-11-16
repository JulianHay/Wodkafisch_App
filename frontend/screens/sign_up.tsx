import {View, Text, StyleSheet, useWindowDimensions, Linking, ScrollView} from 'react-native';
import CustomInput from "../components/custom_input";
import { useState } from 'react';
import CustomButton from '../components/custom_botton';
import { useNavigation } from '@react-navigation/native';
import client from '../actions/client';
import { register } from '../actions/auth';
import { CustomText } from '../components/text';

const darkmode = true

const SignUpScreen = () => {

    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [email,setEmail] = useState('');
    const [passwordRepeat,setPasswordRepeat] = useState('');
    
    const {height} = useWindowDimensions();

    const navigation = useNavigation();

    const onRegisterPressed = () => {
        register(firstName,lastName,username,email,password,passwordRepeat);
    }

    const onPricacyPolicyPressed = () => {
        Linking.openURL('https://www.wodkafis.ch/privacy_policy/');
    }

    const onTermsOfUsePressed = () => {
        Linking.openURL('https://www.wodkafis.ch/terms_and_conditions/')
    }

    const onSignInPressed = () => {
        navigation.navigate('SignIn')
    }

    return (
            <View style={styles.screen}>            
                <CustomText fontSize={24} fontWeight='bold'>Sign Up</CustomText>
                <CustomInput placeholder='Fisrt Name' value={firstName} setValue={setFirstName}/>
                <CustomInput placeholder='Last Name' value={lastName} setValue={setLastName}/>
                <CustomInput placeholder='Username' value={username} setValue={setUsername}/>
                <CustomInput placeholder='Email' value={email} setValue={setEmail} />
                <CustomInput placeholder='Password' value={password} setValue={setPassword} secureTextEntry/>
                <CustomInput placeholder='Repeat Password' value={passwordRepeat} setValue={setPasswordRepeat} secureTextEntry/>
                
                <CustomButton text='Register' onPress={onRegisterPressed}/>
                
                <Text style={styles.text}> By registering, you accept our <Text style={styles.link} onPress={onTermsOfUsePressed}>Terms of Use</Text> and <Text style={styles.link} onPress={onPricacyPolicyPressed}>Privacy Policy</Text></Text>
                
                <CustomButton text="Have an account? Sign in" onPress={onSignInPressed} type='TERTIARY'/>
            </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        padding: 20,
        backgroundColor: darkmode ? "#000022" : "darkblue",
        flex:1,
        width:'100%'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#051C60',
        margin: 10,
    },
    text: {
        color: 'grey',
        marginVertical: 10,
    },
    link: {
        color: '#206a43'
    }

})

export default SignUpScreen