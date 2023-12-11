import {View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity, Modal, Alert, RefreshControl, Animated, ImageBackground, KeyboardAvoidingView} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import client from '../actions/client';
import { CustomText } from '../components/text';
import CustomInput from '../components/custom_input';
import { Ionicons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import CustomButton, { CloseButton } from '../components/custom_botton';
import FischLoading from '../components/loading';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Camera, CameraType } from 'expo-camera';
import * as Location from 'expo-location';
import Checkbox from 'expo-checkbox';
import { checkLocalData, getFromLocal, saveToLocal, updateLocalData } from '../components/localStorage';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import MapView,{ Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { Container } from '../components/custom_container';
import PictureMenuModal from '../components/modals/pictureMenuModal';

let camera: Camera
const darkmode = true

const PictureScreen = ({route,navigation}) => {

    const flatListRef = useRef(null);
    const [selectedContent, setselectedContent] = useState(null);
    const [selectedPicture, setSelectedPicture] = useState(null);
    const [isPictureModalVisible, setPictureModalVisible] = useState(false);
    const [isMenuModalVisible, setMenuModalVisible] = useState(false);
    const [pictureData,setPictureData] = useState([])
    const [loading, setLoading] = useState(true)
    const [isCameraModalVisible, setCameraModalVisible] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false)
    const [capturedImage, setCapturedImage] = useState<any>(null)
    const [cameraType, setCameraType] = useState(CameraType.back)
    const [flashMode, setFlashMode] = useState('off')
    const [location, setLocation] = useState({});
    const index = pictureData.length!==0 && route.params && route.params.id ? pictureData.findIndex(item => item.id === route.params.id) : 0;
    const [initialIndex, setInitialIndex] = useState(0);

    useEffect(()=>{
      setInitialIndex(index)
    },[route.params])

    const __startCamera = async () => {
    const {status} = await Camera.requestCameraPermissionsAsync()
    if (status === 'granted') {
      await getLatestPicture()
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
        const body = new FormData();
        body.append('image',{ uri: capturedImage.uri, type: 'image/jpeg', name: description+'.jpeg'})
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

  const __savePhotoRoll = async (description,location) => {

      if (!description) {
        Alert.alert('please enter a description')
      }
      else if (!location) {
        Alert.alert('please choose a location')
      }
      else {
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        };
        const body = new FormData();
        body.append('image',{ uri: selectedImage, type: 'image/jpeg', name: description+'.jpeg'})
        body.append('lat', location.latitude)
        body.append('long',location.longitude)
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

  const haversine = (lat1, lon1, lat2, lon2) => {
    const r = 6371; // km
    const p = Math.PI / 180;

    const a = 0.5 - Math.cos((lat2 - lat1) * p) / 2
                + Math.cos(lat1 * p) * Math.cos(lat2 * p) *
                  (1 - Math.cos((lon2 - lon1) * p)) / 2;

    const distance =  2 * r * Math.asin(Math.sqrt(a));
    return distance;
  };  

  const addDistance = (data) => {
    currentLocation()
    const pictureDataWithDistance = data.map((picture) =>{
        const distance = haversine(
          location.latitude,
          location.longitude,
          picture.lat,
          picture.long
        )
        return {
        ...picture,
        distance: distance,
        };
      })
    return pictureDataWithDistance
  }

  const filterData = async (data) => {
    let filteredPictureIds = await getFromLocal('filteredPictureIds')
    let filteredUsers = await getFromLocal('filteredUsers')
    let filteredPictures = data
    if (Array.isArray(filteredPictureIds) && filteredPictureIds.length !== 0) {
      filteredPictures = pictureData.filter((picture)=>!filteredPictureIds.includes(picture.id))
    } 
    if (Array.isArray(filteredUsers) && filteredUsers.length !== 0) {
      filteredPictures = pictureData.filter((picture)=>!filteredUsers.includes(picture.username))
    }               
    return filteredPictures
  }

  const fetchLocalStorage = async (data) => {
    const filteredData = await filterData(data)
    const res = await checkLocalData(filteredData,'pictures')
    const newData = [...res?.existingData,...res?.newData]
    const pictureDataWithDistance = addDistance(newData)
    setPictureData(pictureDataWithDistance)
    setLoading(false)
    if (res?.newData.length) {
      await updateLocalData(res?.newData,res?.existingData,'pictures','image')
      const localData = await getFromLocal('pictures');
      if (localData) {
        const pictureDataWithDistance = addDistance(localData)
        setPictureData(pictureDataWithDistance)
      }
    }
  } 

  const onRefresh = () => {
      setLoading(true)
      client.get('/pictures').then((res) => fetchLocalStorage(res.data['pictures']))
        .finally(() => setLoading(false))
  }

    useEffect(()=>{
      onRefresh()
    },[])  

    useEffect(()=>{
      sortPictures(sortBy)
    },[loading])

    const currentLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status == 'granted') {
        try {
          const location = await Location.getCurrentPositionAsync({});
          setLocation(location.coords)
        } catch (error) {
          console.error(error);
        }
    }}

    

    const pictures = pictureData.map((picture,index) => ({url:picture.localPath}))
    
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

    const scrollY = useRef(new Animated.Value(0)).current;

    const handleScroll = Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      { useNativeDriver: false }
    );

    const headerStyle = {
      transform: [
        {
          translateY: scrollY.interpolate({
            inputRange: [0, 50],
            outputRange: [0, -80],
            extrapolate: 'clamp',
          }),
        },
      ],
    };

    const [isOrderModalVisible,setOrderModalVisible] = useState(false)
    const [modalPosition, setModalPosition] = useState({ top: 122, left: 310 });
    const sortButton = useRef(null)
    const [sortBy, setSortBy] = useState('date')
    const measureButton = () => {
      sortButton.current.measureInWindow((x, y, width, height) => {
        setModalPosition({ top: y + height, left: x - 10 });
      });
    };
    const sortPictures = (type:string) => {
      const key = type==='date' ? 'id' : type==='likes' ? 'likes' : 'distance' 
      const sortedData = [...pictureData].sort((a, b) => b[key] - a[key])
      setPictureData(sortedData);
      setSortBy(type)
      setOrderModalVisible(false)
    }

    const [selectedImage, setSelectedImage] = useState(null);
    const [defaultImage, setDefaultImage] = useState(null);
    const openImagePicker = async () => {
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setPreviewVisible(true)
      }
    };

    const getLatestPicture = async () => {
      
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== 'granted') {
        console.error('Permission to access media library was denied');
        return;
      }

      const assets = await MediaLibrary.getAssetsAsync({ first: 1, mediaType: 'photo', sortBy: ['creationTime'] });
      if (assets?.assets.length > 0) {
        setDefaultImage(assets.assets[0].uri);
      } else {
        console.log('No pictures found in the camera roll.');
      }
    };

    const reportContent = (user,picture_id) => {
      const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
      };

      const body = JSON.stringify({ picture_id, user });
      client.post('/report_content',body,config)
    }

    const renderItem = ({ item,index }) => (
        // <TouchableOpacity style={styles.imageContainer} 
        <Container
        title={item.description}
        width={0.9}
        >
          <TouchableOpacity onPress={() => {
          setSelectedPicture(index);
          setPictureModalVisible(true);
          }}>
            {/* <Image source={{uri:'https://wodkafis.ch/media/'+item.image}} style={styles.image}/> */}
            <Image source={{uri:item.localPath ? item.localPath : 'https://wodkafis.ch/media/'+item.image}} style={styles.image}/>
          </TouchableOpacity>

            <View style={styles.imageDescription}>
                <View style={{width:'60%', alignItems:'flex-start',padding:10}}>
                    <CustomText color='white' fontSize={18}>{item.date}</CustomText>
                    <CustomText color='white' fontSize={18}>by {item.username}</CustomText>
                    
                    {/* <CustomText color='white' fontSize={10}>{item.date}</CustomText> */}
                    {/* <CustomText color='white' fontSize={10}>{item.description}  <FontAwesome name="map-marker" size={18} color="white" /> </CustomText> */}
                {/* </View>
                <View style={{width:'40%',height:'100%', alignItems:'flex-start',padding:10}}>
                    <View style={{flex:1,justifyContent:'flex-end'}}>
                      <CustomText color='white' fontSize={10}>by {item.username}</CustomText>
                    </View> */}
                </View>
                <View style={{flex:1,maxWidth:'40%', alignItems:'flex-end', justifyContent:'center'}}>
                  <View style={{flexDirection:'row'}}>
                    <View style={{paddingTop:3,paddingRight:5}}>
                      <CustomText color='white'>{item.likes}</CustomText>
                    </View>
                    <TouchableOpacity style={{alignItems:'center',justifyContent:'center',marginRight:10,zIndex:1}} onPress={() => {pictureLikePressed(item.id,!item.user_like)}}>
                      <Image source={item.user_like ? require('../assets/like_on.png') : require('../assets/like_off.png')} 
                        style={{width:20,height:25}} 
                        resizeMode='contain'/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{paddingRight:10, paddingLeft:5}} 
                      onPress={()=>{
                        setselectedContent(item)
                        setMenuModalVisible(true)
                      }}
                    >
                      <FontAwesome5 name="ellipsis-h" size={20} color="white" />
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Container>
      );

    return (
        loading ? <FischLoading/>:(
            <View style={styles.container}>
              <Animated.View style={{ ...headerStyle,flexDirection:'row',alignItems:'center', justifyContent:'center',width:'100%', position: 'absolute', top: 0, zIndex:1}}>
                <View style={{width:'40%',marginTop:20,marginBottom:10}}>
                      <CustomButton text={'Add Picture'} onPress={()=>{__startCamera()}}/>
                </View>

                <TouchableOpacity style={{padding:10,flexDirection:'row',position:'absolute',right:0}} 
                  onPress={() => {
                    setOrderModalVisible(!isOrderModalVisible)
                    measureButton()}
                    } 
                  ref={sortButton}>
                  <View style={{marginTop:2}}>
                    <CustomText>sort by</CustomText>
                  </View>
                  <Ionicons name="chevron-down" size={24} color={darkmode ? 'white': 'black'} />
                </TouchableOpacity>

                <Modal
                  transparent={true}
                  visible={isOrderModalVisible}
                  onRequestClose={() => setOrderModalVisible(false)}
                >
                  <TouchableOpacity style={{width:'100%',height:'100%'}} onPress={() => setOrderModalVisible(false)}>
                    <View style={{position: 'absolute', top: modalPosition.top, right:5, backgroundColor:'#161632',borderRadius:3}}>
                      <TouchableOpacity
                        onPress={() => sortPictures('date')}
                        style={{padding:3,paddingLeft:8,paddingRight:8,paddingTop:8}}
                      >
                        <View style={{flexDirection:'row'}}>
                          <Checkbox value={sortBy==='date'} onValueChange={() => sortPictures('date')} style={{marginRight:3}}/>
                          <CustomText>date</CustomText>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => sortPictures('likes')}
                        style={{padding:3,paddingLeft:8,paddingRight:8}}
                      >
                        <View style={{flexDirection:'row'}}>
                          <Checkbox value={sortBy==='likes'} onValueChange={() => sortPictures('likes')} style={{marginRight:3}}/>
                          <CustomText>likes</CustomText>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => sortPictures('distance')}
                        style={{padding:3,paddingLeft:8,paddingRight:8,paddingBottom:8}}
                      >
                        <View style={{flexDirection:'row'}}>
                          <Checkbox value={sortBy==='distance'} onValueChange={() => sortPictures('distance')} style={{marginRight:3}}/>
                          <CustomText>distance</CustomText>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </Modal>
              </Animated.View>

                <FlatList
                    ref={flatListRef}
                    data={pictureData}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    numColumns={1}
                    getItemLayout={(data, index) => (
                      {length: Dimensions.get('window').width * 0.9 + 17, offset: (Dimensions.get('window').width * 0.9 + 17) * index, index}
                    )}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={() => {onRefresh();setInitialIndex(0)}}/>}
                    onScroll={handleScroll}
                    initialNumToRender={5}
                    initialScrollIndex={initialIndex}
                    ListHeaderComponent={()=>{return(<View style={{height:80}}/>)}}
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
                  <View style={{position:'absolute', top:'8%', left:'5%',zIndex:1}}>
                    <TouchableOpacity onPress={()=>{
                      const coords = {latitude: pictureData[index].lat,  longitude: pictureData[index].long}
                      navigation.navigate('Map',{coords:coords})}}>
                        <FontAwesome name="map-marker" size={30} color={darkmode ? "white" : "black"} />
                    </TouchableOpacity>
                  </View>
                  <View style={{position:'absolute', top:'8%', right:'5%',zIndex:1}}>
                    <CloseButton onPress={()=>{setPictureModalVisible(false)}}/>
                  </View>
                  <View style={{position:'absolute', width:'100%',left:0, bottom:15 ,alignItems:'center',zIndex:1}}>
                    <View style={{position:'absolute', bottom:60, padding:5, backgroundColor: '#161632',width:'50%',borderRadius:10, alignItems:'center'}}>
                      <CustomText fontWeight='bold'>{pictureData[index].description}</CustomText>
                    </View>
                    <View style={{position:'absolute', bottom:20, marginBottom:20}}>
                      <CustomText fontSize={14} fontWeight='bold' color='white'>by {pictureData[index].username}</CustomText>
                    </View>
                  </View>
                  </>
                )}}
                />
                </Modal>

                <Modal visible={isCameraModalVisible}
                // backdropOpacity={1}
                >
                    <View style={{alignItems:'center',justifyContent:'center',flex:1}}>
                        <View style={{flex: 1,width:Dimensions.get('window').width, height:Dimensions.get('window').height}}
                        >
                        {previewVisible && capturedImage ? (
                            <CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} />
                        ) : 
                        previewVisible && selectedImage ? (
                          <CameraRollPreview photo={selectedImage} savePhoto={__savePhotoRoll} retakePicture={__retakePicture}/>
                        ) :
                        (
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
                                        <TouchableOpacity
                                          onPress={openImagePicker}
                                          style={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: 3,
                                            backgroundColor: '#fff',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position:'absolute',
                                            left:'10%',
                                            zIndex:1
                                          }}
                                        >
                                          <Image
                                            source={defaultImage ? { uri: defaultImage } : require('../assets/fisch.png')}
                                            style={{ width: 58, height: 58, borderRadius: 3 }}
                                          />
                                        </TouchableOpacity>

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
                    </View>
                </Modal>


                <PictureMenuModal 
                modalVisible={isMenuModalVisible} 
                setModalVisible={setMenuModalVisible}
                hidePicture={async ()=>{
                  let filteredPictureIds = await getFromLocal('filteredPictureIds')
                  if (Array.isArray(filteredPictureIds)) {
                    if (!filteredPictureIds.includes(selectedContent.id)) {
                      filteredPictureIds.push(selectedContent.id);
                    }
                    await saveToLocal('filteredPictureIds',filteredPictureIds)
                  } else {
                    filteredPictureIds = [selectedContent.id]
                    await saveToLocal('filteredPictureIds',[selectedContent.id])
                  }
                  onRefresh()
                  setMenuModalVisible(false)
                }}
                reportPicture={()=>{
                  reportContent(selectedContent.username, selectedContent.id)
                  Alert.alert('Successfully reported picture')
                  setMenuModalVisible(false)
                }}
                reportUser={async()=>{
                  let filteredUsers = await getFromLocal('filteredUsers')
                  if (Array.isArray(filteredUsers)) {
                    if (!filteredUsers.includes(selectedContent.username)) {
                      filteredUsers.push(selectedContent.username);
                    }
                    await saveToLocal('filteredUsers',filteredUsers)
                  } else {
                    filteredUsers = [selectedContent.username]
                    await saveToLocal('filteredUsers',[selectedContent.username])
                  }
                  onRefresh()
                  setMenuModalVisible(false)
                  reportContent(selectedContent.username, selectedContent.id)
                  Alert.alert('Successfully reported user')
                }}
                />
            </View>
        )
    )
}

