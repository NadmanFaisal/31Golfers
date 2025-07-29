import React from "react";
import { Button, SafeAreaView, Text } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { router } from "expo-router";

export default function HomeScreen () {
    const handleLogout = async () => {
        SecureStore.deleteItemAsync('token')
        router.dismissTo('/(auth)/login')
    }
    return (
        <SafeAreaView>
            <Text>Hii</Text>
            <Button
              onPress={() => handleLogout()}
              title="Login"
              color="#841584"
              accessibilityLabel="Sign up as a user!"
            />
        </SafeAreaView>
    )
}