import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserProvider, useUser } from './context/UserContext';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import Home from "./screens/Home";
import Scan from "./screens/Scan";
import Login from "./screens/Login";
import Details from './screens/Details';
import Menu from './screens/Menu';
import RegisterWO from './screens/RegisterWO';
import DetailsCard from './screens/DetailsCard';


const Stack = createNativeStackNavigator();

function AppNavigator() {
    const { user, loading } = useUser(); // Usar el hook del contexto

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FFC107" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user ? (
                    // Si hay un usuario, muestra las pantallas principales
                    <>
                        <Stack.Screen name="Home" component={Home}
                        // ... (opciones de Home sin cambios)
                        />
                        {/* ... (resto de las pantallas) */}
                    </>
                ) : (
                    // Si no, muestra solo Login
                    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

// El componente principal ahora solo renderiza el Provider y el Navegador
export default function Navigation() {
    return (
        <UserProvider>
            <AppNavigator />
        </UserProvider>
    );
}

const styles = StyleSheet.create({
    header: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 45
    },
    logoOrange: {
        color: '#FFA500',
    },
    logoBlack: {
        color: '#000'
    }
});