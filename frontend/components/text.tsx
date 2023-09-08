import { Text, StyleSheet } from "react-native";
import { useFonts } from 'expo-font';

export const CustomText = (props) => {
    const { fontSize, color, fontWeight, children } = props;

    const [loaded] = useFonts({
        ArialRounded: require('../assets/fonts/Arial-Rounded.ttf'),
        ArialRoundedBold: require('../assets/fonts/Arial-RoundedBold.ttf'),
    });
    
    if (!loaded) {
        return null;
    }

    return (
        <Text 
            style={[
            styles.text,
            fontSize ? {fontSize: fontSize} : {fontSize: 18},
            color ? {color: color} : {},
            fontWeight==='bold' ? {fontFamily: 'ArialRoundedBold'} : {fontFamily: 'ArialRounded'}
            ]}>
            {children}
        </Text>
    )
}

const styles = StyleSheet.create({
    text: {
        
    },
})