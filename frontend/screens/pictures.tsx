import {View, Text, StyleSheet, Image, FlatList, Dimensions} from 'react-native';
import { useEffect, useState } from 'react';
import client from '../actions/client';
import { CustomText } from '../components/text';
import { FontAwesome } from '@expo/vector-icons';
import CustomButton from '../components/costum_botton';

const PictureScreen = () => {
    const [pictureData,setPictureData] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        client.get('/pictures').then((res) => setPictureData(res.data))
        .finally(() => setLoading(false))
    },[])  


    const renderItem = ({ item }) => (
        <View style={styles.imageContainer}>
            <Image source={item.image} style={styles.image}/>
            <View style={styles.imageDescription}>
                <View style={{width:'50%', alignItems:'flex-start',padding:10}}>
                    <CustomText color='white'>{item.date}</CustomText>
                    <CustomText color='white'>{item.description}  <FontAwesome name="map-marker" size={18} color="white" /> </CustomText>
                </View>
                <View style={{width:'50%', alignItems:'flex-end',padding:10}}>
                    <CustomText color='white'>by {item.username}</CustomText>
                </View>
                
            </View>
        </View>
      );


    return (
        loading ? <Text>Loading..</Text>:(
            <View style={styles.container}>
                <View style={{width:'20%'}}>
                    <CustomButton text={'Take Picture'} onPress={()=>{}}/>
                </View> 
                <FlatList
                    data={pictureData}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        )
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center', 
        alignItems:'center',
        flex: 1
    },

    image: {
        width: Dimensions.get('window').width * 0.4,
        height: Dimensions.get('window').width * 0.4,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: 'darkblue'
      },
    imageContainer: {
        margin:10,
        marginBottom:-50
    },
    imageDescription: {
        flexDirection:'row',
        top: -60,
        backgroundColor:'darkblue',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        width: Dimensions.get('window').width * 0.4,
    }
})

export default PictureScreen