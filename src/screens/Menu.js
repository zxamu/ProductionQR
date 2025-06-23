import * as RN from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';

export default function Menu() {
    const navigation = useNavigation();

    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                navigation.navigate('Login');
            })
            .catch((error) => {
                console.error('Error al cerrar sesión:', error);
                Alert.alert('Error', 'No se pudo cerrar la sesión.');
            });
    };

    return (
        <RN.SafeAreaView>
            <RN.TouchableOpacity onPress={handleLogout}>
                <RN.Text>Salir</RN.Text>
            </RN.TouchableOpacity>
        </RN.SafeAreaView>
    );
}