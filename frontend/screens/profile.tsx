import {View, StyleSheet} from 'react-native';
import { useEffect, useState } from 'react';
import FischLoading from '../components/loading';
import client from '../actions/client';
import { CustomText } from '../components/text';
import CustomButton from '../components/custom_botton';
import { useNavigation } from '@react-navigation/native';

const darkmode = true

const ProfileScreen = () => {

    const [profileData,setProfileData] = useState([])
    const [loading, setLoading] = useState(true)
    const navigation = useNavigation()
    useEffect(()=>{
        client.get('/sponsor_user_data/').then((res) => setProfileData(res.data))
        .finally(() => setLoading(false))
    },[])

    const onChangePasswordPressed = () => {
        navigation.navigate('ChangePassword') 
    }
    return (
        loading ? <FischLoading/> :
        <View style={styles.screen}>
            <CustomText fontWeight='bold' fontSize={24}>Profile</CustomText>
            <View style={{width:'100%',alignItems:'center',margin:20}}>
                
                <CustomText>{profileData[0].first_name} {profileData[0].last_name}</CustomText>
                {/* <CustomText>{profileData[0].email}</CustomText> */}
            </View>
            <View style={{width:'50%'}}>
                <CustomButton text='Change Password' onPress={onChangePasswordPressed}/>
            </View>
            </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        padding: 20,
        alignItems:'center',
        backgroundColor: darkmode ? "#000022" : "darkblue",
        flex:1
    }
})

export default ProfileScreen