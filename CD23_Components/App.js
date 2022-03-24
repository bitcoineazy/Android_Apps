import {Alert, Button, StyleSheet, Text, View, ScrollView, Image} from 'react-native'
import Carousel, {Pagination} from 'react-native-snap-carousel'
import Constants from 'expo-constants'
import {useState} from 'react'

const data = [
  {
    title: "Aenean leo",
    body: "Ut tincidunt tincidunt erat. Sed cursus turpis vitae tortor. Quisque malesuada placerat nisl. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Ut tincidunt tincidunt erat. Sed cursus turpis vitae tortor. Quisque malesuada placerat nisl. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Ut tincidunt tincidunt erat. Sed cursus turpis vitae tortor. Quisque malesuada placerat nisl. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.",
    imgUrl: "https://picsum.photos/id/11/200/300"
  },
  {
    title: "In turpis",
    body: "Aenean ut eros et nisl sagittis vestibulum. Donec posuere vulputate arcu. Proin faucibus arcu quis ante. Curabitur at lacus ac velit ornare lobortis. ",
    imgUrl: "https://picsum.photos/id/10/200/300"
  },
  {
    title: "Lorem Ipsum",
    body: "Phasellus ullamcorper ipsum rutrum nunc. Nullam quis ante. Etiam ultricies nisi vel augue. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc.",
    imgUrl: "https://picsum.photos/id/12/200/300"
  }
]

export default function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  const RenderItem = ({ item, index }) => {
    return (
        <ScrollView style={styles.card}>
          <Text style={styles.header}>{item.title}</Text>
          <Image
              source={{ uri: item.imgUrl }}
              style={styles.logoStyle}
          />
          <Text style={styles.body}>{item.body}</Text>
        </ScrollView>
    );
  }

  return (
      <View style={styles.app}>
        <Carousel
            layout={"default"}
            data={data}
            renderItem={RenderItem}
            sliderWidth={300}
            itemWidth={290}
            onSnapToItem={(index) => setActiveSlide(index)}
            swipeThreshold={100}
            inactiveSlideOpacity={0.4}
            containerCustomStyle={{
              overflow: "visible",
              marginVertical: 5,
            }}
        />
        <Pagination
            dotsLength={data.length}
            activeDotIndex={activeSlide}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 10,
            }}>
        </Pagination>
        <Button
            title="Got it, thanks!"
            onPress={() => Alert.alert('Here you go!')}
            color={'blue'}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex:1,
    justifyContent:'center',
    paddingTop: Constants.statusBarHeight,
  },
  card: {
    marginLeft: 20,
  },
  logoStyle: {
    width: 200,
    height: 300,
  },
  header: {
    color: 'black',
    fontSize: 28,
    fontWeight: "bold",
    margin: 20,
  },
  body: {
    color: 'black',
    fontSize: 18,
    margin: 20,
    paddingRight: 20,
    textAlign: 'center',
  },
});
