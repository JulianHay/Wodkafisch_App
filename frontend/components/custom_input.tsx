import React from "react";
import {View,TextInput,StyleSheet} from "react-native"

const CustomInput = ({value, setValue, placeholder,secureTextEntry=false}) => {
    return (
        <View style={styles.container}>
            <TextInput 
            style={styles.input}
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            placeholderTextColor="grey"
            secureTextEntry={secureTextEntry}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'white',
        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 5,
    },
    input: {

    },
})

export default CustomInput