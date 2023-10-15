import {View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity, ImageBackground, Alert, RefreshControl} from 'react-native';
import { useEffect, useState } from 'react';
import client from '../actions/client';
import { CustomText } from '../components/text';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import CustomButton, { CloseButton } from '../components/custom_botton';
import Modal from "react-native-modal";
import FischLoading from '../components/loading';
import { Camera, CameraType } from 'expo-camera';
import * as Location from 'expo-location';
import {StatusBar} from 'expo-status-bar'
import CustomInput from '../components/custom_input';

let camera: Camera

const PictureScreen = ({ route, navigation }) => {
    
    const [selectedPicture, setSelectedPicture] = useState(null);
    const [isPictureModalVisible, setPictureModalVisible] = useState(false);
    const [isCameraModalVisible, setCameraModalVisible] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false)
    const [capturedImage, setCapturedImage] = useState<any>(null)
    const [cameraType, setCameraType] = useState(CameraType.back)
    const [flashMode, setFlashMode] = useState('off')
    const [location, setLocation] = useState(null);

  const __startCamera = async () => {
    const {status} = await Camera.requestCameraPermissionsAsync()
    if (status === 'granted') {
      setCameraModalVisible(true)
    } else {
      Alert.alert('Access denied')
    }
  }
  const __takePicture = async () => {
    const photo: any = await camera.takePictureAsync()
    setPreviewVisible(true)
    setCapturedImage(photo)
  }
  const __savePhoto = async (description) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status == 'granted') {
      let location = await Location.getCurrentPositionAsync({});
      if (!description) {
        Alert.alert('please enter a description')
      }
      else {
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        };
        // const image = capturedImage
        // const lat = location.coords.latitude
        // const long = location.coords.longitude
        // const body = JSON.stringify({ image, description, lat, long});

        const body = new FormData();
    
        body.append('image',{ uri: capturedImage.uri,
                              type: 'image/jpeg',
                              name: description+'.jpeg'})
        body.append('lat', location.coords.latitude)
        body.append('long',location.coords.longitude)
        body.append('description',description)
        try {
          const res = await client.post('/upload_picture', body, config);
          if (res.data.success) {
            setCameraModalVisible(false)
            setPreviewVisible(false)
            onRefresh()
          }
        } catch (err) {
          Alert.alert(err)
        }
          
      }
    }
    else {
      Alert.alert('Permission to access location was denied');
      return;
    }
    }
  const __retakePicture = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
    __startCamera()
  }
  const __handleFlashMode = () => {
    if (flashMode === 'on') {
      setFlashMode('off')
    } else if (flashMode === 'off') {
      setFlashMode('on')
    } else {
      setFlashMode('auto')
    }
  }
  const __switchCamera = () => {
    if (cameraType === 'back') {
      setCameraType('front')
    } else {
      setCameraType('back')
    }
  }
    const [isPreviewModalVisible, setPreviewModalVisible] = useState(false);
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

    const renderItem = ({ item, index }) => (
        <TouchableOpacity style={styles.imageContainer} 
        onPress={() => {
          navigation.navigate('PictureDetailScreen',{
            index: index,
          })
        // setSelectedPicture(item);
        // setPictureModalVisible(true);
        }}>
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
        loading ? <FischLoading/>:(
            <View style={styles.container}>
                <View style={{width:'40%',marginTop:20,marginBottom:10}}>
                    <CustomButton text={'Take Picture'} onPress={()=>{__startCamera()}}/>
                </View> 
                <FlatList
                    data={pictureData}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    numColumns={2}
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

                <Modal isVisible={isCameraModalVisible}
                backdropOpacity={1}
                >
                    <View style={{alignItems:'center',justifyContent:'center',flex:1}}>
                        <View style={{flex: 1,width:Dimensions.get('window').width, height:Dimensions.get('window').height}}
                        >
                        {previewVisible && capturedImage ? (
                            <CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} />
                        ) : (
                            <Camera
                            type={cameraType}
                            flashMode={flashMode}
                            style={{flex: 1}}
                            ref={(r) => {
                                camera = r
                            }}
                            >
                                <View
                                    style={{
                                    flex: 1,
                                    width: '100%',
                                    backgroundColor: 'transparent',
                                    flexDirection: 'row',
                                    }}
                                >
                                    <View style={{
                                            backgroundColor:'black',
                                            flexDirection: 'row',
                                            width:'100%',
                                            height:80,
                                            }}>
                                        <View
                                        style={{
                                            position: 'absolute',
                                            left: '10%',
                                            bottom: 10,
                                        }}
                                        >
                                            <TouchableOpacity
                                                onPress={__handleFlashMode}
                                                style={{
                                                height: 30,
                                                width: 30
                                                }}
                                            >
                                                {flashMode === 'off' ? <Ionicons name="flash-off" size={24} color="white" /> : <Ionicons name="flash" size={24} color="white" />}
                                            </TouchableOpacity>
                                        </View>
                                        <View
                                        style={{
                                            position: 'absolute',
                                            right: '8%',
                                            bottom: 10,
                                        }}
                                        >
                                            <CloseButton onPress={()=>{setCameraModalVisible(false)}}/>
                                        </View>
                                    </View>

                                    <View
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        flexDirection: 'row',
                                        flex: 1,
                                        width: '100%',
                                        padding: 20,
                                        justifyContent: 'center',
                                        backgroundColor:'black',
                                        alignItems: 'center'
                                    }}
                                    >
                                        <View
                                            style={{
                                            alignSelf: 'center',
                                            flex: 1,
                                            alignItems: 'center'
                                            }}
                                        >
                                            <TouchableOpacity
                                            onPress={__takePicture}
                                            style={{
                                                width: 60,
                                                height: 60,
                                                bottom: 0,
                                                borderRadius: 50,
                                                backgroundColor: '#fff',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            >
                                                <View style={{width:55,height:55,borderColor:'black',borderRadius: 50, borderWidth:3}}></View>
                                            </TouchableOpacity>
                                        </View>

                                            <TouchableOpacity
                                                onPress={__switchCamera}
                                                style={{
                                                marginTop: 0,
                                                height: 30,
                                                width: 30,
                                                position: 'absolute',
                                                right: '10%'
                                                }}
                                            >
                                                <Ionicons name="camera-reverse" size={30} color="white" />
                                            </TouchableOpacity>


                                    </View>
                                </View>
                            </Camera>
                        )}
                        </View>
                    {/* <StatusBar style="light" /> */}
                    </View>

                <Modal isVisible={isPreviewModalVisible} 
                backdropOpacity={1}
                onBackdropPress={() => setPreviewModalVisible(false)}
                >
                    <View style={{alignItems:'center'}}>
                    

                    </View>
                </Modal>

                </Modal>
            </View>
        )
    )
}

