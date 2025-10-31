import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../app/WelcomeScreen';
import Login from '../form/Login';

const Stack = createStackNavigator();

const NavigationHandler = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Welcome'>
                <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default NavigationHandler

const styles = StyleSheet.create({})