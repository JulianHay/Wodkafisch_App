import { createStackNavigator } from "@react-navigation/stack";
import PictureScreen from "../screens/pictures";
import { CameraScreen, PreviewScreen } from "../screens/camera";

const Stack = createStackNavigator()

const PictureStack = () => {

    return (
        <Stack.Navigator screenOptions={({ route, navigation }) => ({
            headerShown: false,
        })}>
        
            <Stack.Screen name="PictureScreen" component={PictureScreen} />
            <Stack.Screen name="Camera" component={CameraScreen} />
            <Stack.Screen name="PicturePreview" component={PreviewScreen} />

        </Stack.Navigator>
    );
}


export default PictureStack;