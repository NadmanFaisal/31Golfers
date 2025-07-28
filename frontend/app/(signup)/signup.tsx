import { SafeAreaView, View, Text, StyleSheet, Image } from 'react-native';

import styles from './styles';

export default function DetailsScreen() {
  return (
    <SafeAreaView>
        <View style={styles.mainContainer}>
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/images/Logo background.png')} />
            </View>
        </View>
    </SafeAreaView>
  );
}
