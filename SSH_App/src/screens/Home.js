import React from "react"
import {View, Text, TouchableOpacity} from "react-native"

export default class Profile extends React.Component {
  render() {
    return (
        <View style={{ justifyContent: 'center', flex: 1, margin: 10}}>
          <View style={{ backgroundColor: "steelblue", borderRadius: 30 }}>
            <Text style={{ fontFamily: "SemiBold", fontSize: 20, alignSelf: "center", marginTop: 20 }}>
              Allow this app use permissions to write and read external storage in order to continue
            </Text>
          </View>
          <View style={{ marginHorizontal: 55, alignItems: "center", marginTop: 20 }} >
            <TouchableOpacity style={{
              backgroundColor: "teal",
              height: 45,
              marginTop: 20,
              borderRadius: 15,
              alignItems: "center",
            }} onPress={() => this.props.navigation.navigate("SSH")}>
              <Text style={{
                color: "white",
                padding: 12,
                paddingHorizontal: 20,
                fontWeight: "bold",
                fontSize: 16,
              }}>
                Proceed to SSH
              </Text>
            </TouchableOpacity>
          </View>
        </View>
    )
  }
}