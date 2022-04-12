import React from "react";
import {AppRegistry, StyleSheet, View, Button, Alert, TextInput} from "react-native";

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: "",
    }
  }

  render() {
    return  (
        <View style={styles.container}>
          <View style={{
            flexDirection:"row",
            alignItems:"center",
            marginHorizontal: 55,
            borderWidth: 2,
            marginTop: 30,
            paddingHorizontal: 10,
            borderColor: "#00716F",
            borderRadius: 23,
            paddingVertical: 2,
          }}>
            <TextInput
                onChangeText={name => this.setState({name})}
                placeholder="Введите имя"/>
          </View>
          <View style={{ marginTop: 30 }}>
            <Button title="Нажми" onPress={() => Alert.alert("Ваше имя: " + this.state.name)}/>
          </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
