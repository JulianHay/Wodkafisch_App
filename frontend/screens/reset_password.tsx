import {View, Text, StyleSheet, useWindowDimensions} from 'react-native';
import CustomInput from "../components/custom_input";
import { useState } from 'react';
import CustomButton from '../components/costum_botton';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const ResetPasswordScreen = () => {

    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [email,setEmail] = useState('');
    const [passwordRepeat,setPasswordRepeat] = useState('');
    
    const {height} = useWindowDimensions();

    const navigation = useNavigation();

    const onResetPasswordPressed = () => {
        console.warn('ResetPassword');
    }

    const onSignInPressed = () => {
        navigation.navigate('SignIn')
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.screen}>            
                <Text style={styles.title}>Reset Password</Text>
                <CustomInput placeholder='Username' value={username} setValue={setUsername}/>
                <CustomButton text='Reset Password' onPress={onResetPasswordPressed}/>
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

export default ResetPasswordScreen