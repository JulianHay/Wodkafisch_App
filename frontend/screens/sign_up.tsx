import {View, Text, StyleSheet, useWindowDimensions, Linking, ScrollView, Alert} from 'react-native';
import CustomInput from "../components/custom_input";
import { useState } from 'react';
import CustomButton from '../components/custom_botton';
import { useNavigation } from '@react-navigation/native';
import client from '../actions/client';
import { register } from '../actions/auth';
import { CustomText } from '../components/text';
import { connect } from 'react-redux';

const darkmode = true

const SignUpScreen = ({register}) => {

    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [email,setEmail] = useState('');
    const [passwordRepeat,setPasswordRepeat] = useState('');
    
    // const {height} = useWindowDimensions();

    const navigation = useNavigation();

    const onRegisterPressed = async () => {
        if (!firstName ) {
            Alert.alert('Please enter your first name')
            return
        } else if (!lastName) {
            Alert.alert('Please enter your last name')
            return
        } else if (!username ) {
            Alert.alert('Please enter your username')
            return
        } else if (!email ) {
            Alert.alert('Please enter your email')
            return
        } else if (!email.includes('@') || !email.includes('.')) {
            Alert.alert('Please enter a valid email')
            return
        } else if (!password || !passwordRepeat) {
            Alert.alert('Please enter your password')
            return
        } else if (password!=passwordRepeat) {
            Alert.alert('Passwords do not match')
            return
        } else if (password.length<8) {
            Alert.alert('Password needs to have at least 8 characters')
            return
        }
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };
        
        const body = { 
            first_name:firstName, 
            last_name:lastName, 
            username:username,
            email:email, 
            password:password, 
            re_password:passwordRepeat };
        
        try {
            const res = await client.post('/register', body, config);
            if (res.data.success) {
                register(true)
                Alert.alert('Your registration was successful! Please check your mail to activate your account.')
                navigation.navigate('SignIn')
            } else {
                register(false)
                Alert.alert('Something went wrong, please contact an admin.')
            }
        } catch(err) {
            register(false)
            Alert.alert('Something went wrong, please contact an admin.')
        }
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
                <View style={{alignItems:'center'}}>
                    <CustomInput placeholder='First Name' value={firstName} setValue={setFirstName}/>
                    <CustomInput placeholder='Last Name' value={lastName} setValue={setLastName}/>
                    <CustomInput placeholder='Username' value={username} setValue={setUsername}/>
                    <CustomInput placeholder='Email' value={email} setValue={setEmail} />
                    <CustomInput placeholder='Password' value={password} setValue={setPassword} secureTextEntry/>
                    <CustomInput placeholder='Repeat Password' value={passwordRepeat} setValue={setPasswordRepeat} secureTextEntry/>
                    
                    <CustomButton text='Register' onPress={onRegisterPressed}/>
                    
                    <Text style={styles.text}>By registering, you accept our <Text style={styles.link} onPress={onTermsOfUsePressed}>Terms of Use</Text> and <Text style={styles.link} onPress={onPricacyPolicyPressed}>Privacy Policy</Text></Text>
                    
                    <CustomButton text="Have an account? Sign in" onPress={onSignInPressed} type='TERTIARY'/>
                </View>
            </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        padding: 20,
        backgroundColor: darkmode ? "#000022" : "darkblue",
        flex:1,
        width:'100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#051C60',
        margin: 10,
    },
    text: {
        color: 'grey',
        // marginVertical: 10,
        padding:10
    },
    link: {
        color: '#206a43'
    }

})

export default connect(null, { register })(SignUpScreen)