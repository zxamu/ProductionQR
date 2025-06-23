import { View, Text, StyleSheet, Button } from 'react-native';

export default function Details({ route, navigation }) {
    const { resultData, registrado, dbInfo } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Resultado del escaneo</Text>
            <Text style={styles.status}>
                {registrado ? '✅ WO en proceso' : '❌ WO fuera de proceso'}
            </Text>

            <View style={styles.infoBox}>
                <Text>W.O: {resultData.wo}</Text>
                <Text>Cliente: {resultData.customer}</Text>
                <Text>Número de parte: {resultData.partNumber}</Text>
                <Text>Cantidad: {resultData.qty}</Text>
                <Text>Fecha de entrega: {resultData.dueDate}</Text>
            </View>

            {registrado ? (
                <View style={styles.dbInfoBox}>
                    <Text style={styles.subTitle}>Datos en base de datos:</Text>
                    <Text>Nombre: {dbInfo.nombre}</Text>
                    <Text>Ubicación: {dbInfo.ubicacion}</Text>
                    {/* puedes agregar más campos si es necesario */}
                </View>
            ) : (
                <View style={{ marginTop: 30 }}>
                    <Button
                        title="Registrar WO"
                        onPress={() => navigation.navigate('RegisterWO', { resultData })}
                        color="#FF9900"
                    />
                </View>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    status: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    infoBox: {
        marginTop: 10,
    },
    dbInfoBox: {
        marginTop: 30,
    },
    subTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
});
