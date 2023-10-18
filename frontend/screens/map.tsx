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

const MapScreen = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalVisible, setEventModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [eventData,setEventData] = useState([])
  const [imageData,setImageData] = useState([])
  const [loading, setLoading] = useState(true)
  const [routeVisible,setRouteVisible] = useState(false)
  const [mapReady,setMapReady] = useState(false)
  useEffect(()=>{
      client.get('/map').then((res) => {
        setEventData(res.data.events.slice(0))
        setImageData(res.data.pictures)
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
    fillColor="#009FDB"
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
      tracksViewChanges={!mapReady}
      >
        <Image source={require('../assets/maps_marker.png')} style={{height:40,width:22.7}} resizeMode="contain"/>
        
      </Marker>
    ))

  const fischRoute = eventData.map(event => (
    {latitude:event.lat,longitude:event.long}
  ))

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

  
  return (
    loading ? <FischLoading/> :
    <View style={styles.container}>
      <View style={{position:'absolute',top:10,right:20,zIndex:1}}>
        <CustomButton onPress={()=>{setRouteVisible(!routeVisible)}} text={routeVisible ? 'Hide Route' : 'Show Route'} bgColor='darkblue' fgColor='white'/>
      </View>
      <MapView style={styles.map} provider={PROVIDER_GOOGLE} onMapReady={() => setTimeout(() => setMapReady(true), 100)}>
        {coloredCountries}
        {imageMarkers}
        {routeVisible ? <>
          <Polyline coordinates={fischRoute} strokeWidth={4} strokeColor="#000080" geodesic/>
          {markerData.map((markerProps, index) => {
            return (
              <Marker  {...markerProps} key={eventData[index].title} tappable={false} anchor={{ y: 0, x: 0.5 }}>
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
                <Image source={{uri:'https://wodkafis.ch/media/'+selectedEvent.image}} style={{width:Dimensions.get('window').width*0.4, height:Dimensions.get('window').height*0.4}} resizeMode='contain'/>
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
              <Image source={{uri:'https://wodkafis.ch/media/'+selectedImage.image}} 
                style={{width:Dimensions.get('window').width, height:Dimensions.get('window').height}} 
                resizeMode='contain'/>
              <View style={styles.closeButton}>
                <CloseButton onPress={()=>{setImageModalVisible(false)}}/>
              </View>
              <TouchableOpacity style={{position:'absolute',top:'8%',left:'5%'}} onPress={()=>{Linking.openURL('https://www.google.de/maps/dir//'+selectedImage.lat+','+selectedImage.long)}}>
                <FontAwesome5 name="directions" size={30} color="white" />
              </TouchableOpacity>
              <View style={{position:'absolute', bottom:60, padding:5, backgroundColor: 'grey',width:'50%',borderRadius:10, alignItems:'center'}}>
                <CustomText fontWeight='bold'>{selectedImage.description}</CustomText>
              </View>
              <View style={{position:'absolute', bottom:20, marginBottom:20}}>
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
