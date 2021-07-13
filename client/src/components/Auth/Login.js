import { createNavigatorFactory } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image, Pressable, Text } from 'react-native';
import { TextInput, Button, Divider } from 'react-native-paper';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    img: {
        width: '60%',
        height: '40%',
        marginBottom: 10,
    },
    inputusername: {
        width: '50%',
        color: 'black',
        backgroundColor: 'white',
    },
    inputpassword: {
        width: '50%',
        marginBottom: 10,
        backgroundColor: 'white',
    },
    loginbtn: {
        width: '50%',
        height: 50,
        color: 'white',
        backgroundColor: 'dodgerblue',
        borderRadius: 10,
        elevation: 5,
    },
    divider: {
        width: '90%',
        borderColor: 'lightgray',
        borderWidth: 1,
        margin: 10,
    },
    signupmsg: {
        flexDirection: 'row',
    },
    signupbtn: {
        marginLeft: 3,
        marginRight: 3,
    },
});

const Login = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.root}>
            <Image 
                source={require('../../../assets/rsz_black-cat-icon-6.png')} 
                style={styles.img}
            />
            <TextInput 
                mode='outlined'
                placeholder='Username'
                placeholderTextColor='gray'
                outlineColor='black'
                underlineColor='black'
                value={username}
                style={styles.inputusername}
                onChangeText={(text) => setUsername(text)}
            />
            <TextInput 
                mode='outlined'
                placeholder='Password'
                placeholderTextColor='gray'
                outlineColor='black'
                underlineColor='black'
                secureTextEntry
                value={password}
                style={styles.inputpassword}
                onChangeText={(text) => setPassword(text)}
            />
            <Button 
                mode='contained'
                style={styles.loginbtn}
                contentStyle={{ width: '100%', height: '100%', }}
                onPress={() => navigation.push('Home')}
            >
                Login
            </Button>
            <Divider style={styles.divider} />
            <View style={styles.signupmsg}>
                <Text>
                    Don't have an account?
                </Text>
                <Pressable 
                    style={styles.signupbtn}
                    onPress={() => navigation.push('Register')}
                >
                    <Text style={{ color: 'dodgerblue' }}>
                        Sign up
                    </Text>
                </Pressable>
            </View>
            <Button
                mode='contained'
                uppercase={false}
                onPress={() => navigation.toggleDrawer()}
            >
                Development Options
            </Button>
        </View>
    );
};

export default Login;