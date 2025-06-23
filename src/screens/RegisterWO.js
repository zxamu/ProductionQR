import { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { database } from '../config/fb'
import { collection, addDoc } from 'firebase/firestore';

export default function RegisterWO({ route, navigation }) {
    const { resultData } = route.params;

    const [selectedMachine, setSelectedMachine] = useState('');
    const [employeeNumber, setEmployeeNumber] = useState('');

    const handleRegister = async () => {
        if (!selectedMachine || !employeeNumber) {
            Alert.alert('Campos incompletos', 'Por favor completa todos los campos.');
            return;
        }

        const registro = {
            wo: resultData.wo,
            cliente: resultData.customer,
            numeroParte: resultData.partNumber,
            cantidad: resultData.qty,
            fechaEntrega: resultData.dueDate,
            maquina: selectedMachine,
            empleado: employeeNumber,
            fechaRegistro: new Date().toISOString(),
            activo: true
        };

        try {
            await addDoc(collection(database, 'ordenes_registradas'), registro);
            Alert.alert('Éxito', 'Orden registrada correctamente.');
            navigation.navigate('Home');
        } catch (error) {
            console.error('Error guardando en Firestore:', error);
            Alert.alert('Error', 'No se pudo registrar la orden.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registrar nueva WO</Text>

            <View style={styles.infoBox}>
                <Text>W.O: {resultData.wo}</Text>
                <Text>Cliente: {resultData.customer}</Text>
                <Text>Número de parte: {resultData.partNumber}</Text>
                <Text>Cantidad: {resultData.qty}</Text>
                <Text>Fecha de entrega: {resultData.dueDate}</Text>
            </View>

            <Text style={styles.label}>Selecciona una máquina:</Text>
            <View style={styles.pickerBox}>
                <Picker
                    selectedValue={selectedMachine}
                    onValueChange={(itemValue) => setSelectedMachine(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Selecciona..." value="" />
                    <Picker.Item label="Máquina 1" value="maquina1" />
                    <Picker.Item label="Máquina 2" value="maquina2" />
                    <Picker.Item label="Máquina 3" value="maquina3" />
                </Picker>
            </View>

            <Text style={styles.label}>Número de empleado:</Text>
            <TextInput
                style={styles.input}
                placeholder="Ej. 12345"
                keyboardType="numeric"
                value={employeeNumber}
                onChangeText={setEmployeeNumber}
            />

            <Button title="Registrar" onPress={handleRegister} color="#FF9900" />
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
        marginBottom: 20,
    },
    infoBox: {
        marginBottom: 30,
    },
    label: {
        marginBottom: 5,
        fontWeight: '600',
    },
    pickerBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 20,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 30,
        height: 50,
    },
});