import {View, Text, StyleSheet} from 'react-native';

const AboutScreen = () => {
    return (
        <View style={styles.screen}>
            <Text>about</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        padding: 20,
    }
})

export default AboutScreen