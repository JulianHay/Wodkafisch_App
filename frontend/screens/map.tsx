import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions, Linking} from 'react-native';
import MapView, { Marker, Geojson} from 'react-native-maps';
import Countries from '../assets/countries'
import client from '../actions/client';
import { CustomText } from '../components/text';
import Modal from "react-native-modal";
import { FontAwesome5 } from '@expo/vector-icons';
import moment from 'moment';

const MapScreen = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalVisible, setEventModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [eventData,setEventData] = useState([])
  const [imageData,setImageData] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
      client.get('/events').then((res) => setEventData(res.data))
      .then(() => client.get('/pictures').then((res) => setImageData(res.data)))
      .finally(() => setLoading(false))
  },[]) 

  const countryList = ['Germany','Germany','Finland','Greece','Italy','Mexico','Brazil']
  const countries = Countries.features.filter(feature =>
    countryList.includes(feature.properties.name));

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
  
  const imageMarkers =  imageData.map((image, index) => (
      <Marker key={index} 
      coordinate={{longitude:parseFloat(image.long),latitude:parseFloat(image.lat)}}
      image={require('../assets/maps_marker.png')}
      onPress={()=>{
        setSelectedImage(image)
        setImageModalVisible(true)
      }}>
      </Marker>
    ))
  
  return (
    loading ? <CustomText>Loading...</CustomText> :
    <View style={styles.container}>
      <MapView style={styles.map}>
        {coloredCountries}
        {imageMarkers}
      </MapView>

      <Modal isVisible={isEventModalVisible} 
      backdropOpacity={1}
      onBackdropPress={() => setEventModalVisible(false)}
      >
        <View style={{alignItems:'center',height:'100%', justifyContent:'center'}}>
          {selectedEvent && (
            <>
              <TouchableOpacity style={{position:'absolute', top:30, right:10,width:30,height:30, backgroundColor:'white',borderRadius:50, alignItems:'center',justifyContent:'center'}} onPress={() => setEventModalVisible(false)}>
                <CustomText fontWeight='bold' fontSize={24}>X</CustomText>
              </TouchableOpacity>
              <CustomText color='white' fontSize={24} fontWeight='bold'>{selectedEvent.title}</CustomText>
              <View style={{margin:-40}}>
                <Image source={{uri:selectedEvent.image}} style={{width:Dimensions.get('window').width*0.4, height:Dimensions.get('window').height*0.4}} resizeMode='contain'/>
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
              <Image source={{uri:selectedImage.image}} 
                style={{width:Dimensions.get('window').width, height:Dimensions.get('window').height}} 
                resizeMode='contain'/>
              <TouchableOpacity style={{position:'absolute', top:30, right:10,width:30,height:30, backgroundColor:'white',borderRadius:50, alignItems:'center',justifyContent:'center'}} onPress={() => setImageModalVisible(false)}>
                <CustomText fontWeight='bold' fontSize={24}>X</CustomText>
              </TouchableOpacity>
              <TouchableOpacity style={{position:'absolute',top:30,left:10}} onPress={()=>{Linking.openURL('https://www.google.de/maps/dir//'+selectedImage.lat+','+selectedImage.long)}}>
                <FontAwesome5 name="directions" size={30} color="white" />
              </TouchableOpacity>
              <View style={{position:'absolute', bottom:20, marginBottom:20, padding:5, backgroundColor: 'grey',width:'50%',borderRadius:10, alignItems:'center'}}>
                <CustomText fontWeight='bold'>{selectedImage.description}</CustomText>
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
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
