import { SafeAreaView, View, Text, Image, Button, Alert } from 'react-native';
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Link, router } from 'expo-router';

import styles from './styles';
import { signupUser } from '../api/auth';
import { AuthorizationInputField } from '../components/inputFields';
import { AuthorizationButton } from '../components/Buttons';


export default function DetailsScreen() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

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

        // Navigate to homepage
        router.dismissTo('/(home)/home')
        return
      }
    } catch(err: any) {
      Alert.alert('Error signing up: ', err.message)
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
        <View style={styles.inputFieldContainer}>
          <AuthorizationInputField 
            input={email}
            placeholderText='Email@email.com'
            handleChange={setEmail}
          />
          <AuthorizationInputField 
            input={username} 
            placeholderText='Username'
            handleChange={setUsername}
          />
          <AuthorizationInputField 
            input={password} 
            placeholderText='Password'
            securedTextEntry={true}
            handleChange={setPassword}
          />
        </View>

        <View style={styles.buttonContainer}> 
          <AuthorizationButton
            text='Sign up'
            height={50}
            width={175}
            color='#0FBE41'
            pressedColor='#098b2eff'
            onPress={() => handleSignup(email, username, password)}
          />
          <Text style={styles.choiceText}>Already have an account?</Text>
          <AuthorizationButton
            text='Log in'
            height={50}
            width={175}
            color='#A0A0A0'
            pressedColor='#818181ff'
            onPress={() => router.dismissTo('/login')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
