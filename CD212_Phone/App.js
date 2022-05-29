import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions,
  Share,
} from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import IconEntypo from "@expo/vector-icons/Entypo";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const CONTACTS = [
  "Лев Толстой",
  "Анна Ахматова",
  "Иван Крылов",
  "Максим Горький",
];
const CONTACT_NUMBERS = [
  "+7-908-555-8548",
  "+7-935-550-7904",
  "+7-952-555-1662",
  "+7-952-555-7530",
];
const CONTACT_IMAGES = [
  "https://i.ibb.co/2NqxrxM/contact-1.jpg",
  "https://i.ibb.co/hRwb4TL/contact-2.jpg",
  "https://i.ibb.co/XJGMYBC/contact-3.jpg",
  "https://i.ibb.co/Gxk6b68/contact-4.jpg",
];

const Stack = createNativeStackNavigator();

const Phone = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={Contacts}>
        <Stack.Screen
          name="Home"
          component={Contacts}
          options={{ title: "Contacts" }}
        />
        <Stack.Screen
          name="Dial"
          component={Dial}
          options={{ title: "Dial" }}
        />
        <Stack.Screen
          name="Call"
          component={CallScreen}
          options={{ title: "Call" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Phone;

class Contacts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contact_menu_visible: CONTACTS.map((item) => false),
    };
  }

  shareContact = async (id) => {
    try {
      await Share.share({
        message: CONTACTS[id] + " : " + CONTACT_NUMBERS[id],
      });
    } catch (error) {
      alert(error.message);
    }
  };

  showContactMenu(id) {
    if (!this.state.contact_menu_visible[id]) {
      this.state.contact_menu_visible[id] = true;
      this.setState({ contact_menu_visible: this.state.contact_menu_visible });
    } else {
      this.state.contact_menu_visible[id] = false;
      this.setState({ contact_menu_visible: this.state.contact_menu_visible });
    }
  }

  callContact(id, call_type) {
    this.props.navigation.navigate("Call", {
      contact_id: id,
      call_type: call_type,
    });
  }

  render() {
    const renderContact = () => {
      return CONTACTS.map((contact, id) => {
        return (
          <View key={id}>
            <TouchableOpacity
              onPress={() => this.showContactMenu(id)}
              style={{ flexDirection: "row" }}
            >
              <Image
                source={{ uri: CONTACT_IMAGES[id] }}
                style={styles.contact_image}
              ></Image>
              <Text style={styles.contact_title}>{CONTACTS[id]}</Text>
            </TouchableOpacity>
            {this.state.contact_menu_visible[id] && (
              <View style={{ marginTop: 20 }}>
                <Text style={styles.contact_number}>
                  Мобильный {CONTACT_NUMBERS[id]}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignSelf: "center",
                    marginTop: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => this.callContact(id, "call")}
                  >
                    <Icon name="call" size={40} style={styles.icon} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.callContact(id, "video_call")}
                  >
                    <Icon name="video-call" size={40} style={styles.icon} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.shareContact(id)}>
                    <IconEntypo name="share" size={40} style={styles.icon} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        );
      });
    };

    return (
      <View style={styles.container}>
        <ScrollView>{renderContact()}</ScrollView>
        <TouchableOpacity
          pointerEvents="box-none"
          onPress={() => this.props.navigation.navigate("Dial")}
          style={{
            left: Dimensions.get("window").width * 0.8,
            top: Dimensions.get("window").height * 0.8,
            position: "absolute",
          }}
        >
          <Icon name="tty" size={64} />
        </TouchableOpacity>
      </View>
    );
  }
}

