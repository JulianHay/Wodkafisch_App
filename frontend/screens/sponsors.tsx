import { useEffect, useState } from 'react';
import {View, ScrollView, RefreshControl, StyleSheet, Image, Linking, TouchableOpacity} from 'react-native';
import Battlepass from '../components/progress';
import { CustomText } from '../components/text';
import { LinearGradient } from 'expo-linear-gradient';
//import LinearGradient from 'react-native-web-linear-gradient';
import CustomButton from '../components/custom_botton';
import client from '../actions/client';
import moment from 'moment'
import FischLoading from '../components/loading';
import { Container, CustomContainer } from '../components/custom_container';

const darkmode = true

const SponsorScreen = () => {
    const [seasonData,setSeasonData] = useState([])
    const [seasonItemData,setSeasonItemData] = useState([])
    const [sponsorData,setSponsorData] = useState([])
    const [sponsorUserData,setUserSponsorData] = useState([])
    const [donationData,setDonationData] = useState([])
    const [promoData,setPromoData] = useState([])
    const [loading, setLoading] = useState(true)
    const onRefresh = () => {
        setLoading(true)
        client.get('/sponsor').then((res) => {
            setSponsorData(res.data.sponsor)
            setSeasonData(res.data.season)
            setSeasonItemData(res.data.season_items)
            setUserSponsorData(res.data.sponsor_user)
            setDonationData(res.data.donations)
            setPromoData(res.data.promo) 
        })
        .finally(() => setLoading(false))
    }

    useEffect(()=>{
        onRefresh()
    },[]) 

    const promoDate = !loading ? moment(promoData[0].date.split(' ')[0]) : moment()
    const isPromo = promoDate>= moment()
    
    const renderSponsors = (item) => (
        <View key={item.username} style={{flexDirection: 'row', marginBottom:3,left:-15}}>
            <View style={{width:125,alignItems:'flex-end', marginRight:10}}>
                <CustomText fontSize={16} style={{left:0}}>{item.username}:</CustomText>
            </View>
            <View style={styles.badgeImageContainer}>
                {item.diamond_sponsor!==0 ? 
                <View style={{flexDirection:'row'}}>
                    <Image source={require('../assets/diamond_badge.png')} style={styles.badgeImage}/>                
                    <View style={{justifyContent:'flex-end',marginBottom:-2,marginLeft:-2}}>
                        <CustomText fontSize={8}>{item.diamond_sponsor > 1 ? item.diamond_sponsor : ''}</CustomText>
                    </View>
                </View> : null}
            </View>
            <View style={styles.badgeImageContainer}>
                {item.black_sponsor!==0 ? 
                <View style={{flexDirection:'row'}}>
                    <Image source={require('../assets/black_badge.png')} style={styles.badgeImage}/>                
                    <View style={{justifyContent:'flex-end',marginBottom:-2,marginLeft:-2}}>
                        <CustomText fontSize={8}>{item.black_sponsor > 1 ? item.black_sponsor : ''}</CustomText>
                    </View>
                </View> : null}
            </View>
            <View style={styles.badgeImageContainer}>
                {item.gold_sponsor!==0 ?
                <View style={{flexDirection:'row'}}>
                    <Image source={require('../assets/gold_badge.png')} style={styles.badgeImage}/>                
                    <View style={{justifyContent:'flex-end',marginBottom:-2,marginLeft:-2}}>
                        <CustomText fontSize={8}>{item.gold_sponsor > 1 ? item.gold_sponsor : ''}</CustomText>
                    </View>
                </View>
                : null}
            </View>
            <View style={styles.badgeImageContainer}>
                {item.silver_sponsor!==0 ? 
                <View style={{flexDirection:'row'}}>
                    <Image source={require('../assets/silver_badge.png')} style={styles.badgeImage}/>                
                    <View style={{justifyContent:'flex-end',marginBottom:-2,marginLeft:-2}}>
                        <CustomText fontSize={8}>{item.silver_sponsor > 1 ? item.silver_sponsor : ''}</CustomText>
                    </View>
                </View> : null}
            </View>
            <View style={styles.badgeImageContainer}>
                {item.bronze_sponsor!==0 ? 
                <View style={{flexDirection:'row'}}>
                    <Image source={require('../assets/bronze_badge.png')} style={styles.badgeImage}/>                
                    <View style={{justifyContent:'flex-end',marginBottom:-2,marginLeft:-2}}>
                        <CustomText fontSize={8}>{item.bronze_sponsor > 1 ? item.bronze_sponsor : ''}</CustomText>
                    </View>
                </View> : null}
            </View>
        </View>
        );

    const renderDonations = (item) => (
        <View key={item.date+item.value+item.username} style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',margin:5}}>
            <CustomText>{item.date.split(' ')[0]}:  {item.value} </CustomText>
            <Image source={require('../assets/fisch_flakes.png')} style={{width:15,height:15,top:-1}}/>
        </View>
    );

    return (
        !loading ?
        <View style={styles.container}> 
            <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh}/>}>
                <Container title='Battle Pass'>
                {/* <LinearGradient colors={['#007ae6', '#000ddd']} style={styles.battlepass}> */}
                    {/* Season */}
                    <LinearGradient colors={['#c59c34', '#9a690e']} style={styles.season}>
                        <View>
                            <CustomText fontSize={12} color={'#fff'} fontWeight={'bold'}>Season {seasonData[0].id}</CustomText>
                        </View>
                        <View style={{ alignItems:'flex-end'}}>
                            <CustomText fontSize={12} color={'#fff'} fontWeight={'bold'}>{seasonData[0].title}</CustomText>
                        </View>
                    </LinearGradient>
                    <View>
                        <Image source={require('../assets/flussbarsch.png')} style={styles.seasonImage}/>
                    </View>
                    {/* Progress Bar */}
                    <View style={styles.progressBar}>
                        <Battlepass itemData={seasonItemData} seasonData={seasonData} sponsorData={sponsorUserData}/>
                    </View>
                    {/* Promo */}
                    {isPromo ? <View style={{marginTop:25,marginBottom:-10,flexDirection:'row'}}>                            
                        <CustomText fontSize={12}>
                            Get {promoData[0].value*100}% more 
                        </CustomText>
                        <Image source={require('../assets/fisch_flakes.png')} 
                                    style={{width:12,height:12, marginLeft:3,marginRight:3,marginTop:1}}/>
                        <CustomText fontSize={12}>
                             for your donations until {promoDate.format('DD/MM/YYYY')}!
                        </CustomText>
                    </View> : null}
                    {/* Donation Button */}
                    <View style={{width:'45%',marginTop:20,marginBottom:5}}>
                        <CustomButton onPress={()=>{Linking.openURL('http://paypal.me/wodkafisch')}} text={'Donate now'} fgColor='white' bgColor='#000022' borderColor='#19203c'/> 
                        <TouchableOpacity onPress={()=>{Linking.openURL('http://paypal.me/wodkafisch')}} style={{top:-48,left:-13, marginBottom:-30}}>
                            <Image source={require('../assets/fisch_flakes.png')} style={{width:35,height:35}}/>
                        </TouchableOpacity>
                    </View>
                </Container>
                
                <Container title='Recent Donations'>
                        {donationData.slice(0,5).map((item)=>(
                            renderDonations(item)
                        ))}
                </Container>
                
                <Container title='Sponsor List'>
                            {sponsorData.map((item)=>(
                            renderSponsors(item)
                        ))}
                </Container>
            </ScrollView>
        </View> : <FischLoading/>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: darkmode ? "#000022" : "darkblue"
      },
      battlepass: {
        width: '80%',
        borderRadius: 20,
        borderWidth: 1,
        borderColor:'#111',
        boxShadow: '0 -1px 1px #c0bfbc inset',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    season: {
        width: '95%',
        height: 36,
        borderRadius: 10,
        border: '1px solid #fff',
        fontWeight: 'bold',
        margin: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    progressBar: {
        margin: 0,
    },
    seasonImage: {
        height: 80,
        width: 80,
        top: -78,
        resizeMode: 'contain',      
        marginBottom: -78
    },
    badgeImageContainer: {
        width:25,
        alignItems:'center',
        justifyContent:'flex-start',
        flexDirection: 'row'
    },
    badgeImage: {
        width: 15,
        height: 15,
        marginLeft: 2,
    }
})

export default SponsorScreen