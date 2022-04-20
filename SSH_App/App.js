import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import {Alert, PermissionsAndroid} from "react-native";
import "react-native-gesture-handler";

export default class App extends React.Component {

  requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "SSH App",
            message: "SSH App needs access to your device storage to read and write files",
          }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Success, app can use the storage");
      } else {
        Alert.alert("Permission error", "Storage permission denied")
      }
    } catch (err) {
      console.log(err)
    }
  };

  async componentDidMount() {
    await this.requestStoragePermission
  }

  render() {
    return (
        <AppNavigator/>
    )
  }
}