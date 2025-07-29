import React, { useEffect, useState } from "react";
import { Button, SafeAreaView, Text } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { router } from "expo-router";

export default function HomeScreen () {

    // JWT Token for authorization
    const [token, setToken] = useState<string | null>('')

    // Fetch the token stored in SecureStore
    useEffect(() => {
        const getToken = () => {
            const fetchedToken = SecureStore.getItem('token')
            setToken(fetchedToken)
            console.log('Token:', token)
        }
        getToken()
    }, [token])

    const handleLogout = () => {
        // Deletes the token for new token to be stored
        SecureStore.deleteItemAsync('token')
        router.dismissTo('/(auth)/login')
    }
    return (
        <SafeAreaView>
            <Text>Hii</Text>
            <Button
              onPress={() => handleLogout()}
              title="Log out"
              color="#841584"
              accessibilityLabel="Sign up as a user!"
            />
        </SafeAreaView>
    )
}