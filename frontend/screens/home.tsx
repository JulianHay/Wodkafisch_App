import { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Image, SafeAreaView, FlatList, Touchable} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import * as Progress from 'react-native-progress';
import client from '../actions/client';
import { CustomBox } from '../components/costum_container';
import moment from 'moment';

const HomeScreen = ({navigation}) => {
    const [eventData,setEventData] = useState([])
    const [pictureData,setPictureData] = useState([])
    const [sponsorData,setSponsorData] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(()=>{

        client.get('/latest_event').then((res) => setEventData(res.data))
        .then(() => client.get('/sponsor_user_data').then((res) => setSponsorData(res.data)))
        .then(() => client.get('/latest_picture').then((res) => setPictureData(res.data)))
        .finally(() => setLoading(false))
    },[])  
    
    const eventDate = loading ? '' : moment(eventData[0].start,'YYYY-MM-DD').format('DD.MM.YYYY')

    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView>
                    
                {loading ? <Text>Loading..</Text>:(
                    <View style={styles.container}>   

                        <CustomBox onPress= {() => navigation.navigate('Map')} >
                            <Text style={{fontWeight:'bold'}}>Upcoming Fisch Event</Text>
                            <Image source={{uri:eventData[0].image}} style={{ width: 300, height: 100, resizeMode: 'contain', margin: 5}}/>
                            <Text>{eventData[0].title}</Text>
                            <Text>{eventDate}</Text>
                        </CustomBox>

                        <CustomBox onPress= {() => navigation.navigate('Sponsors')} >
                            <Image source={
                                sponsorData[0].diamond_sponsor>0 ? require('../assets/diamond_badge.png') : 
                                sponsorData[0].black_sponsor>0 ? require('../assets/black_badge.png'):
                                sponsorData[0].gold_sponsor>0 ? require('../assets/gold_badge.png') :
                                sponsorData[0].silver_sponsor>0 ? require('../assets/silver_badge.png') :
                                sponsorData[0].bronze_sponsor>0 ? require('../assets/bronze_badge.png') :
                                null
                                } style={{ width: '100%', height: 60, resizeMode: 'contain' }} />
                            <Text> hi {sponsorData[0].first_name}!</Text> 
                            <Progress.Bar progress={0.3} width={300} height={10} animationType='timing'/>
                            <Text>xx Fischflocken left to unlock the next item</Text>
                        </CustomBox>

                        <CustomBox onPress= {() => navigation.navigate('Pictures')} >
                        <Text style={{fontWeight:'bold'}}>Fisch picture of the day</Text>
                            <Image source={{uri:pictureData[0].image}} style={{ width: 300, height: 140, resizeMode: 'cover', overflow: 'hidden', borderRadius: 10, margin: 5}}/>
                            <Text>{pictureData[0].description}</Text>    
                        </CustomBox>
                                {/* <FlatList
                                    data={eventData}
                                    keyExtractor={item=>item.id}
                                    renderItem={({item}) => {
                                        return (
                                        <TouchableOpacity>
                                            <Text>{item.title}</Text>
                                            <Text>{item.date}</Text>
                                        </TouchableOpacity>
                                        )
                                    }}
                                /> */}
                        <CustomBox onPress= {() => navigation.navigate('Home')} >
                            <Image source={require('../assets/fisch.png')} style={{ width: '100%', height: 180, resizeMode: 'contain' }}  />
                        </CustomBox>
                    </View>
                )}
                
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        padding: 20,
        flex: 1,
    },
    container: {
        flex: 1,
        flexDirection:'column', 
        justifyContent:'center', 
        alignItems:'center',
    },
    item: {
        margin:10,
        padding:10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
        width: 350,
        height: 200,
        justifyContent:'center', 
        alignItems:'center',
    },
})

export default HomeScreen