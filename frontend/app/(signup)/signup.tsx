import { SafeAreaView, View, Text, Image, Button, Alert } from 'react-native';
import { useEffect, useState } from 'react';

import { signupUser } from '../api/auth';
import { AuthorizationInputField } from '../components/inputFields';

import styles from './styles';

export default function DetailsScreen() {

  const handleSignup = async (email: string, username: string, password: string) => {
    if(email === '' || username === '' || password === '') {
      Alert.alert('Important fields cannot be empty.')
      return
    }
    try {
      const response = await signupUser(email, username, password)
      console.log(response.data)
      return
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
