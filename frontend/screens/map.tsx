import React, {UseState} from 'react';
import { View, StyleSheet } from 'react-native';
// import MapView, { Marker, Geojson } from 'react-native-maps';
// import Countries from '../assets/countries'

const MapScreen = () => {
//     const countryList = ['France', 'Canada', 'China']
//     const coordinates = [[120,40],[50,32],[12,143],[14,65]]

//     const countries = Countries.features.filter(feature =>
//         countryList.includes(feature.properties.name)
//       );

//   const markers = coordinates.map((coordinate, index) => ({
//     coordinate: {
//       latitude: coordinate[0],
//       longitude: coordinate[1],
//     },
//     title: countries[index],
//   }));

  return (
    <View style={styles.container}>
      {/* <MapView style={styles.map}>
        {countries.map((country,index)=> (
            <Geojson key={index} 
            geojson={{
                type: 'FeatureCollection',
                features: [country]}} 
            strokeColor="#0568AE"
            fillColor="#009FDB"
            strokeWidth={2} onPress={()=>('')}/>))}
        {markers.map((marker, index) => (
          <Marker key={index} coordinate={marker.coordinate} title={marker.title} />
        ))}
      </MapView> */}
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

// //             {/* <MapView
// //                 initialRegion={{
// //                     latitude: 37.78825,
// //                     longitude: -122.4324,
// //                     latitudeDelta: 0.0922,
// //                     longitudeDelta: 0.0421,
// //                 }} 
// //             />*/}
