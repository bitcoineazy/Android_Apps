import React from "react";
import Constants from "expo-constants";
import * as FileSystem from "expo-file-system";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TextInput,
  Alert,
  Image,
} from "react-native";

const GIPHY_API_KEY = "***************************";

const gifDir = FileSystem.cacheDirectory + "giphy/";
const gifFileUri = (gifId) => gifDir + `gif_${gifId}_200.gif`;
const gifUrl = (gifId) => `https://media1.giphy.com/media/${gifId}/200.gif`;

const redditImageDir = FileSystem.cacheDirectory + "reddit/";
const redditGifUrl = [
  "https://i.redd.it/ma7iz0jz8nz81.jpg",
  "https://i.redd.it/0j9wrlt3cnz81.jpg",
];

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchGiphyQuery: "",
      giphyGifsIds: [],
      giphyGifsTitles: [],
      giphyGifsUri: [],
      redditGifs: [],
    };
  }

  async componentWillUnmount() {
    const dirInfo = await FileSystem.getInfoAsync(gifDir);
    if (dirInfo.exists) {
      await this.deleteAllGifs();
    }
  }

  async ensureDirExists(dir) {
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
      console.log("Gif directory doesn't exist, creating...");
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
  }

  async addMultipleGifs(gifIds) {
    try {
      await this.ensureDirExists(gifDir);

      console.log("Downloading", gifIds.length, "gif files...");
      await Promise.all(
        gifIds.map((id) => FileSystem.downloadAsync(gifUrl(id), gifFileUri(id)))
      );
    } catch (e) {
      console.error("Couldn't download gif files:", e);
    }
  }

  async getSingleGif(gifId) {
    await this.ensureDirExists(gifDir);

    const fileUri = gifFileUri(gifId);
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (!fileInfo.exists) {
      console.log("Gif isn't cached locally. Downloading...");
      await FileSystem.downloadAsync(gifUrl(gifId), fileUri);
    }
    return fileUri;
  }

  async deleteAllGifs() {
    console.log("Deleting all GIFs and images");
    await FileSystem.deleteAsync(gifDir);
    await FileSystem.deleteAsync(redditImageDir);
  }

  async findGifs(query) {
    if (query !== "") {
      this.setState({
        giphyGifsIds: [],
        giphyGifsTitles: [],
        giphyGifsUri: [],
      });
      try {
        const response = await fetch(
          `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${query}&limit=5&offset=0&rating=g&lang=en`
        );
        const { data } = await response.json();
        this.setState({
          giphyGifsIds: data.map((item) => item.id),
          giphyGifsTitles: data.map((item) => item.title),
        });
        await this.addMultipleGifs(this.state.giphyGifsIds);
        for (let i = 0; i < this.state.giphyGifsIds.length; i++) {
          console.log(i);
          this.setState({
            giphyGifsUri: [
              ...this.state.giphyGifsUri,
              await this.getSingleGif(this.state.giphyGifsIds[i]),
            ],
          });
        }
      } catch (e) {
        console.error("Unable to search for gifs", e);
        return [];
      }
    } else {
      Alert.alert("Please input search request query");
    }
  }

  async addRedditImages() {
    await this.ensureDirExists(redditImageDir)


  }

  render() {
    const renderGiphyItems = () => {
      if (this.state.giphyGifsIds.length > 0) {
        return this.state.giphyGifsIds.map((gif, id) => {
          console.log("render titles: " + this.state.giphyGifsTitles[id]);
          console.log("render uris: " + this.state.giphyGifsUri[id]);
          return (
            <View key={id} style={styles.giphy_item}>
              <Text style={{ fontSize: 18, margin: 10 }}>
                {this.state.giphyGifsTitles[id]}
              </Text>
              <Image
                style={{ height: 250, width: 250, margin: 10 }}
                source={{ uri: this.state.giphyGifsUri[id] }}
              />
            </View>
          );
        });
      }
    };

    const renderRedditItems = () => {};

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={{ color: "white", textAlign: "center", fontSize: 24 }}>
            Gallery
          </Text>
        </View>
        <ScrollView horizontal>
          <ScrollView style={{ width: Dimensions.get("window").width }}>
            <TextInput
              style={styles.search_input}
              placeholder="Search for Giphy Gifs"
              onSubmitEditing={(e) => this.findGifs(e.nativeEvent.text)}
            />
            {renderGiphyItems()}
          </ScrollView>
          <ScrollView
            style={{ width: Dimensions.get("window").width }}
          ></ScrollView>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    backgroundColor: "black",
    width: Dimensions.get("window").width,
  },
  search_input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  giphy_item: {
    alignItems: "center",
    margin: 5,
    backgroundColor: "#c8c5c5",
    borderRadius: 15,
  },
});
