import {View, Text, StyleSheet, useWindowDimensions} from 'react-native';
import CustomInput from "../components/custom_input";
import { useState } from 'react';
import CustomButton from '../components/costum_botton';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { login } from '../actions/auth';
import { connect } from 'react-redux';

const SignInScreen = ({login}) => {

    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');

    const navigation = useNavigation();

    const {height} = useWindowDimensions();

    const onSignInPressed = () => {
        login(username,password);
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

