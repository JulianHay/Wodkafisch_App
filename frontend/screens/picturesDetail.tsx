import {View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity, Modal, Alert, RefreshControl} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import client from '../actions/client';
import { CustomText } from '../components/text';
import { Ionicons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import CustomButton, { CloseButton } from '../components/custom_botton';
// import Modal from "react-native-modal";
import FischLoading from '../components/loading';
import ImageViewer from 'react-native-image-zoom-viewer';

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
      client.get('/pictures').then((res) => setPictureData(res.data['pictures']))
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
    const pictures = pictureData.map((picture,index) => ({url:picture.image}))
    const pictureLikePressed = (picture_id,like) => {
      
      const itemIndex = pictureData.findIndex(item => item.id === picture_id);
        if (itemIndex !== -1) {
          const updatedData = [...pictureData];
          updatedData[itemIndex].user_like = like;
          like ? updatedData[itemIndex].likes += 1 : updatedData[itemIndex].likes -= 1 
          setPictureData(updatedData);
        }
      const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
      };

      const body = JSON.stringify({ picture_id, like });
      client.post('/like_picture',body,config)
    }
    const renderItem = ({ item,index }) => (
        <TouchableOpacity style={styles.imageContainer} 
        onPress={() => {
        setSelectedPicture(index);
        setPictureModalVisible(true);
        }}>
            <Image source={{uri:'https://wodkafis.ch/media/'+item.image}} style={styles.image}/>
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
                    <View style={{paddingTop:3,paddingRight:5}}>
                      <CustomText color='white'>{item.likes}</CustomText>
                    </View>
                    <TouchableOpacity style={{marginRight:10,alignItems:'center',justifyContent:'center'}} onPress={() => {pictureLikePressed(item.id,!item.user_like)}}>
                      <Image source={item.user_like ? require('../assets/like_on.png') : require('../assets/like_off.png')} 
                        style={{width:20,height:25}} 
                        resizeMode='contain'/>
                      {/* <FontAwesome5 name="thumbs-up" solid={item.user_like} size={24} color="white"/> */}
                    </TouchableOpacity>
                    {/* <TouchableOpacity >
                      <FontAwesome5 name="thumbs-down" size={24} color="white" />
                    </TouchableOpacity> */}
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
                      {length: Dimensions.get('window').width * 0.9 + 17, offset: (Dimensions.get('window').width * 0.9 + 17) * index, index}
                    )}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh}/>}
                />
                
                {/* <Modal isVisible={isPictureModalVisible} 
                backdropOpacity={1}
                onBackdropPress={() => setPictureModalVisible(false)}
                > */}
                <Modal visible={isPictureModalVisible} transparent={true}>

                <ImageViewer imageUrls={pictures} index={selectedPicture} enableSwipeDown 
                onSwipeDown={()=>{setPictureModalVisible(false)}}
                renderHeader={(index)=>{return(
                  <>
                  <View style={{position:'absolute', top:'8%', right:'5%',zIndex:1}}>
                    <CloseButton onPress={()=>{setPictureModalVisible(false)}}/>
                  </View>
                  <View style={{position:'absolute', width:'100%',left:0, bottom:40 ,alignItems:'center',zIndex:1}}>
                    <View style={{position:'absolute', bottom:60, padding:5, backgroundColor: 'grey',width:'50%',borderRadius:10, alignItems:'center'}}>
                      <CustomText fontWeight='bold'>{pictureData[index].description}</CustomText>
                    </View>
                    <View style={{position:'absolute', bottom:20, marginBottom:20}}>
                      <CustomText fontSize={14} fontWeight='bold' color='white'>by {pictureData[index].username}</CustomText>
                    </View>
                  </View>
                  </>
                )}}
                />
                {/* <View style={{position:'absolute', top:'8%', right:'5%',}}>
                  <CloseButton onPress={()=>{setPictureModalVisible(false)}}/>
                </View>
                {selectedPicture && (
                <View style={{position:'absolute',width:'100%',bottom:40,alignItems:'center'}}>
                  <View style={{position:'absolute', bottom:60, padding:5, backgroundColor: 'grey',width:'50%',borderRadius:10, alignItems:'center'}}>
                    <CustomText fontWeight='bold'>{pictureData[selectedPicture].description}</CustomText>
                  </View>
                  <View style={{position:'absolute', bottom:20, marginBottom:20}}>
                    <CustomText fontSize={14} fontWeight='bold' color='white'>by {pictureData[selectedPicture].username}</CustomText>
                  </View>
                </View> 
                )} */}
                    {/* <View style={{alignItems:'center'}}>
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
                    </View> */}
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