import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default function App() {
  return (
      <View style={styles.container}>
        <View style={{ flex: 1, backgroundColor: 'powderblue' }}>
          <Text style={styles.paragraph}>Достопримечательности Регенсбурга</Text>
        </View>
        <View style={{ flex: 2, backgroundColor: 'skyblue' }}>
          <Text style={styles.small}>
            Главный собор Регенсбурга, названный в честь Святого Петра, является
            одним из главных шедевров готической архитектуры в Баварии. Помимо
            него город изобилует историческими строениями и памятниками
            средневекового зодчества, протестантскими церквями и монастырскими
            комплексами.
          </Text>
        </View>
        <View style={{ flex: 3, backgroundColor: 'steelblue' }}>
          <Text style={styles.small}>
            Главной достопримечательностью Регенсбурга является центр
            средневекового города с старинным кафедральным собором и древним
            каменным мостом. Его часто называют «самым северным городом Италии» из
            — за большого количества средневековых купеческих домов и башен в
            итальянском стиле, а также уютных уличных кафе.
          </Text>
          <View style={styles.buttonContainer}>
            <Text style={styles.next}>
              ЧИТАТЬ ДАЛЕЕ
            </Text>
          </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
  },
  paragraph: {
    marginTop: 40,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  small: {
    marginTop: 50,
    marginHorizontal: 20,
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'center',
  },
  buttonContainer: {
    elevation: 10,
    marginTop: 60,
    marginHorizontal: 60,
    backgroundColor: '#AAAFFF',
    borderRadius: 10,
    padding: 15,
  },
  next: {
    fontSize: 18,
    fontWeight: 'normal',
    textAlign: 'center',
  },
});
