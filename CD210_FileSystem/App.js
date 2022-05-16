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
import { API_KEY } from "dotenv";

const GIPHY_API_KEY = API_KEY;

const gifDir = FileSystem.cacheDirectory + "giphy/";
const gifFileUri = (gifId) => gifDir + `gif_${gifId}_200.gif`;
const gifUrl = (gifId) => `https://media1.giphy.com/media/${gifId}/200.gif`;

const redditImageDir = FileSystem.cacheDirectory + "reddit/";
const redditFileUri = (imageId) => redditImageDir + `image_${imageId}.jpg`;
const redditImageUrl = (imageId) => `https://i.redd.it/${imageId}.jpg`;
const redditImageIds = [
  "ma7iz0jz8nz81",
  "0j9wrlt3cnz81",
  "4tafxwqt2tz81",
  "127k07fq5vz81",
  "tpddyiuepvz81",
];

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchGiphyQuery: "",
      giphyGifsIds: [],
      giphyGifsTitles: [],
      giphyGifsUri: [],
      redditImagesUri: [],
    };
  }
  async deleteAllFiles() {
    console.log("Deleting all GIFs and images");
    await FileSystem.deleteAsync(gifDir);
    await FileSystem.deleteAsync(redditImageDir);
  }

  async componentWillUnmount() {
    const dirInfo = await FileSystem.getInfoAsync(gifDir);
    if (dirInfo.exists) {
      await this.deleteAllFiles();
    }
  }

  async componentDidMount() {
    await this.addRedditImages();
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

  async getSingleImage(imageId) {
    await this.ensureDirExists(gifDir);

    const fileUri = redditFileUri(imageId);
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (!fileInfo.exists) {
      console.log("Gif isn't cached locally. Downloading...");
      await FileSystem.downloadAsync(redditImageUrl(imageId), fileUri);
    }
    return fileUri;
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
          this.setState({
            giphyGifsUri: [
              ...this.state.giphyGifsUri,
              await this.getSingleGif(this.state.giphyGifsIds[i]),
            ],
          });
        }
      } catch (e) {
        console.error("Unable to search for gifs", e);
      }
    } else {
      Alert.alert("Please input search request query");
    }
  }

  async addRedditImages() {
    try {
      await this.ensureDirExists(redditImageDir);
      console.log("Downloading", redditImageIds.length, "image files...");

      await Promise.all(
        redditImageIds.map((id) =>
          FileSystem.downloadAsync(redditImageUrl(id), redditFileUri(id))
        )
      );

      for (let i = 0; i < redditImageIds.length; i++) {
        this.setState({
          redditImagesUri: [
            ...this.state.redditImagesUri,
            await this.getSingleImage(redditImageIds[i]),
          ],
        });
      }
    } catch (e) {
      console.error("Couldn't download image files:", e);
    }
  }

  render() {
    const renderGiphyItems = () => {
      if (this.state.giphyGifsIds.length > 0) {
        return this.state.giphyGifsIds.map((gif, id) => {
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

    const renderRedditItems = () => {
      if (this.state.redditImagesUri.length > 0) {
        return redditImageIds.map((item, id) => {
          return (
            <View key={id} style={styles.giphy_item}>
              <Text style={{ fontSize: 18, margin: 10 }}>Image #{id + 1}</Text>
              <Image
                style={{ height: 250, width: 250, margin: 10 }}
                source={{ uri: this.state.redditImagesUri[id] }}
              />
            </View>
          );
        });
      }
    };

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
          <ScrollView style={{ width: Dimensions.get("window").width }}>
            {renderRedditItems()}
          </ScrollView>
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
