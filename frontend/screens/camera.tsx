// import React, { Component } from 'react';
// import { View, TouchableOpacity, Text, Image } from 'react-native';
// import { RNCamera } from 'react-native-camera';
// import Geolocation from 'react-native-geolocation-service';
// import client from '../actions/client';

// export class CameraScreen extends Component {
//   constructor(props) {
//     super(props);
//     this.camera = null;
//   }

//   takePicture = async () => {
//     if (this.camera) {
//       const options = { quality: 0.5, base64: true };
//       const data = await this.camera.takePictureAsync(options);
//       Geolocation.getCurrentPosition(
//         position => {
//           const { latitude, longitude } = position.coords;
//           this.props.navigation.navigate('Preview', {
//             image: data.uri,
//             latitude,
//             longitude,
//           });
//         },
//         error => {
//           console.error(error);
//           this.props.navigation.navigate('Preview', {
//             image: data.uri,
//             latitude: null,
//             longitude: null,
//           });
//         },
//         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//       );
//     }
//   }

//   render() {
//     return (
//       <View style={{ flex: 1 }}>
//         <RNCamera
//           ref={ref => {
//             this.camera = ref;
//           }}
//           style={{ flex: 1 }}
//         />
//         <TouchableOpacity onPress={this.takePicture}>
//           <Text>Take Picture</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }
// }

// export const PreviewScreen = ({ route, navigation }) => {
//     const { image, latitude, longitude } = route.params;

//   const saveImage = async () => {
//     try {
//       const response = await client.post('fisch_picture', { image, latitude,
//         longitude,});
//       console.log(response.data);
//       navigation.navigate('Pictures');
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <Image source={{ uri: image }} style={{ flex: 1 }} />
//       <TouchableOpacity onPress={saveImage}>
//         <Text>Save</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => navigation.goBack()}>
//         <Text>Try Again</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };


