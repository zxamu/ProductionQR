// src/screens/Scan.js

import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { database } from '../config/fb'; //
import { collection, query, where, getDocs, limit, collectionGroup } from 'firebase/firestore'; //
import { useUser } from '../context/UserContext'; // Importar el hook de contexto de usuario

export default function ScannerScreen({ navigation }) {
    const [permission, requestPermission] = useCameraPermissions(); //
    const [scanned, setScanned] = useState(false); //
    const { user } = useUser(); // Obtener el usuario y su área desde el contexto

    if (!permission) return <View />; //
    if (!permission.granted) { //
        return (
            <View style={styles.centered}>
                <Text>Se requiere permiso para usar la cámara.</Text>
                <Button title="Dar permiso" onPress={requestPermission} />
            </View>
        );
    }

    const handleBarCodeScanned = async ({ data }) => {
        setScanned(true); //

        const parsedData = {}; //
        const pairs = data.split('-'); //
        pairs.forEach(pair => {
            const [key, value] = pair.split(':'); //
            switch (key.trim().toUpperCase()) {
                case 'W.O':
                    parsedData.wo = value.trim(); //
                    break;
                case 'CUSTOMER':
                    parsedData.customer = value.trim(); //
                    break;
                case 'PART NUMBER':
                    parsedData.partNumber = value.trim(); //
                    break;
                case 'QTY':
                    parsedData.qty = value.trim(); //
                    break;
                case 'DUE DATE':
                    parsedData.dueDate = value.trim(); //
                    break;
            }
        });

        const woKey = parsedData.wo; //

        if (!user?.area) {
            Alert.alert("Error de Usuario", "No se pudo identificar tu área de trabajo. Por favor, reinicia sesión.");
            setScanned(false);
            return;
        }

        try {
            // Se realiza una consulta de grupo para buscar en todas las subcolecciones 'historial_procesos'
            // si existe un proceso con estado 'activo' para la WO escaneada.
            const q = query(
                collectionGroup(database, 'historial_procesos'),
                where('wo', '==', woKey),
                where('estado', '==', 'activo'),
                limit(1)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Si se encuentra un proceso activo, se navega a la pantalla de detalles (DetailsCard).
                // DetailsCard contendrá la lógica para determinar si el usuario puede terminar el proceso o solo verlo.
                const procesoActivoDoc = querySnapshot.docs[0];
                const procesoActivo = { id: procesoActivoDoc.id, ...procesoActivoDoc.data() };

                navigation.navigate('DetailsCard', { 
                    proceso: procesoActivo,
                });

            } else {
                // Si no hay ningún proceso activo para esta WO, se permite el registro de uno nuevo.
                // Se navega a la pantalla 'Details' que mostrará la opción para registrar.
                navigation.navigate('Details', {
                    resultData: parsedData, //
                    registrado: false, //
                });
            }
        } catch (error) {
            console.error('Error buscando en Firestore:', error); //
            Alert.alert('Error', 'No se pudo verificar el QR. Intenta de nuevo.'); //
            setScanned(false); //
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} //
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, //
    },
    centered: {
        flex: 1, //
        justifyContent: 'center', //
        alignItems: 'center', //
    },
});