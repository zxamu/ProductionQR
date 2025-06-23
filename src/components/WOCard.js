import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import useTimer from '../hooks/useTimer'; // Importar el hook

export default function WOCard({ woData, onPress }) {
    // woData ahora contiene la información del proceso activo
    const elapsedTime = useTimer(woData.fechaInicio);

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Text style={styles.title}>WO: {woData.wo}</Text>
            <Text>Máquina: {woData.maquina}</Text>
            <Text>Empleado: {woData.empleado}</Text>
            <View style={styles.timerContainer}>
                <Text style={styles.timerText}>{elapsedTime}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#f2f2f2',
        padding: 15,
        marginRight: 10,
        borderRadius: 10,
        minWidth: 220,
        elevation: 3
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5
    },
    timerContainer: {
        marginTop: 10,
        backgroundColor: '#333',
        borderRadius: 5,
        paddingVertical: 5,
        alignItems: 'center',
    },
    timerText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    }
});