import React from "react";
import { View, Text, StyleSheet, Pressable,TouchableOpacity } from "react-native";
import { useFonts } from 'expo-font';
import { CustomText } from "./text";

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

const CloseButton = ({onPress}) => {
    
    return (
        <TouchableOpacity style={{width:30,height:30, backgroundColor:'white',borderRadius:50, alignItems:'center',justifyContent:'center'}} onPress={onPress}>
            <CustomText fontWeight='bold' fontSize={24}>X</CustomText>
        </TouchableOpacity>
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
export {CloseButton}