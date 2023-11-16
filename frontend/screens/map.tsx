import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions, Linking, Platform} from 'react-native';
import MapView, { Marker, Geojson, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import Countries from '../assets/countries'
import client from '../actions/client';
import { CustomText } from '../components/text';
import Modal from "react-native-modal";
import { FontAwesome5 } from '@expo/vector-icons';
import moment from 'moment';
import FischLoading from '../components/loading';
import CustomButton, { CloseButton } from '../components/custom_botton';
import calculateRotation from '../utils/mapUtils';
import { checkLocalData, getFromLocal, saveToLocal, updateLocalData } from '../components/localStorage';

const MapScreen = ({route,navigation}) => {

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalVisible, setEventModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [eventData,setEventData] = useState([])
  const [imageData,setImageData] = useState([])
  const [loading, setLoading] = useState(true)
  const [routeVisible,setRouteVisible] = useState(false)
  const [mapReady,setMapReady] = useState(false)
  const initialRegion = {latitude: route.params && route.params.coords ? route.params.coords.latitude : 48.746417, 
                longitude: route.params && route.params.coords ? route.params.coords.longitude :9.105801,
                latitudeDelta: 20,
                longitudeDelta: 20,
              }

  const updateLocalStorage = async (data) => {
    const res = await checkLocalData(data.events.slice(0),'events')
    const newEventData = [...res?.existingData,...res?.newData]
    setEventData(newEventData)

    const res2 = await checkLocalData(data.pictures,'pictures')
    const newPictureData = [...res2?.existingData,...res2?.newData]
    setImageData(newPictureData)
    setLoading(false)

    if (res?.newData.length) {
      await updateLocalData(res?.newData,res?.existingData,'events','image')
      const localEventData = await getFromLocal('events');
      if (localEventData) {
        setEventData(localEventData)
      }
    }
    
    if (res2?.newData.length) {
      await updateLocalData(res2?.newData,res2?.existingData,'pictures','image')
      const localImageData = await getFromLocal('pictures');
      if (localImageData) {
        setImageData(localImageData)
      }
    }
    
    
  }

  useEffect(()=>{
      client.get('/map').then((res) => {
        updateLocalStorage(res.data)
        })
      .finally(() => setLoading(false))
  },[]) 

  const countries = eventData.map(event => {
    return Countries.features.find(obj => obj.properties.name === event.country);
  }).filter(Boolean)

  const coloredCountries = countries.map((country,index)=> (
    <Geojson key={index} 
    geojson={{
        type: 'FeatureCollection',
        features: [country]}} 
    strokeColor="#0568AE"
    fillColor="rgba(32, 32, 107, 0.5)"
    strokeWidth={2}
    tappable={true}
    onPress={() => {
      setSelectedEvent(eventData[index]);
      setEventModalVisible(true);
    }}
    /> 
    ))
  
  const imageMarkers = imageData.map((image, index) => (
      <Marker key={index} 
      coordinate={{longitude:parseFloat(image.long),latitude:parseFloat(image.lat)}}
      anchor={{x: 0.5, y: 1}}
      onPress={()=>{
        setSelectedImage(image)
        setImageModalVisible(true)
      }}
      tracksViewChanges={Platform.OS==='android' ? !mapReady : true}
      >
        <Image source={require('../assets/maps_marker.png')} style={{height:40,width:22.7}} resizeMode="contain"/>
      </Marker>
    ))

  const fischRoute = eventData.map(event => (
    {latitude:event.lat,longitude:event.long}
  )).filter(data => data && data.latitude !== null)

  const Arrow = ({size,color,index}) => {
    return (
      <View style={{height:size+2,width:2*size,marginLeft:15}}>
        <View style={{
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderStyle: 'solid',
              borderTopWidth: 0,
              borderRightWidth: size/2,
              borderBottomWidth: size,
              borderLeftWidth: size/2,
              borderTopColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: color,
              borderLeftColor: 'transparent',
              marginTop:-2
        }} />
        <View style={{borderColor:'darkblue',width:size*2/3,height:size,position:'absolute',top:-2,right:8}}>
          <CustomText fontSize={13} fontWeight='bold' color='darkblue'>{index}</CustomText>
        </View>
      </View>
  )}
  const markerData = fischRoute.map((coord, index) => calculateRotation(coord, fischRoute[index - 1], geodesic=true, heading=0)).slice(1);
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
    loading ? <FischLoading/> :
    <View style={styles.container}>
      <View style={{position:'absolute',top:10,right:20,zIndex:1}}>
        <CustomButton onPress={()=>{setRouteVisible(!routeVisible)}} text={routeVisible ? 'Hide Route' : 'Show Route'} borderColor='#19203c'/>
      </View>
      <MapView 
        key={JSON.stringify(initialRegion)}
        style={styles.map} 
        provider={PROVIDER_GOOGLE} 
        onMapReady={() => setTimeout(() => setMapReady(true), 100)}
        initialRegion={initialRegion}
        customMapStyle={mapStyle}
        >
        {coloredCountries}
        {imageMarkers}
        {routeVisible ? <>
          <Polyline coordinates={fischRoute} strokeWidth={4} strokeColor="#2121b4" geodesic/>
          {markerData.map((markerProps, index) => {
            return (
              <Marker {...markerProps} key={eventData[index].title} tappable={false} anchor={{ y: 0, x: 0.5 }}>
                <Arrow color={"#000080"} size={15} index={index+1}/>
              </Marker>
            );
          })} 
          </> : null}
      </MapView>

      <Modal isVisible={isEventModalVisible} 
      backdropOpacity={1}
      onBackdropPress={() => setEventModalVisible(false)}
      >
        <View style={{alignItems:'center',height:'100%', justifyContent:'center'}}>
          {selectedEvent && (
            <>
              <View style={styles.closeButton}>
                <CloseButton onPress={()=>{setEventModalVisible(false)}}/>
              </View>

              <CustomText color='white' fontSize={24} fontWeight='bold'>{selectedEvent.title}</CustomText>
              <View style={{margin:-40}}>
                <Image source={{uri:selectedEvent.localPath ? selectedEvent.localPath : 'https://wodkafis.ch/media/'+selectedEvent.image}} style={{width:Dimensions.get('window').width*0.4, height:Dimensions.get('window').height*0.4}} resizeMode='contain'/>
              </View>
              <CustomText color='white' fontSize={24} fontWeight='bold'>{moment(selectedEvent.start,'YYYY-MM-DD').format('DD.MM.YYYY')}</CustomText>
              {/* <CustomText color='white'>{selectedEvent.description}</CustomText> */}
            </>
          )}
        </View>
      </Modal>

      <Modal isVisible={isImageModalVisible} 
      backdropOpacity={1}
      onBackdropPress={() => setImageModalVisible(false)}
      >
        <View style={{alignItems:'center'}}>
          {selectedImage && (
            <>
              <Image source={{uri:selectedImage.localPath ? selectedImage.localPath : 'https://wodkafis.ch/media/' + selectedImage.image}} 
                style={{width:Dimensions.get('window').width, height:Dimensions.get('window').height}} 
                resizeMode='contain'/>
              <View style={styles.closeButton}>
                <CloseButton onPress={()=>{setImageModalVisible(false)}}/>
              </View>
              <TouchableOpacity style={{position:'absolute',top:'8%',left:'5%'}} onPress={()=>{Linking.openURL('https://www.google.de/maps/dir//'+selectedImage.lat+','+selectedImage.long)}}>
                <FontAwesome5 name="directions" size={30} color="white" />
              </TouchableOpacity>
              <View style={{position:'absolute', bottom:55, padding:5, backgroundColor: '#161632',width:'50%',borderRadius:10, alignItems:'center'}}>
                <CustomText fontWeight='bold'>{selectedImage.description}</CustomText>
              </View>
              <View style={{position:'absolute', bottom:15, marginBottom:20}}>
                <CustomText fontSize={14} fontWeight='bold' color='white'>by {selectedImage.username}</CustomText>
              </View>
            </>
          )}
          
          </View>
      </Modal>

    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  map: {
    alignSelf: 'stretch', 
    height: '101%'
  },
  closeButton: {
    position:'absolute', 
    top:'8%', 
    right:'5%',
  }
});

export default MapScreen;
