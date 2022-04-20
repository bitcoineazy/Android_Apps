import {createStackNavigator} from "@react-navigation/stack"
import {createAppContainer} from "react-navigation"
import Home from "../screens/Home"
import SSH from "../screens/SSH";

const stackNavigatorOptions = {
  headerShown: false
}

const AppNavigator = createStackNavigator({
      Home:{screen:Home},
      SSH:{screen:SSH},
    },
    {
      defaultNavigationOptions: stackNavigatorOptions
    }
)

export default createAppContainer(AppNavigator)