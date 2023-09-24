import {View, Text, StyleSheet, useWindowDimensions, Alert} from 'react-native';
import CustomInput from "../components/custom_input";
import { useState } from 'react';
import CustomButton, { CloseButton } from '../components/custom_botton';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import client from '../actions/client';
import { CustomText } from '../components/text';
import { passwordReset } from '../actions/auth';
import { connect } from 'react-redux';

const SubmitResetPasswordScreen = ({code}) => {
    const [password,setPassword] = useState('');
    const [passwordRepeat,setPasswordRepeat] = useState('');
    const navigation = useNavigation();
    const onSubmitPasswordPressed = async() => {
        
        if (!password || !passwordRepeat) {
            Alert.alert('please enter a password')
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
        try {
            const res = await client.post('/password_reset/confirm/',JSON.stringify({"token":code,"password":password}),config);
            if (res.data.status) {
                Alert.alert('Password Change Successful!')
                passwordReset()
                navigation.navigate('SignIn')
            }
        } catch (err) {
            Alert.alert('An error occured while resetting your password. Possibly your password is too similar to your username')
        }
    }
    
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.screen}>
                <View style={{position:'absolute',right:'8%',top:'8%'}}>                           
                    <CloseButton onPress={()=>{{navigation.navigate('SignIn')}}}/>
                </View>
                <CustomText fontSize={24} fontWeight='bold'>Reset Password</CustomText>                         
                
                <View style={{width:'80%', margin:10}}> 
                    <CustomText>Please enter your new password:</CustomText>
                    <CustomInput placeholder='Password' value={password} setValue={setPassword}/>
                    <CustomInput placeholder='Repeat Password' value={passwordRepeat} setValue={setPasswordRepeat}/>
                </View>
                <View style={{width:'40%'}}>
                    <CustomButton text='Submit' onPress={onSubmitPasswordPressed}/>
                </View>
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

const mapStateToProps = state => ({
    code: state.auth.passwordResetToken
});

export default connect(mapStateToProps, {passwordReset})(SubmitResetPasswordScreen);