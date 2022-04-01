import Constants from 'expo-constants';
import {Button, StyleSheet, Text, View} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Главный экран
const HomeScreen = ({ navigation, route }) => {
    return (
        <View style={styles.container}>
            <View style={styles.button_view}>
                <Button
                    title="Перейти на второй экран"
                    onPress={() =>
                        navigation.push('Второй экран!', { screen: "Второй" })
                    }
                />
            </View>
            <Text style={styles.bold_text}>{route.params.screen} экран</Text>
        </View>
    );
};

// Второй экран
const SecondScreen = ({ navigation, route }) => {
    return (
        <View style={styles.container}>
            <View style={styles.button_view}>
                <Button
                    title="Перейти на третий экран"
                    onPress={() =>
                        navigation.push('Третий экран!', { screen: "Третий" })
                    }
                />
            </View>
            <View style={styles.button_view}>
                <Button
                    title="Назад"
                    onPress={() =>
                        navigation.goBack()
                    }
                />
            </View>
            <Text style={styles.bold_text}>{route.params.screen} экран</Text>
        </View>
    );
};

// Третий экран
const ThirdScreen = ({ navigation, route }) => {
    return (
        <View style={styles.container}>
            <View style={styles.button_view}>
                <Button
                    title="Перейти на главный экран"
                    onPress={() =>
                        navigation.push('Главный экран!', { screen: "Главный" })
                    }
                />
            </View>
            <View style={styles.button_view}>
                <Button
                    title="Назад"
                    onPress={() =>
                        navigation.goBack()
                    }
                />
            </View>
            <View style={styles.button_view}>
                <Button
                    title="В самое начало"
                    onPress={() =>
                        navigation.popToTop()
                    }
                />
            </View>
            <Text style={styles.bold_text}>{route.params.screen} экран</Text>
        </View>
    );
};

// Указываем везде initialParams для доступа к route.params.screen
// (из-за того, что Drawer.Navigator просто возвращает экран, а передача доп параметра screen происходит в кнопке )
function DrawerNavigation() {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="Главный экран!" component={HomeScreen} initialParams={{ screen: "Главный"}}/>
            <Drawer.Screen name="Второй экран!" component={SecondScreen} initialParams={{ screen: "Второй"}}/>
            <Drawer.Screen name="Третий экран!" component={ThirdScreen} initialParams={{ screen: "Третий"}}/>
        </Drawer.Navigator>
    )
}

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            {/* Первым подключаем Drawer Navigator как вложенный в Stack Navigator */}
            <Stack.Screen name="DrawerNavigator" component={DrawerNavigation} options={{ headerShown: false }}/>
            <Stack.Screen name="Главный экран!" component={HomeScreen} />
            <Stack.Screen name="Второй экран!" component={SecondScreen} />
            <Stack.Screen name="Третий экран!" component={ThirdScreen} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.statusBarHeight,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button_view: {
        margin: 30,
    },
    bold_text: {
        margin: 30,
        fontSize: 18,
        fontWeight: "bold",
    }
});