const CameraPreview = ({photo, retakePicture, savePhoto}: any) => {
    
    const [description, setDescription] = useState('')
    return (
      <KeyboardAvoidingView
        behavior='padding'
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
            height:'100%',
            width:'100%'
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems:'center',
            }}
          >
            <View style={{backgroundColor:'black',
              justifyContent: 'flex-end',
              alignItems:'center',
              width:'100%',
              paddingBottom:20}}>
              <View style={{padding:20,width:'80%',alignItems:'center'}}>
                <CustomInput placeholder='description / location' value={description} setValue={setDescription}/>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <View style={{width: '35%', marginRight:40}}>
                  <CustomButton onPress={retakePicture} text='Re-take' bgColor='black' fgColor='white'/>
                </View>
                <View style={{width: '35%', marginLeft:40}}>
                  <CustomButton onPress={()=>{savePhoto(description)}} text='Save' bgColor='black' fgColor='white'/>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    )
  }

  const CameraRollPreview = ({ photo, retakePicture, savePhoto }: any) => {
    const [description, setDescription] = useState('');
    const [markerLocation, setMarkerLocation] = useState({latitude: 48.746417, longitude: 9.105801});

    const handleMapPress = (event) => {
      setMarkerLocation(event.nativeEvent.coordinate);
    };
    const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8ec3b9"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1a3646"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#64779e"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#334e87"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6f9ba5"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3C7680"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#304a7d"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2c6675"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#255763"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#b0d5ce"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3a4762"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0e1626"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#4e6d70"
      }
    ]
  }
]
    return (
      <KeyboardAvoidingView behavior="padding" style={{ backgroundColor: 'transparent', flex: 1, width: '100%', height: '100%', alignItems: 'center' }}>
        <View style={{ flex: 1, flexDirection: 'column', padding: 15, justifyContent: 'flex-end', alignItems: 'center',height: '100%', width: '100%', backgroundColor: 'black'}}>
            
            <View style={{height:'30%',width:'100%', borderRadius:10}}>
              <Image source={{uri:photo}} style={{height:'100%',width:'100%', borderRadius:10}} resizeMode="cover"/>
            </View>

            <MapView
              style={{ width: '100%', height: '40%', borderRadius:10, marginTop:20}}
              initialRegion={{
                latitude: 48.746417, 
                longitude: 9.105801,
                latitudeDelta: 50,
                longitudeDelta: 50,
              }}
              onPress={handleMapPress}
              provider={PROVIDER_GOOGLE}
              customMapStyle={mapStyle}
            >
              {markerLocation && 
              <Marker coordinate={markerLocation}> 
                <Image source={require('../assets/maps_marker.png')} style={{height:40,width:22.7}} resizeMode="contain"/>
              </Marker>}
            </MapView>
            
            <View style={{ margin: 20, width: '80%', alignItems: 'center' }}>
              <CustomInput placeholder="description / location" value={description} setValue={setDescription} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <View style={{ width: '35%', marginRight: 40 }}>
                <CustomButton onPress={retakePicture} text="Back" bgColor="black" fgColor="white"/>
              </View>
              <View style={{ width: '35%', marginLeft: 40 }}>
                <CustomButton onPress={() => savePhoto(description, markerLocation)} text="Save" bgColor="black" fgColor="white" />
              </View>
            </View>
          </View>
      </KeyboardAvoidingView>
    );
  };

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center', 
        alignItems:'center',
        flex: 1,
        backgroundColor: darkmode ? "#000022" : "darkblue"
    },

    image: {
        width: Dimensions.get('window').width * 0.87,
        height: Dimensions.get('window').width * 0.87,
        borderRadius: 10,
        marginTop:-5
      },
    imageContainer: {
        margin:10,
    },
    imageDescription: {
        flexDirection:'row',
        flex: 1,
        marginTop: -3,
        marginBottom:-13,
        // top: -50,
        // backgroundColor:'darkblue',
        // borderBottomLeftRadius: 10,
        // borderBottomRightRadius: 10,
        width: Dimensions.get('window').width * 0.87,
    }
})

export default PictureScreen