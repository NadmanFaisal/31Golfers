import { SafeAreaView, View, Text, Image, Button, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

import { signupUser } from '../api/auth';
import { AuthorizationInputField } from '../components/inputFields';

import styles from './styles';

export default function DetailsScreen() {

  /**
  * Handles the user signup process:
  * - Validates required input fields
  * - Sends signup request to backend
  * - Stores the JWT token securely on success
  * - Alerts the user in case of error
  */
  const handleSignup = async (email: string, username: string, password: string) => {
    if(email === '' || username === '' || password === '') {
      Alert.alert('Important fields cannot be empty.')
      return
    }
    try {
      const response = await signupUser(email, username, password)

      // Upon successful signing up
      if(response.status === 201) {
        console.log('Signup response:', response.data.newUser)

        // Stores the token for future authorization
        SecureStore.setItem('token', response.data.token)
        return
      }
    } catch(err: any) {
      Alert.alert('Error signing up: ', err.message)
      return
    }
  }

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

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
          input={username} 
          handleChange={setUsername}
        />
        <AuthorizationInputField 
          input={password} 
          handleChange={setPassword}
        />

        <Button
          onPress={() => handleSignup(email, username, password)}
          title="Sign up"
          color="#841584"
          accessibilityLabel="Sign up as a user!"
        />
      </View>
    </SafeAreaView>
  );
}
