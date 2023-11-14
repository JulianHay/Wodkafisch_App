import { useEffect, useState } from 'react';
import {View, StyleSheet, Image, SafeAreaView, ScrollView, RefreshControl, Dimensions, Animated, Modal} from 'react-native';
import client from '../actions/client';
import { CustomBox } from '../components/custom_container';
import moment from 'moment';
import FischLoading from '../components/loading';
import { CustomText } from '../components/text';
import { useFocusEffect } from '@react-navigation/native';
import { CloseButton } from '../components/custom_botton';
// import FischGame from '../components/game/game';
// import { CloseButton } from '../components/custom_botton';
// import { StatusBar } from 'expo-status-bar';

const HomeScreen = ({navigation}) => {
    const [eventData,setEventData] = useState([])
    const [pictureData,setPictureData] = useState([])
    const [sponsorData,setSponsorData] = useState([])
    const [seasonData,setSeasonData] = useState([])
    const [seasonItemData,setSeasonItemData] = useState([])
    const [loading, setLoading] = useState(true)
    const [isEventModalVisible, setEventModalVisible] = useState(false);
    // const [isGameModalVisible, setGameModalVisible] = useState(false);
    
    const [progress] = useState(new Animated.Value(0));
    const progressAnimation = loading ? null : Animated.timing(progress, {
        toValue: sponsorData[0].season_score/seasonData[0].max_donation * 250, 
        duration: 2000, 
        useNativeDriver: false, 
      })

    const onRefresh = () => {
        setLoading(true)
        client.get('/home').then((res) => {
            setEventData(res.data.upcoming_event)
            setPictureData(res.data.picture)
            setSponsorData(res.data.sponsor)
            setSeasonData(res.data.season)
            setSeasonItemData(res.data.season_items)
        })
        .finally(() => setLoading(false))
    }

    useEffect(()=>{
        onRefresh()
    },[])  

    useFocusEffect(() => {
        progress.setValue(0)
        loading ? null : progressAnimation.start();
      });
      
    const eventDate = loading ? '' : moment(eventData[0].start,'YYYY-MM-DD').format('DD.MM.YYYY')
    const itemUlockAmount = loading ? 0 : seasonItemData.find(item => item.price > sponsorData[0].season_score)
    return (
        loading ? <FischLoading/>:(
            <SafeAreaView style={styles.screen}>
                <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh}/>}>
                    <View style={styles.container}>
                        <CustomBox onPress= {() => setEventModalVisible(true)}  colors={['#007ae6', '#000ddd']} borderWidth={1}>
                            <CustomText fontWeight='bold' color='white'>Upcoming Fisch Event</CustomText>
                            {moment(eventData[0].start,'YYYY-MM-DD')>moment() ?
                            <>
                            <Image source={{uri:'https://wodkafis.ch/media/'+eventData[0].image}} style={{ width: 300, height: 100, resizeMode: 'contain', margin: 5}}/>
                            <CustomText fontSize={14} color='white'>{eventData[0].title}</CustomText>
                            <CustomText fontSize={14} color='white'>{eventDate}</CustomText>
                            </>
                            :
                            <>
                            <Image source={require('../assets/upcoming_event_fisch.png')} style={{ width: 300, height: 100, resizeMode: 'contain', margin: 5}}/>
                            <CustomText fontSize={14} color='white'>will be announced soon!</CustomText>
                            </>
                        
                        }
                        </CustomBox>

                        <Modal visible={isEventModalVisible}>
                            <CustomBox bgColor='darkblue'>
                                <CloseButton onPress={()=>{setEventModalVisible(false)}}/>
                                <CustomText>
                                    {eventData[0].hello}
                                </CustomText>
                                <CustomText>
                                    {eventData[0].message}
                                </CustomText>
                                <CustomText>
                                    {eventData[0].additional_text}
                                </CustomText>
                                <CustomText>
                                    {eventData[0].bye}
                                </CustomText>
                                <CustomText>
                                    Fisch
                                </CustomText>

                            </CustomBox>
                        </Modal>

                        <CustomBox onPress= {() => navigation.navigate('Sponsors')}  colors={['#007ae6', '#000ddd']} borderWidth={1}>
                            <CustomText fontWeight='bold' color='white'> hi {sponsorData[0].first_name}!</CustomText> 
                            <View style={{margin:5, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                                {sponsorData[0].diamond_sponsor>0 || 
                                sponsorData[0].black_sponsor>0 || 
                                sponsorData[0].gold_sponsor>0 ||
                                sponsorData[0].silver_sponsor>0 ||
                                sponsorData[0].bronze_sponsor>0 ? <CustomText color='white'>Level: </CustomText>:
                                null}
                                
                                <Image source={
                                    sponsorData[0].diamond_sponsor>0 ? require('../assets/diamond_badge.png') : 
                                    sponsorData[0].black_sponsor>0 ? require('../assets/black_badge.png'):
                                    sponsorData[0].gold_sponsor>0 ? require('../assets/gold_badge.png') :
                                    sponsorData[0].silver_sponsor>0 ? require('../assets/silver_badge.png') :
                                    sponsorData[0].bronze_sponsor>0 ? require('../assets/bronze_badge.png') :
                                    null
                                    } style={{ width: 30, height: 30, resizeMode: 'contain' }} />
                            </View>
                            
                            <View style={{width:250, height:10, borderRadius: 9, borderColor:'#008181ff', borderWidth:2, margin:5}}>
                                <Animated.View style={[{
                                    width: progress,
                                    height: '100%',
                                    backgroundColor: '#008181ff' 
                                },
                                ]}/>
                            </View>
                            <View style={{marginTop:5,alignItems:'center',flexDirection:'row'}}>
                                <CustomText fontSize={14} color='white'>Only {itemUlockAmount.price-sponsorData[0].season_score}</CustomText>
                                <Image source={require('../assets/fisch_flakes.png')} 
                                    style={{width:12,height:12, marginLeft:1.5}}/>
                                <CustomText fontSize={14} color='white'> left to unlock the next item!</CustomText>
                            </View>
                        </CustomBox>
                        
                        <CustomBox onPress= {() => navigation.navigate('Pictures',{id: pictureData[0].id})} colors={['#007ae6', '#000ddd']} borderWidth={1}>
                            <CustomText fontWeight='bold' color='white'>Fisch picture of the day</CustomText>
                            <Image source={{uri:'https://wodkafis.ch/'+pictureData[0].image}} style={{ width: Dimensions.get('window').width*0.7, height: Dimensions.get('window').width*0.35, resizeMode: 'cover', overflow: 'hidden', borderRadius: 10, margin: 5}}/>
                            <CustomText color='white'>{pictureData[0].description}</CustomText>    
                        </CustomBox>

                        {/* <CustomBox onPress= {() => setGameModalVisible(true)} >
                            <Image source={require('../assets/fisch.png')} style={{ width: '100%', height: 180, resizeMode: 'contain' }}  />
                        </CustomBox> */}
                    </View>
                </ScrollView>

                {/* <Modal isVisible={isGameModalVisible} 
                backdropOpacity={1}
                statusBarTranslucent={true}>
                    <View style={{position:'absolute',top:'2%',left:'3%',zIndex:1,transform:[{rotate:'90deg'}]}}>
                        <CloseButton onPress={()=>{setGameModalVisible(false)}}/>
                    </View>
                    <FischGame/>
                    <StatusBar style='dark' hidden={true} translucent/>
                </Modal> */}
            </SafeAreaView>
        )
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