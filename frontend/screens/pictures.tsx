import {View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity} from 'react-native';
import { useEffect, useState } from 'react';
import client from '../actions/client';
import { CustomText } from '../components/text';
import { FontAwesome } from '@expo/vector-icons';
import CustomButton from '../components/costum_botton';
import Modal from "react-native-modal";

const PictureScreen = ({ route, navigation }) => {
    
    const [selectedPicture, setSelectedPicture] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [pictureData,setPictureData] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        client.get('/pictures').then((res) => setPictureData(res.data))
        .finally(() => setLoading(false))
    },[])  


    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.imageContainer} 
        onPress={() => {
        setSelectedPicture(item);
        setModalVisible(true);}}>
            <Image source={{uri:item.image}} style={styles.image}/>
            <View style={styles.imageDescription}>
                <View style={{width:'65%', alignItems:'flex-start',padding:10}}>
                    <CustomText color='white' fontSize={10}>{item.date}</CustomText>
                    <CustomText color='white' fontSize={10}>{item.description}  <FontAwesome name="map-marker" size={18} color="white" /> </CustomText>
                </View>
                <View style={{width:'35%', alignItems:'flex-end',padding:10}}>
                    <CustomText color='white' fontSize={10}>by {item.username}</CustomText>
                </View>
                
            </View>
        </TouchableOpacity>
      );


    return (
        loading ? <Text>Loading..</Text>:(
            <View style={styles.container}>
                <View style={{width:'20%'}}>
                    <CustomButton text={'Take Picture'} onPress={()=>{navigation.navigate('Camera')}}/>
                </View> 
                <FlatList
                    data={pictureData}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                />
                
                <Modal isVisible={isModalVisible} 
                backdropOpacity={1}
                onBackdropPress={() => setModalVisible(false)}
                >
                    <View style={{alignItems:'center'}}>
                    {selectedPicture && (
                        <>
                        <Image source={{uri:selectedPicture.image}} 
                        style={{width:Dimensions.get('window').width, height:Dimensions.get('window').height}} 
                        resizeMode='contain'/>
                        <TouchableOpacity style={{position:'absolute', top:30, right:10,width:30,height:30, backgroundColor:'white',borderRadius:50, alignItems:'center',justifyContent:'center'}} onPress={() => setModalVisible(false)}>
                            <CustomText fontWeight='bold' fontSize={24}>X</CustomText>
                        </TouchableOpacity>
                        <View style={{position:'absolute', bottom:20, marginBottom:20, padding:5, backgroundColor: 'grey',width:'50%',borderRadius:10, alignItems:'center'}}>
                            <CustomText fontWeight='bold'>{selectedPicture.description}</CustomText>
                        </View>
                        </>
                    )}
                    </View>
                </Modal>
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
        top: -50,
        backgroundColor:'darkblue',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        width: Dimensions.get('window').width * 0.4,
    }
})

export default PictureScreen