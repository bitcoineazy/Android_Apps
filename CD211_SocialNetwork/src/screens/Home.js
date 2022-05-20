import React from "react";
import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "@expo/vector-icons/Entypo";
import Posts from "../screens/Posts";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popularSelected: true,
      posts: [
        [
          {
            name: "Лев Толстой",
            profile: require("../images/profile_1.jpg"),
            photo: require("../images/nature_1.jpg"),
          },
        ],
        [
          {
            name: "Анна Ахматова",
            profile: require("../images/profile_2.jpg"),
            photo: require("../images/nature_2.jpg"),
          },
        ],
        [
          {
            name: "Иван Крылов",
            profile: require("../images/profile_3.jpg"),
            photo: require("../images/nature_3.jpg"),
          },
        ],
      ],
      filteredPosts: [],
    };
  }

  onTabPressed = () => {
    this.setState({ popularSelected: !this.state.popularSelected });
  };

  handleSubmitSearch(query) {
    if (query !== "") {
      this.state.filteredPosts = [];
      for (let i = 0; i < this.state.posts.length; i++) {
        if (
          this.state.posts[i][0].name
            .toLowerCase()
            .includes(query.toLowerCase())
        ) {
          this.state.filteredPosts.push([this.state.posts[i][0]]);
        }
      }
      this.setState({ filteredPosts: this.state.filteredPosts });
    } else {
      this.state.filteredPosts = [];
      this.setState({ filteredPosts: this.state.filteredPosts });
    }
  }

  render() {
    const renderPostsArray = (array) => {
      return array.map((post, id) => {
        return (
          <View
            key={id}
            style={{ flexDirection: "row", paddingHorizontal: 35 }}
          >
            {id % 2 === 0 ? (
              <View
                style={{
                  height: 160,
                  backgroundColor: "#12c8c3",
                  width: 20,
                  marginLeft: -40,
                  marginRight: 20,
                  marginTop: 120,
                  borderTopRightRadius: 20,
                  borderBottomRightRadius: 20,
                }}
              ></View>
            ) : null}
            <Posts
              onPress={() => this.props.navigation.navigate("Detail")}
              name={post[0].name}
              profile={post[0].profile}
              photo={post[0].photo}
            />
            {id % 2 === 0 ? null : (
              <View
                style={{
                  height: 160,
                  backgroundColor: "#12c8c3",
                  width: 20,
                  marginLeft: 20,
                  marginTop: 120,
                  borderTopLeftRadius: 20,
                  borderBottomLeftRadius: 20,
                }}
              ></View>
            )}
          </View>
        );
      });
    };

    const renderPosts = () => {
      if (!this.state.filteredPosts.length > 0) {
        return renderPostsArray(this.state.posts);
      }
    };

    const renderFilteredPosts = () => {
      if (this.state.filteredPosts.length > 0) {
        return renderPostsArray(this.state.filteredPosts);
      }
    };

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          height: "100%",
          backgroundColor: "#04706d",
        }}
      >
        <View
          style={{
            height: 260,
            width: "100%",
            paddingHorizontal: 35,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              paddingTop: 40,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "50%",
              }}
            >
              <Image
                source={require("../images/Untitled.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>
            <View
              style={{
                width: "50%",
                alignItems: "flex-end",
              }}
            >
              <Icon
                name="dots-two-vertical"
                size={22}
                color="#d2d2d2"
                style={{
                  marginRight: -7,
                  marginTop: 7,
                }}
              />
            </View>
          </View>

          <Text
            style={{
              fontFamily: "Bold",
              fontSize: 25,
              color: "#FFF",
              paddingVertical: 25,
            }}
          >
            Лента фотографий
          </Text>

          <View
            style={{
              flexDirection: "row",
              borderColor: "#9ca1a2",
              borderRadius: 20,
              borderWidth: 0.2,
              paddingVertical: 5,
              alignItems: "center",
            }}
          >
            <TextInput
              placeholder="Найти автора..."
              selectionColor={"FFF"}
              placeholderTextColor={"FFF"}
              style={{
                paddingHorizontal: 20,
                fontFamily: "Medium",
                fontSize: 12,
                width: "90%",
                color: "#FFF",
              }}
              onSubmitEditing={(e) =>
                this.handleSubmitSearch(e.nativeEvent.text)
              }
            />
            <Icon name="magnifying-glass" size={15} color="#FFF" />
          </View>
        </View>

        <View
          style={{
            backgroundColor: "#FFF",
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            paddingHorizontal: 35,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              paddingTop: 20,
            }}
          >
            <TouchableOpacity
              onPress={this.onTabPressed}
              style={{
                borderBottomColor: this.state.popularSelected
                  ? "#044244"
                  : "#FFF",
                borderBottomWidth: 4,
                paddingVertical: 6,
              }}
            >
              <Text
                style={{
                  fontFamily: "Bold",
                  color: this.state.popularSelected ? "#044244" : "#9ca1a2",
                }}
              >
                ПОПУЛЯРНЫЕ
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.onTabPressed}
              style={{
                borderBottomColor: this.state.popularSelected
                  ? "#FFF"
                  : "#044244",
                borderBottomWidth: 4,
                paddingVertical: 6,
                marginLeft: 30,
              }}
            >
              <Text
                style={{
                  fontFamily: "Bold",
                  color: this.state.popularSelected ? "#9ca1a2" : "#044244",
                }}
              >
                ПОСЛЕДНИЕ
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView style={{ backgroundColor: "#FFF" }}>
          {renderPosts()}
        </ScrollView>
        <ScrollView
          style={{
            backgroundColor: "#FFF",
            paddingBottom: 50,
            borderBottomRightRadius: 40,
            borderBottomLeftRadius: 40,
          }}
        >
          {renderFilteredPosts()}
        </ScrollView>
      </ScrollView>
    );
  }
}
