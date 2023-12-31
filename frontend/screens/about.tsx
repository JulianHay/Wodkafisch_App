import {View, Text, StyleSheet,ScrollView} from 'react-native';
import { CustomText } from '../components/text';
const darkmode = true

const AboutScreen = () => {
    return (
        
        <View style={styles.screen}>
            <ScrollView >
                <CustomText fontSize={24} fontWeight='bold'>About the Wodkafisch</CustomText>
                <View style={styles.about}>
                    <View style={styles.title}>
                        <CustomText fontSize={20} fontWeight='bold'>Origin</CustomText>
                    </View>
                    <CustomText>Little is known about the origins of the Wodkafisch. According to one myth, a former colleague brought the Wodkafisch to the Institute of Mechanics B, perhaps already at that time as Chauvifisch.</CustomText>
                    <View style={styles.title}>
                        <CustomText fontSize={20} fontWeight='bold'>Resurrection</CustomText>
                    </View>
                    <CustomText>The Wodkafisch, but also the general development of society, has helped over time to create awareness of the issues of equality and respectful treatment and to punish discriminatory behavior. This has resulted in a positive development at the Institute in terms of the occurrence of chauvinism.</CustomText>
                    <View style={styles.title}>
                        <CustomText fontSize={20} fontWeight='bold'>Present Activities</CustomText>
                    </View>
                    <CustomText>Today, the Wodkafisch is committed to charitable causes and organizes events that promote intercultural exchange and the advancement of talented researchers.</CustomText>
                </View> 
            </ScrollView>
        </View>
        
    )
}

const styles = StyleSheet.create({
    screen: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: darkmode ? "#000022" : "darkblue",
        flex:1
    },
    about: {
        width: '80%',
        margin: 20,
        alignItems: 'flex-start'
    },
    title: {
        marginBottom: 5,
        marginTop: 15
    },
})

export default AboutScreen