import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 50,
        marginTop: -100,
        marginBottom: 50,
    },
    input: {
        width: '60%',
        margin: 20,
    },
    btn: {
        width: '60%',
        height: 50,
        marginTop: 50,
        elevation: 5,
    },
});

const Register = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordSecure, setPasswordSecure] = useState(true);
    const [confirmPasswordSecure, setConfirmPasswordSecure] = useState(true);

    const handleSubmit = () => {
        navigation.push('Login');
    };

    return (
        <View style={styles.root}>
            <Text style={styles.title}>
                Register
            </Text>
            <TextInput 
                mode='outlined'
                placeholder='Username'
                placeholderTextColor='gray'
                value={username}
                style={styles.input} 
                onChangeText={(text) => setUsername(text)}
            />
            <TextInput 
                mode='outlined'
                placeholder='E-mail'
                placeholderTextColor='gray'
                value={email}
                style={styles.input} 
                onChangeText={(text) => setEmail(text)}
            />
            <TextInput 
                mode='outlined'
                placeholder='Password'
                placeholderTextColor='gray'
                secureTextEntry={passwordSecure}
                value={password}
                style={styles.input} 
                onChangeText={(text) => setPassword(text)}
                right={
                    <TextInput.Icon 
                        name={passwordSecure ? 'eye-off' : 'eye'} 
                        onPress={() => setPasswordSecure(!passwordSecure)}
                    />
                }
            />
            <TextInput 
                mode='outlined'
                placeholder='ConfirmPassword'
                placeholderTextColor='gray'
                secureTextEntry={confirmPasswordSecure}
                value={confirmPassword}
                style={styles.input} 
                onChangeText={(text) => setConfirmPassword(text)}
                right={
                    <TextInput.Icon 
                        name={confirmPasswordSecure ? 'eye-off' : 'eye'} 
                        onPress={() => setConfirmPasswordSecure(!confirmPasswordSecure)}
                    />
                }
            />
            <Button 
                mode='contained'
                color='dodgerblue'
                style={styles.btn}
                contentStyle={{ width: '100%', height: '100%', }}
                onPress={handleSubmit}
            >
                Sign Up
            </Button>
        </View>
    );
};

export default Register;