import React, { useState, useEffect, useRef} from 'react';
import { View, StyleSheet, Animated, Image, Dimensions} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
//import LinearGradient from 'react-native-web-linear-gradient';
import { CustomText } from './text';
import { useFocusEffect } from '@react-navigation/native';

function Battlepass({ sponsorData, seasonData, itemData }) {
  const itemSize = 30
  const progressBarWidth = Dimensions.get('window').width*0.78
  const animatedItemWidths = useRef([]);

  const itemAnimations = itemData.map((data, index) => {
    animatedItemWidths.current[index] = new Animated.Value(0);

    const animation = Animated.timing(animatedItemWidths.current[index], {
      toValue: itemSize,
      duration: itemSize*300/(sponsorData[0].season_score / seasonData[0].max_donation * progressBarWidth), 
      useNativeDriver: false, 
    });
    return animation
  });

  const [progress] = useState(new Animated.Value(0));
  const progressAnimation = Animated.timing(progress, {
    toValue: sponsorData[0].season_score / seasonData[0].max_donation * progressBarWidth, 
    duration: 3000, 
    useNativeDriver: false, 
  });

  const [imagePaths,setImagePaths] = useState(itemData.map((data, index) => { 
    return sponsorData[0].unlocked_items_animation < index+1 || sponsorData[0].unlocked_items<index+1 ? require('../assets/ChestClosed.png') :
    require('../assets/chest_open.png')
      
  }))

  progress.addListener(({ value }) => {
    for (let index = 0; index < itemData.length; index++) {
      if (value>itemData[index].price/ seasonData[0].max_donation * progressBarWidth) {
        itemAnimations[index].start(()=>{
            if (sponsorData[0].unlocked_items_animation<index+1){
              const paths = imagePaths
              paths[index] = require('../assets/chest_open.png')
              setImagePaths(paths)
              // console.log('item unlocked!')
          }})
      }
    }
  });
  
  const animatedItems = itemAnimations.map((animation, index) => (
    <View key={index} style={[styles.progressBar,
      {width:itemSize,height:itemSize,borderRadius:9,position:'absolute', 
      left:itemData[index].price/ seasonData[0].max_donation * progressBarWidth}]}>

      <View style={{flex:1, flexDirection: 'row', position:'absolute', top: -15, width:30, justifyContent:'center',}}>
        <CustomText color='white' fontSize={8}>{itemData[index].price}</CustomText>
        <Image source={require('../assets/fisch_flakes.png')} 
        style={{width:8,height:8,marginLeft:3}}/>
      </View>

        <Animated.View
        style={[{
            width: animatedItemWidths.current[index],
            height: itemSize, },
        ]}
        >
          <LinearGradient colors={['#0099ff', '#000888']} 
            style={[{borderRadius: 9} ,styles.progress]}/>
        </Animated.View>

        <Image source={imagePaths[index]} 
          style={{width:28, height:28, top:2, position:'absolute'} }/>

        <Image source={{uri:'https://wodkafis.ch/media/'+itemData[index].image}} 
            style={{width:28, height:30, top:32, position:'absolute'}} resizeMode='contain'/>
    </View>
  ));

  useFocusEffect(() => {
    progress.setValue(0)
    itemData.map((data, index) => {animatedItemWidths.current[index].setValue(0)})
    progressAnimation.start();
  });

  return (
    <View style={styles.container}>
      <View style={[styles.progressBar, {width:progressBarWidth,height:15, borderRadius: 9}]}>
        <Animated.View style={[{
              width: progress,
              height: '100%', },
          ]}>
            <LinearGradient colors={['#0099ff', '#000888']} 
            style={[{borderRadius: 9} ,styles.progress]}>
              <View style={{flexDirection:'column',alignItems:'flex-end', justifyContent:'center'}}>
                <Image source={require('../assets/fisch.png')} 
                style={{width:15,height:15,marginRight:3}}/>
              </View>
            </LinearGradient>
          </Animated.View>
          <View style={{position: 'absolute', left:5, top:1}}>
            <CustomText color={'white'} fontSize={10} >{sponsorData[0].season_score}</CustomText>
          </View>
      </View>
      <View style={[styles.progressContainer,{width: progressBarWidth}]}>{animatedItems}</View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      marginTop: 20,
      marginBottom: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'absolute',
      top: 8,
    },
    progressBar: {
        backgroundColor: '#292929',
        boxShadow: '0 -1px 1px #c0bfbc inset',
    },
    progress: {
        boxShadow: '0 2px 2px #333',
        width: '100%', 
        height: '100%'
    },
  });

export default Battlepass


