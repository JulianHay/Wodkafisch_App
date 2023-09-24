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
            <View style={{width:110,alignItems:'flex-end', marginRight:20}}>
                <CustomText fontSize={12} style={{left:0}}>{item.username}:</CustomText>
            </View>
            <View style={styles.badgeImageContainer}>
                {item.diamond_sponsor!==0 ? 
                <>
                <CustomText fontSize={12}>{item.diamond_sponsor}</CustomText>
                <Image source={require('../assets/diamond_badge.png')} style={styles.badgeImage}/>
                </> : null}
            </View>
            <View style={styles.badgeImageContainer}>
                {item.black_sponsor!==0 ? 
                <>
                <CustomText fontSize={12}>{item.black_sponsor}</CustomText>
                <Image source={require('../assets/black_badge.png')} style={styles.badgeImage}/>
                </> : null}
            </View>
            <View style={styles.badgeImageContainer}>
                {item.gold_sponsor!==0 ? 
                <>
                <CustomText fontSize={12}>{item.gold_sponsor}</CustomText>
                <Image source={require('../assets/gold_badge.png')} style={styles.badgeImage}/>
                </> : null}
            </View>
            <View style={styles.badgeImageContainer}>
                {item.silver_sponsor!==0 ? 
                <>
                <CustomText fontSize={12}>{item.silver_sponsor}</CustomText>
                <Image source={require('../assets/silver_badge.png')} style={styles.badgeImage}/>
                </> : null}
            </View>
            <View style={styles.badgeImageContainer}>
                {item.bronze_sponsor!==0 ? 
                <>
                <CustomText fontSize={12}>{item.bronze_sponsor}</CustomText>
                <Image source={require('../assets/bronze_badge.png')} style={styles.badgeImage}/>
                </> : null}
            </View>
        </View>
        );

    const renderDonations = (item) => (
        <View key={item.date} style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',margin:5}}>
            <CustomText>{item.date.split(' ')[0]}:  {item.value} </CustomText>
            <Image source={require('../assets/fisch_flakes.png')} style={{width:15,height:15,top:-1}}/>
        </View>
    );

    return (
        !loading ?
        <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh}/>}>
            <View style={styles.container}>
                <LinearGradient colors={['#007ae6', '#000ddd']} style={styles.battlepass}>
                    {/* Season */}
                    <LinearGradient colors={['#E0AA3E', '#845800']} style={styles.season}>
                        <View>
                            <CustomText fontSize={14} color={'#fff'} fontWeight={'bold'}>Season {seasonData[0].id}</CustomText>
                        </View>
                        <View style={{ alignItems:'flex-end'}}>
                            <CustomText fontSize={14} color={'#fff'} fontWeight={'bold'}>{seasonData[0].title}</CustomText>
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
                    {isPromo ? <View>                            <CustomText fontSize={10} color='white'>
                            Until {promoDate.format('DD/MM/YYYY')} you will get {promoData[0].value*100}% more Fischflocken!
                        </CustomText>
                    </View> : null}
                    {/* Donation Button */}
                    <View style={{width:'35%',marginTop:20,marginBottom:5}}>
                        <CustomButton onPress={()=>{Linking.openURL('http://paypal.me/wodkafisch')}} text={'Donate now'} bgColor={'darkblue'}/> 
                        <TouchableOpacity onPress={()=>{Linking.openURL('http://paypal.me/wodkafisch')}} style={{top:-45,left:-13, marginBottom:-30}}>
                            <Image source={require('../assets/fisch_flakes.png')} style={{width:35,height:35}}/>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
                
                <View style={{marginTop:40,alignItems:'center'}}>
                    <View style={{width:'100%',alignItems:'flex-start'}}>
                        <CustomText fontWeight='bold'> Recent Donations</CustomText>
                        {donationData.slice(0,5).map((item)=>(
                            renderDonations(item)
                        ))}
                    </View>
                        
                    <View style={{alignItems:'center',justifyContent:'center',marginTop:40,marginBottom:40}}>
                        <View style={{marginBottom:10}}>
                            <CustomText fontWeight='bold'> Sponsor List</CustomText>
                        </View>
                        {sponsorData.map((item)=>(
                            renderSponsors(item)
                        ))}
                    </View> 
                </View>
            </View>
        </ScrollView> : <FischLoading/>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
      },
      battlepass: {
        width: '90%',
        borderRadius: 20,
        borderWidth: 1,
        borderColor:'#111',
        boxShadow: '0 -1px 1px #c0bfbc inset',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    season: {
        width: '90%',
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
        width: 90,
        top: -78,
        resizeMode: 'contain',      
        marginBottom: -78
    },
    badgeImageContainer: {
        width:33,
        alignItems:'center',
        justifyContent:'center',
        flexDirection: 'row'
    },
    badgeImage: {
        width: 15,
        height: 15,
        marginLeft: 2,
    }
})

export default SponsorScreen