import * as React from 'react';
import * as RN from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { database } from '../config/fb';
import { collectionGroup, query, where, onSnapshot } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import WOCard from '../components/WOCard';

export default function Home() {
    const navigation = useNavigation();
    const { user } = useUser(); // Obtener el usuario y su área
    const [ordenesActivas, setOrdenesActivas] = React.useState([]);
    const [ordenesTerminadas, setOrdenesTerminadas] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (!user?.area) return; // Si no hay área de usuario, no hacer nada

        // Query para obtener solo procesos que coincidan con el área del usuario
        const q = query(
            collectionGroup(database, 'historial_procesos'),
            where('area', '==', user.area)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const procesos = snapshot.docs.map(doc => ({
                id: doc.id,
                wo: doc.ref.parent.parent.id, // ID del documento padre (WO)
                ...doc.data()
            }));

            const activas = procesos.filter(p => p.estado === 'activo');
            const terminadas = procesos.filter(p => p.estado === 'terminado');

            setOrdenesActivas(activas);
            setOrdenesTerminadas(terminadas);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    // Muestra el indicador de carga mientras se obtienen los datos
    if (loading) {
        return (
            <RN.View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <RN.ActivityIndicator size="large" color="#FFC107" />
            </RN.View>
        );
    }

    return (
        <RN.SafeAreaView style={styles.container}>
            {/* Órdenes activas en mi área */}
            <RN.View style={{ marginTop: 20, paddingHorizontal: 10 }}>
                <RN.Text style={styles.header}>Órdenes en proceso en {user?.area}</RN.Text>
                <RN.ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {ordenesActivas.length > 0 ? (
                        ordenesActivas.map(proceso => (
                            <WOCard
                                key={proceso.id}
                                woData={proceso} // Se pasa el objeto de proceso completo
                                onPress={() => navigation.navigate('DetailsCard', { proceso: proceso })}
                            />
                        ))
                    ) : (
                        <RN.Text style={styles.emptyMessage}>No hay órdenes activas en tu área.</RN.Text>
                    )}
                </RN.ScrollView>
            </RN.View>

            {/* Órdenes terminadas en mi área */}
            <RN.View style={{ marginTop: 30, paddingHorizontal: 10 }}>
                <RN.Text style={styles.header}>Órdenes terminadas en mi área</RN.Text>
                <RN.ScrollView style={{ maxHeight: 300 }}>
                    {ordenesTerminadas.length > 0 ? (
                        ordenesTerminadas.map(proceso => (
                            <RN.TouchableOpacity
                                key={proceso.id}
                                style={styles.terminadaCard}
                                onPress={() => navigation.navigate('DetailsCard', { proceso })}
                            >
                                <RN.Text style={styles.terminadaText}>WO: {proceso.wo} - {proceso.maquina}</RN.Text>
                            </RN.TouchableOpacity>
                        ))
                    ) : (
                        <RN.Text style={styles.emptyMessage}>No hay órdenes terminadas en tu área.</RN.Text>
                    )}
                </RN.ScrollView>
            </RN.View>

            {/* Botón flotante */}
            <RN.TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate('Scan')}>
                <Ionicons name='scan' size={50} color='white' />
            </RN.TouchableOpacity>
        </RN.SafeAreaView>
    );
}

const styles = RN.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    floatingButton: {
        position: 'absolute',
        right: 20,
        bottom: 80,
        backgroundColor: '#FFC107',
        padding: 16,
        borderRadius: 50,
        elevation: 5
    },
    terminadaCard: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        marginBottom: 8,
        borderRadius: 8
    },
    terminadaText: {
        fontSize: 16,
        color: '#555'
    },
    emptyMessage: {
        padding: 15,
        color: '#888'
    }
});