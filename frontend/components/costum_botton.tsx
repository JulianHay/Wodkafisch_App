import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useFonts } from 'expo-font';

const CustomButton = ({onPress, text, type='PRIMARY',bgColor,fgColor}) =>{
    const [loaded] = useFonts({
        ArialRounded: require('../assets/fonts/Arial-Rounded.ttf'),
        ArialRoundedBold: require('../assets/fonts/Arial-RoundedBold.ttf'),
    });
    
    if (!loaded) {
        return null;
    }

    return (
        <Pressable 
        onPress={onPress} 
        style={[
            styles.container,
            styles[`container_${type}`],
            bgColor ? {backgroundColor: bgColor} : {}
            ]}>
            <Text style={[
                styles.text, 
                styles[`text_${type}`],
                fgColor ? {color:fgColor} : {}
                ]}>
                    {text}
            </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 15,
        margin: 5,
        alignItems: 'center',
        borderRadius: 5,
    },

    container_PRIMARY: {
        backgroundColor: '#3B71F3',
    },
    container_TERTIARY: {

    },
    text: {
        color: 'white',
        fontFamily: 'ArialRoundedBold'
    },
    text_TERTIARY: {
        color: 'grey'
    }

})

export default CustomButton