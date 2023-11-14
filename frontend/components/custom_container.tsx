import { LinearGradient } from "expo-linear-gradient";
import React, { Children } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export const CustomBox = (props) => {
    const { onPress,width,bgColor,borderColor,borderRadius,borderWidth,colors,children } = props;

    return (
        <TouchableOpacity 
        onPress={onPress} 
        style={[
            styles.box,
            width ? {width: Dimensions.get('window').width*width} : {},
            bgColor ? {backgroundColor: bgColor} : {},
            borderColor ? {borderColor: borderColor} : {},
            borderRadius ? {borderRadius: borderRadius} : {},
            borderWidth ? {borderWidth: borderWidth} : {},
            colors ? {padding:0} : {}
            ]}>
            {colors ? <LinearGradient colors={colors} 
            style={{borderRadius:7,width:'100%',padding:10,justifyContent:'center',alignItems:'center'}}>{children}</LinearGradient> : children}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    box: {
        margin:10,
        padding:10,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: 'darkblue',
        width: Dimensions.get('window').width*0.8,
        justifyContent:'center', 
        alignItems:'center',
    },
})
