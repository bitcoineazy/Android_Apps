import { Text, View, StyleSheet, Image } from 'react-native';

export default function Picture() {
    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require('../assets/photo.png')} />
            <Text style={styles.header}>
                Работа не мечты
            </Text>
            <Text style={styles.paragraph}>
                Реалистичный взгляд на должностные обязанности. Чтобы мечты о идеальном рабочем месте не привели к рабству,
                читайте статью  о том, как не завышать ожидания и наслаждаться тем, что есть.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        margin: 30,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    paragraph: {
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'center',
    },
    logo: {
        height: 300,
        width: 300,
    }
});
