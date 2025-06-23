import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { doc, updateDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { database } from '../config/fb';
import { useUser } from '../context/UserContext'; 

function formatDuration(ms) {
    if (!ms) return "N/A";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}


export default function DetailsCard({ route, navigation }) {
    const { proceso } = route.params; // Ahora recibimos el proceso
    const { user } = useUser(); // Y el usuario en sesión
    const [historial, setHistorial] = useState([]);

    const esPropietarioDelArea = user?.area === proceso.area;
    const esProcesoActivo = proceso.estado === 'activo';

    useEffect(() => {
        // Escuchar cambios en el historial de la WO
        const woRef = doc(database, 'ordenes_trabajo', proceso.wo);
        const q = query(collection(woRef, 'historial_procesos'), orderBy('fechaInicio', 'desc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const historyList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setHistorial(historyList);
        });

        return () => unsubscribe();
    }, [proceso.wo]);


    const handleTerminarProceso = () => {
        Alert.alert("Confirmar", "¿Deseas terminar este proceso?", [
            { text: "Cancelar" },
            {
                text: "Sí", onPress: async () => {
                    try {
                        const fechaFin = new Date();
                        const duracion = fechaFin.getTime() - proceso.fechaInicio.toDate().getTime();

                        const woRef = doc(database, 'ordenes_trabajo', proceso.wo);
                        const procesoRef = doc(woRef, 'historial_procesos', proceso.id);
                        
                        await updateDoc(procesoRef, { 
                            estado: 'terminado',
                            fechaFin: fechaFin,
                            duracionTotal: duracion // Guardamos en ms
                        });

                        Alert.alert("Éxito", "El proceso ha sido terminado.");
                        navigation.navigate('Home');
                    } catch (error) {
                        console.error("Error al actualizar:", error);
                        Alert.alert("Error", "No se pudo actualizar el estado.");
                    }
                }
            }
        ]);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Detalle de la Orden</Text>
            <View style={styles.card}>
                <Text style={styles.label}>WO:</Text>
                <Text style={styles.value}>{proceso.wo}</Text>
                {/* ... puedes añadir más datos de la WO si los pasas por params ... */}
            </View>

            {esProcesoActivo && !esPropietarioDelArea && (
                <View style={styles.warningBox}>
                    <Text style={styles.warningText}>
                        Esta WO está activa en el área de {proceso.area}. Solo puedes ver los detalles.
                    </Text>
                </View>
            )}

            <Text style={styles.subTitle}>Historial de Procesos</Text>
            {historial.map(item => (
                <View key={item.id} style={styles.historyCard}>
                    <Text style={styles.historyArea}>{item.area} ({item.estado})</Text>
                    <Text>Máquina: {item.maquina}</Text>
                    <Text>Empleado: {item.empleado}</Text>
                    <Text>Inicio: {new Date(item.fechaInicio.seconds * 1000).toLocaleString()}</Text>
                    <Text>Fin: {item.fechaFin ? new Date(item.fechaFin.seconds * 1000).toLocaleString() : 'En proceso'}</Text>
                    <Text>Duración: {item.estado === 'terminado' ? formatDuration(item.duracionTotal) : '-'}</Text>
                </View>
            ))}

            {esProcesoActivo && esPropietarioDelArea && (
                <TouchableOpacity style={styles.button} onPress={handleTerminarProceso}>
                    <Text style={styles.buttonText}>Terminar Proceso en mi Área</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAFAFA', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    subTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 15, },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, elevation: 4 },
    historyCard: { backgroundColor: '#fff', borderRadius: 8, padding: 15, marginBottom: 10, elevation: 2 },
    historyArea: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
    label: { fontWeight: 'bold', marginTop: 10, color: '#555' },
    value: { fontSize: 16, color: '#333' },
    warningBox: { backgroundColor: '#FFFBEA', padding: 15, borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: '#FEEABC' },
    warningText: { color: '#926F14', textAlign: 'center' },
    button: { backgroundColor: '#d32f2f', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});