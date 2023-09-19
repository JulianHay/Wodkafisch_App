import {View, Text, StyleSheet, useWindowDimensions, Linking} from 'react-native';
import CustomInput from "../components/custom_input";
import { useState } from 'react';
import CustomButton from '../components/custom_botton';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const SignUpScreen = () => {

    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [email,setEmail] = useState('');
    const [passwordRepeat,setPasswordRepeat] = useState('');
    
    const {height} = useWindowDimensions();

    const navigation = useNavigation();

    const onRegisterPressed = () => {
        console.warn('Register');
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
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.screen}>            
                <Text style={styles.title}>Sign Up</Text>
                <CustomInput placeholder='Username' value={username} setValue={setUsername}/>
                <CustomInput placeholder='Email' value={email} setValue={setEmail} />
                <CustomInput placeholder='Password' value={password} setValue={setPassword} secureTextEntry/>
                <CustomInput placeholder='Repeat Password' value={passwordRepeat} setValue={setPasswordRepeat} secureTextEntry/>
                
                <CustomButton text='Register' onPress={onRegisterPressed}/>
                
                <Text style={styles.text}> By registering, you accept our <Text style={styles.link} onPress={onTermsOfUsePressed}>Terms of Use</Text> and <Text style={styles.link} onPress={onPricacyPolicyPressed}>Privacy Policy</Text></Text>
                
                <CustomButton text="Have an account? Sign in" onPress={onSignInPressed} type='TERTIARY'/>
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
    },
    text: {
        color: 'grey',
        marginVertical: 10,
    },
    link: {
        color: '#FDB075'
    }

})

export default SignUpScreen