class Dial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: "",
    };
  }

  dialNumber(key) {
    if (key !== "erase") {
      this.state.number += key;
      this.setState({ number: this.state.number });
    } else {
      this.state.number = this.state.number.slice(0, -1);
      this.setState({ number: this.state.number });
    }
  }

  callNumber(call_type) {
    this.props.navigation.navigate("Call", {
      call_number: this.state.number,
      call_type: call_type,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 4, backgroundColor: "#cfcfcf" }}>
          <Text
            style={{
              textAlign: "center",
              marginTop: Dimensions.get("window").height / 12,
              fontSize: 48,
            }}
          >
            {this.state.number}
          </Text>
        </View>
        <View>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity onPress={() => this.dialNumber("1")}>
              <Text style={styles.dial_number}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.dialNumber("2")}>
              <Text style={styles.dial_number}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.dialNumber("3")}>
              <Text style={styles.dial_number}>3</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity onPress={() => this.dialNumber("4")}>
              <Text style={styles.dial_number}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.dialNumber("5")}>
              <Text style={styles.dial_number}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.dialNumber("6")}>
              <Text style={styles.dial_number}>6</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity onPress={() => this.dialNumber("7")}>
              <Text style={styles.dial_number}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.dialNumber("8")}>
              <Text style={styles.dial_number}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.dialNumber("9")}>
              <Text style={styles.dial_number}>9</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity onPress={() => this.dialNumber("*")}>
              <Text style={styles.dial_number}>* </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.dialNumber("0")}>
              <Text style={styles.dial_number}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.dialNumber("#")}>
              <Text style={styles.dial_number}>#</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity onPress={() => this.callNumber("video-call")}>
              <Icon
                name="video-call"
                size={48}
                style={{ margin: 15, marginHorizontal: 40 }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.callNumber("call")}>
              <Icon
                name="phone-in-talk"
                size={48}
                style={{ margin: 15, marginHorizontal: 40 }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.dialNumber("erase")}>
              <IconEntypo
                name="erase"
                size={48}
                style={{ margin: 15, marginHorizontal: 40 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

class CallScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.route.params.contact_id ||
        this.props.route.params.contact_id === 0 ? (
          <ImageBackground
            style={{ flex: 1 }}
            source={{ uri: CONTACT_IMAGES[this.props.route.params.contact_id] }}
            imageStyle={{ opacity: 0.4 }}
          >
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Image
                style={{
                  marginTop: 50,
                  width: 150,
                  height: 150,
                  borderRadius: 100,
                }}
                source={{
                  uri: CONTACT_IMAGES[this.props.route.params.contact_id],
                }}
              />
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 34,
                  fontWeight: "bold",
                  marginHorizontal: 30,
                  textShadowOffset: { width: 4, height: 4 },
                  textShadowRadius: 10,
                }}
              >
                {this.props.route.params.call_type === "call"
                  ? "Calling"
                  : "Requesting a Video Call with"}{" "}
                {CONTACTS[this.props.route.params.contact_id]}...
              </Text>
              <Text style={{ textAlign: "center", fontSize: 28 }}>
                {CONTACT_NUMBERS[this.props.route.params.contact_id]}
              </Text>
            </View>
          </ImageBackground>
        ) : (
          <ImageBackground
            style={{ flex: 1 }}
            source={{ uri: "https://i.ibb.co/mHMpRyg/empty-contact.png" }}
            imageStyle={{ opacity: 0.4 }}
          >
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Image
                style={{
                  marginTop: 50,
                  width: 150,
                  height: 150,
                  borderRadius: 100,
                }}
                source={{
                  uri: "https://i.ibb.co/8KfMtZc/empty-contact-mini.png",
                }}
              />
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 34,
                  fontWeight: "bold",
                  marginHorizontal: 30,
                  textShadowOffset: { width: 4, height: 4 },
                  textShadowRadius: 10,
                }}
              >
                {this.props.route.params.call_type === "call"
                  ? "Calling"
                  : "Requesting a Video Call"}
                ...
              </Text>
              <Text style={{ textAlign: "center", fontSize: 28 }}>
                {this.props.route.params.call_number}
              </Text>
            </View>
          </ImageBackground>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contact_image: {
    marginTop: 15,
    marginLeft: 15,
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  contact_title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 50,
    marginTop: 50,
  },
  contact_number: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  icon: {
    marginHorizontal: 25,
  },
  dial_number: {
    fontSize: 48,
    fontWeight: "bold",
    margin: 15,
    marginHorizontal: 50,
  },
});