const CameraPreview = ({photo, retakePicture, savePhoto}: any) => {
    
    const [description, setDescription] = useState('')
    return (
      <View
        style={{
          backgroundColor: 'transparent',
          flex: 1,
          width: '100%',
          height: '100%',
          alignItems:'center'
        }}
      >
        <ImageBackground
          source={{uri: photo && photo.uri}}
          style={{
            flex: 1
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              padding: 15,
              justifyContent: 'flex-end',
              alignItems:'center'
            }}
          >
            <View style={{margin:20,width:'80%',alignItems:'center'}}>
              <CustomInput placeholder='description / location' value={description} setValue={setDescription}/>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              {/* <TouchableOpacity
                onPress={retakePicture}
                style={{
                  width: 130,
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 4,
                  borderColor: 'white',
                  borderWidth: 2,
                  marginRight: 40,
                  backgroundColor: 'grey'
                }}
              >
                <CustomText color='white' fontSize={20}>
                  Re-take
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={()=>{savePhoto(description)}}
                style={{
                  width: 130,
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 4,
                  borderColor: 'white',
                  borderWidth: 2,
                  marginLeft:40,
                  backgroundColor: 'grey'
                }}
              >
                <CustomText color='white' fontSize={20}>
                  Save Picture
                </CustomText>
              </TouchableOpacity> */}
              <View style={{width: '35%', marginRight:40}}>
                <CustomButton onPress={retakePicture} text='Re-take' bgColor='black' fgColor='white'/>
              </View>
              <View style={{width: '35%', marginLeft:40}}>
                <CustomButton onPress={()=>{savePhoto(description)}} text='Save' bgColor='black' fgColor='white'/>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
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