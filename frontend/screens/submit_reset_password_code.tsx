import {View, StyleSheet, Alert} from 'react-native';
import CustomInput from "../components/custom_input";
import { useState } from 'react';
import CustomButton, { CloseButton } from '../components/custom_botton';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import client from '../actions/client';
import { CustomText } from '../components/text';
import { setPasswordResetToken } from '../actions/auth';
import { connect } from 'react-redux';

const SubmitResetPasswordCodeScreen = ({setPasswordResetToken}) => {

    const [code,setCode] = useState('');
    const navigation = useNavigation();

    const onSubmitCodePressed = async() => {
        
        if (!code) {
            Alert.alert('please enter the code')
            return
          }
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };
        try {
            const res = await client.post('/password_reset/validate_token/',JSON.stringify({"token":code}),config);
            if (res.data.status) {
                setPasswordResetToken(code)
                navigation.navigate('SubmitResetPassword')
            }
        } catch (err) {
            Alert.alert('Please enter a valid code')
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
                    <CustomText>Please check your mail and enter the code below:</CustomText>
                    <CustomInput placeholder='Code' value={code} setValue={setCode}/>
                </View>
                <View style={{width:'40%'}}>
                    <CustomButton text='Submit' onPress={onSubmitCodePressed}/>
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

export default connect(null, { setPasswordResetToken })(SubmitResetPasswordCodeScreen);