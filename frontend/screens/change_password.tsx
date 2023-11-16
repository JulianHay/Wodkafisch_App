import {View, StyleSheet, Alert, ScrollView} from 'react-native';
import CustomInput from "../components/custom_input";
import { useState } from 'react';
import CustomButton, { CloseButton } from '../components/custom_botton';
import { useNavigation } from '@react-navigation/native';
import client from '../actions/client';
import { CustomText } from '../components/text';

const darkmode = true

const ChangePasswordScreen = () => {

    const [oldPassword,setOldPassword] = useState('');
    const [newPassword,setNewPassword] = useState('');
    const [newPasswordRepeat,setNewPasswordRepeat] = useState('');
    const navigation = useNavigation();

    const onSubmitPressed = async() => {
        
        if (!newPassword || !newPasswordRepeat || !oldPassword) {
            Alert.alert('Please enter a password')
            return
        } else if (newPassword!=newPasswordRepeat) {
            Alert.alert('Passwords do not match')
            return
        } else if (newPassword.length<8) {
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
            const res = await client.post('/password_change',JSON.stringify({"old_password":oldPassword,"new_password":newPassword}),config);
            if (res.data.success) {
                console.log(res)
                Alert.alert('Password change successful!')
                navigation.navigate('HomeScreen')
            }
        } catch (err) {
            Alert.alert(err.response.data['error'])
        }
    }

    return (
        <View style={styles.screen}> 
                <View style={{alignItems:'flex-end',width:'100%',paddingRight:20}}>                           
                    <CloseButton onPress={()=>{{navigation.navigate('Profile')}}}/>
                </View>
                <CustomText fontSize={24} fontWeight='bold'>Change Password</CustomText>                         
                <View style={{width:'80%', margin:10}}> 
                    <CustomText>Please enter your old and new password:</CustomText>
                    <CustomInput placeholder='Old Password' value={oldPassword} setValue={setOldPassword}/>
                    <CustomInput placeholder='New Password' value={newPassword} setValue={setNewPassword}/>
                    <CustomInput placeholder='New Password Repeat' value={newPasswordRepeat} setValue={setNewPasswordRepeat}/>
                </View>
                <View style={{width:'40%'}}>
                    <CustomButton text='Submit' onPress={onSubmitPressed}/>
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        paddingTop:20,
        alignItems:'center',
        backgroundColor: darkmode ? "#000022" : "darkblue",
        flex:1,
        width:'100%'
    },
})

export default ChangePasswordScreen;