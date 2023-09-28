import {View, Text, StyleSheet, useWindowDimensions, Alert} from 'react-native';
import CustomInput from "../components/custom_input";
import { useState } from 'react';
import CustomButton, { CloseButton } from '../components/custom_botton';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { login } from '../actions/auth';
import { connect } from 'react-redux';
import client from '../actions/client';
import FischGame from '../components/game/game';
import Modal from 'react-native-modal'

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
    
    const [isVisible,setIsVisible] = useState(false)  

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
            {/* <CustomButton onPress={()=>{setIsVisible(true)}}/>
            <Modal isVisible={isVisible}
            >
                <View style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                    <View style={{position:'absolute',top:'2%',left:'3%',zIndex:1,transform:[{rotate:'90deg'}]}}>
                        <CloseButton onPress={()=>{setIsVisible(false)}}/>
                    </View>
                    <FischGame/>
                </View>
            </Modal> */}
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

