import React, {useRef} from 'react';
import { View, Modal, TouchableOpacity, ScrollView, StyleSheet,Animated  } from 'react-native';
import { CustomText } from '../text';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CloseButton } from '../custom_botton';

const PictureMenuModal = ({ modalVisible, setModalVisible, hidePicture, reportPicture, reportUser}) => {
    
    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        >
            <TouchableOpacity style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                justifyContent: 'flex-end'}} 
                onPress={()=>{setModalVisible(false)}}>
                <View style={{
                        backgroundColor:'#161632',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        padding: 16,
                        paddingTop:10
                        }}>
                    <View style={{flex:1,alignItems:'center',justifyContent:'top',paddingBottom:10}}>
                        <View style={{backgroundColor:'white',width:'30%',borderRadius:50,height:4}}/>
                    </View>
                    <TouchableOpacity style={{flexDirection:'row',padding:10}} onPress={hidePicture}>
                        <Icon name="eye-slash" size={20} color="white" style={{paddingRight:10}}/>
                        <CustomText>Hide Picture</CustomText>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flexDirection:'row',padding:10}} onPress={reportPicture}>
                        <Icon name="flag" size={20} color="white" style={{paddingRight:10}}/>
                        <CustomText>Report Content</CustomText>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flexDirection:'row',padding:10}} onPress={reportUser}>
                        <Icon name="user-times" size={20} color="white" style={{paddingRight:10}}/>
                        <CustomText>Block and Report User</CustomText>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity> 
        </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust opacity as needed
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 16,
    maxHeight: 300,
  },
});

export default PictureMenuModal;
