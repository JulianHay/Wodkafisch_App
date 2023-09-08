import { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Image, Linking, Dimensions, SafeAreaView, FlatList} from 'react-native';
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import Battlepass from '../components/progress';
import { CustomText } from '../components/text';
//import LinearGradient from 'react-native-linear-gradient';
import LinearGradient from 'react-native-web-linear-gradient';
import CustomButton from '../components/costum_botton';
import client from '../actions/client';
import moment from 'moment'

const SponsorScreen = () => {
    const [seasonData,setSeasonData] = useState([])
    const [seasonItemData,setSeasonItemData] = useState([])
    const [sponsorData,setSponsorData] = useState([])
    const [sponsorUserData,setUserSponsorData] = useState([])
    const [donationData,setDonationData] = useState([])
    const [promoData,setPromoData] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        client.get('/sponsors').then((res) => setSponsorData(res.data))
        .then(() => client.get('/sponsor_user_data').then((res) => setUserSponsorData(res.data)))
        .then(() => client.get('/season').then((res) => setSeasonData(res.data)))
        .then(() => client.get('/season_items').then((res) => setSeasonItemData(res.data)))
        .then(() => client.get('/donations').then((res) => setDonationData(res.data)))
        .then(() => client.get('/promo').then((res) => setPromoData(res.data)))
        .finally(() => setLoading(false))
    },[]) 

    const promoDate = !loading ? moment(promoData[0].date.split(' ')[0]) : moment()
    const isPromo = promoDate>= moment()

    const renderSponsors = ({ item }) => (
        <View style={{flexDirection: 'row',alignItems:'center',justifyContent:'center', marginBottom:3}}>
            <View style={{width:150,alignItems:'flex-end', marginRight:20}}>
                <CustomText style={{left:0}}>{item.username}:</CustomText>
            </View>
            <View style={styles.badgeImageContainer}>
                {item.diamond_sponsor!==0 ? 
                <>
                <CustomText>{item.diamond_sponsor} x </CustomText>
                <Image source={require('../assets/diamond_badge.png')} style={styles.badgeImage}/>
                </> : null}
            </View>
            <View style={styles.badgeImageContainer}>
                {item.black_sponsor!==0 ? 
                <>
                <CustomText>{item.black_sponsor} x </CustomText>
                <Image source={require('../assets/black_badge.png')} style={styles.badgeImage}/>
                </> : null}
            </View>
            <View style={styles.badgeImageContainer}>
                {item.gold_sponsor!==0 ? 
                <>
                <CustomText>{item.gold_sponsor} x </CustomText>
                <Image source={require('../assets/gold_badge.png')} style={styles.badgeImage}/>
                </> : null}
            </View>
            <View style={styles.badgeImageContainer}>
                {item.silver_sponsor!==0 ? 
                <>
                <CustomText>{item.silver_sponsor} x </CustomText>
                <Image source={require('../assets/silver_badge.png')} style={styles.badgeImage}/>
                </> : null}
            </View>
            <View style={styles.badgeImageContainer}>
                {item.bronze_sponsor!==0 ? 
                <>
                <CustomText>{item.bronze_sponsor} x </CustomText>
                <Image source={require('../assets/bronze_badge.png')} style={styles.badgeImage}/>
                </> : null}
            </View>
        </View>
        );

    const renderDonations = ({ item }) => (
        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',margin:5}}>
            <CustomText>{item.date.split(' ')[0]}:  {item.value} </CustomText>
            <Image source={require('../assets/fisch_flakes.png')} style={{width:15,height:15,top:-1}}/>
        </View>
    );

    return (
        <View style={{flex:1}}>
            <ScrollView>
                {!loading ?
                <View style={styles.container}>
                    <LinearGradient colors={['#007ae6', '#000ddd']} style={styles.battlepass}>
                        {/* Season */}
                        <LinearGradient colors={['#E0AA3E', '#845800']} style={styles.season}>
                            <View style={{flex:1}}>
                                <CustomText fontSize={24} color={'#fff'} fontWeight={'bold'}>Season 1</CustomText>
                            </View>
                            <View style={{flex:1}}>
                                <Image source={require('../assets/flussbarsch.png')} style={styles.seasonImage}/>
                            </View>
                            <View style={{flex:1, alignItems:'flex-end'}}>
                                <CustomText fontSize={24} color={'#fff'} fontWeight={'bold'}>Flussbarsch</CustomText>
                            </View>
                        </LinearGradient>
                        {/* Progress Bar */}
                        <View style={styles.progressBar}>
                            <Battlepass itemData={seasonItemData} seasonData={seasonData} sponsorData={sponsorUserData}/>
                        </View>
                        {/* Promo */}
                        {isPromo ? <View>
                            <CustomText color='white'>
                                Until {promoDate.format('DD/MM/YYYY')} you will get {promoData[0].value*100}% more Fischflocken!
                            </CustomText>
                        </View> : null}
                        {/* Donation Button */}
                        <View style={{width:'16%',margin:20}}>
                            <CustomButton onPress={()=>{Linking.openURL('http://paypal.me/wodkafisch')}} text={'Donate now'} bgColor={'darkblue'}/> 
                            <TouchableOpacity onPress={()=>{Linking.openURL('http://paypal.me/wodkafisch')}} style={{top:-47,left:-3, marginBottom:-30}}>
                                <Image source={require('../assets/fisch_flakes.png')} style={{width:40,height:40}}/>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                    
                    <View style={{flexDirection:'row',marginTop:40,width:'100%'}}>
                        <View style={{width:'80%',alignItems:'center',justifyContent:'center'}}>
                            <CustomText fontWeight='bold'> Sponsor List</CustomText>
                            <FlatList
                            data={sponsorData}
                            keyExtractor={item => item.id}
                            renderItem={renderSponsors}
                            numColumns={1}
                            showsVerticalScrollIndicator={false}
                            style={{margin:10}}/>
                        </View>

                        <View style={{width:'20%',alignItems:'flex-start',justifyContent:'center'}}>
                            <CustomText fontWeight='bold'> Recent Donations</CustomText>
                            <FlatList
                                data={donationData.slice(0,5)}
                                keyExtractor={item => item.id}
                                renderItem={renderDonations}
                                numColumns={1}
                                showsVerticalScrollIndicator={false}
                                style={{margin:10}}/>
                        </View>
                    </View>

                </View> : <Text>Loading..</Text>
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
      battlepass: {
        width: '80%',
        borderRadius: 20,
        borderWidth: 1,
        borderColor:'#111',
        boxShadow: '0 -1px 1px #c0bfbc inset',
        justifyContent: 'center',
        alignItems: 'center',
    },
    season: {
        width: '90%',
        height: '65px',
        borderRadius: 20,
        border: '1px solid #fff',
        fontWeight: 'bold',
        margin: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 16,
    },
    progressBar: {
        margin: 50,
    },
    seasonImage: {
        height: '65px',
        width: '100%',
        resizeMode: 'contain',
        margin: 5, 
    },
    badgeImageContainer: {
        width:70,
        alignItems:'center',
        justifyContent:'center',
        flexDirection: 'row'
    },
    badgeImage: {
        width: 25,
        height: 25
    }
})

export default SponsorScreen