import { createStackNavigator } from "@react-navigation/stack";
import { View, Image, Text } from 'react-native';

function HeaderLogo() {
    return (
        <View>
            <Image source={require('../assets/fisch.png')}/>
        </View>
    )
}

function Profile() {
    return (
        <View>
            <Text>profile</Text>
        </View>
    )
}

const Stack = createStackNavigator();
export const Header = () => {
    return (
        <Stack.Navigator screenOptions={{headerStyle: {backgroundColor: 'darkblue'}}}>
            <Stack.Screen name='Profile' component={Profile} options={{headerTitle: () => <HeaderLogo/>}}/>
        </Stack.Navigator>
        
    )}