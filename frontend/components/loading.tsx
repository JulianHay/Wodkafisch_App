import React, {useEffect,useRef} from "react";
import { View, StyleSheet, Image, Animated, Easing } from "react-native";
const darkmode = true
const FischLoading = () =>{
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
        Animated.timing(spinValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        })
        ).start();
    }, []);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <Animated.View style={{transform:[{ rotate: spin }]}}>
                <Image
                    source={require('../assets/fisch.png')}
                    style={{width:30,height:30,marginBottom:20}}
                />
                <Image
                    source={require('../assets/fisch.png')}
                    style={{width:30,height:30,transform:[{ rotate: '180deg' }]}}
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: darkmode ? "#000022" : "darkblue"
    },
    image: {
        width: 20,
        height: 20,
    }
})

export default FischLoading