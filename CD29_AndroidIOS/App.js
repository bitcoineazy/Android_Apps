import React from "react";
import Constants from "expo-constants";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  ToastAndroid,
  Dimensions,
  Platform,
  ActionSheetIOS,
  Alert,
} from "react-native";

const ITEMS = {
  items: [
    "Item #1",
    "Item #2",
    "Item #3",
    "Item #4",
    "Item #5",
    "Item #6",
    "Item #7",
    "Item #8",
    "Item #9",
    "Item #10",
  ],
  uri: [
    "https://picsum.photos/100/100?random=1",
    "https://picsum.photos/100/100?random=2",
    "https://picsum.photos/100/100?random=3",
    "https://picsum.photos/100/100?random=4",
    "https://picsum.photos/100/100?random=5",
    "https://picsum.photos/100/100?random=6",
    "https://picsum.photos/100/100?random=7",
    "https://picsum.photos/100/100?random=8",
    "https://picsum.photos/100/100?random=9",
    "https://picsum.photos/100/100?random=10",
  ],
};

export default class App extends React.Component {
  handlePlatform(text) {
    if (Platform.OS === "android") {
      this.handlePressAndroidToast(text);
    } else if (Platform.OS === "ios") {
      this.handlePressIOS(text);
    }
  }

  handlePressAndroidToast(text) {
    ToastAndroid.show(text, ToastAndroid.SHORT);
  }

  handlePressIOS(text) {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Generate number", "Magic"],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: "dark",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
        } else if (buttonIndex === 1) {
          Alert.alert(text, "Result: " + Math.floor(Math.random() * 100) + 1);
        } else if (buttonIndex === 2) {
          Alert.alert(text, "🔮");
        }
      }
    );
  }

  render() {
    const renderItems = () => {
      return ITEMS["items"].map((item, id) => {
        return (
          <TouchableOpacity
            style={styles.item}
            key={id}
            onPress={() => this.handlePlatform(item)}
          >
            <ImageBackground
              style={styles.image}
              source={{ uri: ITEMS["uri"][id] }}
            />
            <Text
              style={{
                fontSize: 20,
                marginStart: Dimensions.get("window").width / 5,
              }}
            >
              {item}
            </Text>
          </TouchableOpacity>
        );
      });
    };

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={{ color: "white", textAlign: "center", fontSize: 24 }}>
            Lorem Ipsum List
          </Text>
        </View>
        <ScrollView>{renderItems()}</ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "black",
    width: Dimensions.get("window").width,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
    backgroundColor: "#95fff4",
    borderRadius: 15,
  },
  image: {
    width: 100,
    height: 100,
  },
});
