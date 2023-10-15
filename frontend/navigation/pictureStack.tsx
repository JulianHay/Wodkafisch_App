import { createStackNavigator } from "@react-navigation/stack";
import PictureScreen from "../screens/pictures";
import PictureDetailScreen from "../screens/picturesDetail";

const Stack = createStackNavigator()

const PictureStack = () => {

    return (
        <Stack.Navigator screenOptions={({ route, navigation }) => ({
            headerShown: false,
        })}>
        
            <Stack.Screen name="PictureScreen" component={PictureScreen} />
            <Stack.Screen name="PictureDetailScreen" component={PictureDetailScreen} />

        </Stack.Navigator>
    );
}


export default PictureStack;