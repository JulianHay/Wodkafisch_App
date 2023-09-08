import {View, Text, StyleSheet} from 'react-native';
import axios from 'axios';
import { useEffect, useState } from 'react';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
  });


const ProfileScreen = () => {

    const [sponsorData,setSponsorData] = useState([])
    useEffect(()=>{
        fetchData();
    },[])  
    const fetchData = async () => {
        const response = await client.get('app/latest_event/',
            {'withCredentials': true });
        console.log(response)
        setSponsorData(response.data);
        console.log(sponsorData);
        console.log(response.data);
    }


    return (
        <View style={styles.screen}>
            <Text>profile</Text>
            <Text></Text>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        padding: 20,
    }
})

export default ProfileScreen