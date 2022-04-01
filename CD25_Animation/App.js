import Constants from 'expo-constants';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  useWindowDimensions, Button
} from 'react-native';

import React, {useEffect, useRef} from "react";



const FadeInView = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0

  useEffect( () => {
    Animated.timing(
        fadeAnim,{
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }
    ).start()
    // start( event => {
    //   if (event.finished) {
    //     Animated.timing(
    //         fadeAnim,{
    //           toValue: 0,
    //           duration: 2000,
    //           useNativeDriver: true,
    //         }
    //     ).start()
    //   }
    // })
  }, [fadeAnim])

  return (
      <Animated.View                 // Special animatable View
          style={{
            ...props.style,
            opacity: fadeAnim,         // Bind opacity to animated value
          }}
      >
        {props.children}
      </Animated.View>
  );
}

const images = new Array(6).fill('https://images.unsplash.com/photo-1556740749-887f6717d7e4');

export default function App() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const fadeAnimInOut = useRef(new Animated.Value(1)).current;

  const fadeInOut = () => {
      Animated.timing(fadeAnimInOut, {
        toValue: 0.1,
        duration: 3000,
        useNativeDriver: true,
      }).start( () => {
        Animated.timing(fadeAnimInOut, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }).start()
      })
  }

  const { width: windowWidth } = useWindowDimensions();
  return (
      <SafeAreaView style={styles.container}>
          <FadeInView style={styles.scrollContainer}>
            <ScrollView
                horizontal={true}
                style={styles.scrollViewStyle}
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event([
                  {
                    nativeEvent: {
                      contentOffset: {
                        x: scrollX,
                      },
                    },
                  },
                ], {listener: event => fadeInOut(), useNativeDriver: false})}
                scrollEventThrottle={1}

            >
              {images.map((image, imageIndex) => {
                return (
                  <Animated.View
                      /* elevation to affect z-order of overlapping views in order for animation to work */
                      style={{ width: windowWidth, height: 250, opacity: fadeAnimInOut, elevation: 1}}
                      key={imageIndex}
                  >
                    <ImageBackground source={{ uri: image }} style={styles.card}>
                      <View style={styles.textContainer}>
                          <Text style={styles.infoText}>
                            {"Image - " + imageIndex}
                          </Text>
                      </View>
                    </ImageBackground>
                  </Animated.View>
                );
              })}
            </ScrollView>
            <View style={styles.indicatorContainer}>
              {images.map((image, imageIndex) => {
                const width = scrollX.interpolate({
                  inputRange: [
                    windowWidth * (imageIndex - 1),
                    windowWidth * imageIndex,
                    windowWidth * (imageIndex + 1)
                  ],
                  outputRange: [8, 16, 8],
                  extrapolate: "clamp"
                });
                return (
                    <Animated.View
                        key={imageIndex}
                        style={[styles.normalDot, { width }]}
                    />
                );
              })}
            </View>

          </FadeInView>
        <View style={{ marginTop: 30 }}>
          <Button title="Flip" onPress={fadeInOut}/>
        </View>
      </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    alignItems: "center",
    justifyContent: "center"
  },
  fadingContainer: {
    backgroundColor: "powderblue"
  },
  scrollContainer: {
    height: 300,
    alignItems: "center",
    justifyContent: "center"
  },
  scrollViewStyle: {
    backgroundColor:'white'
  },
  card: {
    flex: 1,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",

  },
  textContainer: {
    backgroundColor: "rgba(0,0,0, 0.7)",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 5
  },
  infoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  normalDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "silver",
    marginHorizontal: 4
  },
  indicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  outerScroll: {
    flex: 1,
    flexDirection: "column",
  },
  row: {
    flex: 1,
  },
})
