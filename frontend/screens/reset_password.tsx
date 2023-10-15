import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import CustomInput from "../components/custom_input";
import { useState } from 'react';
import CustomButton from '../components/custom_botton';
import { useNavigation } from '@react-navigation/native';
import client from '../actions/client';
import { CustomText } from '../components/text';

const ResetPasswordScreen = () => {
    const [email,setEmail] = useState('');

    const navigation = useNavigation();

    const onResetPasswordPressed = async() => {
        
        if (!email) {
            Alert.alert('please enter your email')
            return
          }
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };
        try {
            const res = await client.post('/password_reset/',JSON.stringify({email}),config);
            if (res.data.status) {
                navigation.navigate('SubmitResetPasswordCode')
            }
        } catch (err) {
            Alert.alert('Please enter a valid email')
        }
    }

    const onSignInPressed = () => {
        navigation.navigate('SignIn')
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.screen}>            
                <CustomText fontSize={24} fontWeight='bold'>Reset Password</CustomText>
                <View style={{width:'60%',marginTop:10,alignItems:'center'}}>
                    <CustomInput placeholder='Email' value={email} setValue={setEmail}/>
                    <CustomButton text='Reset Password' onPress={onResetPasswordPressed}/>
                </View>
                <CustomButton text="Have an account? Sign in" onPress={onSignInPressed} type='TERTIARY'/>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        padding: 20,
        alignItems:'center'
    },
})

export default ResetPasswordScreen