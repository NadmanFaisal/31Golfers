import { SafeAreaView, View, Image, Button, Alert } from 'react-native';
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Link, router } from 'expo-router';

import styles from './styles';
import { loginUser } from '../api/auth';
import { AuthorizationInputField } from '../components/inputFields';


export default function DetailsScreen() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  /**
  * Handles the user login process:
  * - Validates required input fields
  * - Sends login request to backend
  * - Stores the JWT token securely on success
  * - Alerts the user in case of error
  */
  const handleLogin = async (email: string, password: string) => {
    if(email === '' || password === '') {
      Alert.alert('Important fields cannot be empty.')
      return
    }
    try {
      const response = await loginUser(email, password)

      // Upon successful signing up
      if(response.status === 200) {
        console.log('Login response:', response.data.user)

        // Stores the token for future authorization
        SecureStore.setItem('token', response.data.token)

        // Navigate to homepage
        router.dismissTo('/(home)/home')
        return
      }
    } catch(err: any) {
      Alert.alert('Error login in: ', err.message)
      return
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        <View style={styles.logoContainer}>
          <Image 
            style={styles.logo} 
            source={
              require('../../assets/images/Logo background.png')
            } 
            resizeMode='contain'
          />
        </View>
        <AuthorizationInputField 
          input={email} 
          handleChange={setEmail}
        />
        <AuthorizationInputField 
          input={password} 
          handleChange={setPassword}
        />

        <Button
          onPress={() => handleLogin(email, password)}
          title="Login"
          color="#841584"
          accessibilityLabel="Sign up as a user!"
        />
        <Link href='./signup'>Or signup</Link>
        
      </View>
    </SafeAreaView>
  );
}
