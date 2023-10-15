import {View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity, ImageBackground, Alert, RefreshControl} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import client from '../actions/client';
import { CustomText } from '../components/text';
import { Ionicons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import CustomButton, { CloseButton } from '../components/custom_botton';
import Modal from "react-native-modal";
import FischLoading from '../components/loading';

const PictureDetailScreen = ({route,navigation}) => {
    const flatListRef = useRef(null);
    // const route = useRoute();
    const index = route.params.index;
    const [selectedPicture, setSelectedPicture] = useState(null);
    const [isPictureModalVisible, setPictureModalVisible] = useState(false);
    const [pictureData,setPictureData] = useState([])
    const [loading, setLoading] = useState(true)
    const onRefresh = () => {
      setLoading(true)
      client.get('/pictures/').then((res) => setPictureData(res.data))
        .finally(() => setLoading(false))
    }
    useEffect(()=>{
      onRefresh()
    },[])  

    // useEffect(() => {
    //   if (flatListRef.current) {
    //     flatListRef.current.scrollToIndex({ index: index, animated: true });
    //   }
    // }, [index]);

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.imageContainer} 
        onPress={() => {
        setSelectedPicture(item);
        setPictureModalVisible(true);
        }}>
            <Image source={{uri:item.image}} style={styles.image}/>
            <View style={styles.imageDescription}>
                <View style={{maxWidth:'40%', alignItems:'flex-start',padding:10}}>
                    <CustomText color='white' fontSize={10}>{item.date}</CustomText>
                    <CustomText color='white' fontSize={10}>{item.description}  <FontAwesome name="map-marker" size={18} color="white" /> </CustomText>
                </View>
                <View style={{width:'40%',height:'100%', alignItems:'flex-start',padding:10}}>
                    <View style={{flex:1,justifyContent:'flex-end'}}>
                      <CustomText color='white' fontSize={10}>by {item.username}</CustomText>
                    </View>
                </View>
                <View style={{flex:1,maxWidth:'60%', alignItems:'flex-end', padding:10}}>
                  <View style={{flexDirection:'row'}}>
                    <TouchableOpacity style={{marginRight:10}}>
                      <FontAwesome5 name="thumbs-up" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity >
                      <FontAwesome5 name="thumbs-down" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                  
                </View>
            </View>
        </TouchableOpacity>
      );


    return (
        loading ? <FischLoading/>:(
            <View style={styles.container}>
              <TouchableOpacity style={{alignItems:'flex-start',width:'100%',padding:10,flexDirection:'row'}} onPress={() => {navigation.goBack()}}>
                <Ionicons name="chevron-back" size={24} color="#3B71F3" />
                <View style={{marginTop:2}}>
                  <CustomText color='#3B71F3'>back</CustomText>
                </View>
              </TouchableOpacity>
                <FlatList
                    ref={flatListRef}
                    data={pictureData}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    numColumns={1}
                    initialScrollIndex={index}
                    getItemLayout={(data, index) => (
                      {length: Dimensions.get('window').width * 0.9, offset: Dimensions.get('window').width * 0.9 * index, index}
                    )}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh}/>}
                />
                
                <Modal isVisible={isPictureModalVisible} 
                backdropOpacity={1}
                onBackdropPress={() => setPictureModalVisible(false)}
                >
                    <View style={{alignItems:'center'}}>
                    {selectedPicture && (
                        <>
                        <Image source={{uri:selectedPicture.image}} 
                        style={{width:Dimensions.get('window').width, height:Dimensions.get('window').height}} 
                        resizeMode='contain'/>
                        
                        
                        <View style={{position:'absolute', top:'8%', right:'5%',}}>
                            <CloseButton onPress={()=>{setPictureModalVisible(false)}}/>
                        </View>
                        <View style={{position:'absolute', bottom:60, padding:5, backgroundColor: 'grey',width:'50%',borderRadius:10, alignItems:'center'}}>
                            <CustomText fontWeight='bold'>{selectedPicture.description}</CustomText>
                        </View>
                        <View style={{position:'absolute', bottom:20, marginBottom:20}}>
                            <CustomText fontSize={14} fontWeight='bold' color='white'>by {selectedPicture.username}</CustomText>
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
        width: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').width * 0.9,
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
        flex: 1,
        top: -50,
        backgroundColor:'darkblue',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        width: Dimensions.get('window').width * 0.9,
    }
})

export default PictureDetailScreen