import React, { useEffect, useRef, useState } from 'react';
import { TextInput, View, StyleSheet, Image, Pressable, Text } from 'react-native';
import { Button, Divider } from 'react-native-paper';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    img: {
        width: '60%',
        height: '50%',
        marginBottom: 10,
    },
    inputusername: {
        width: '50%',
        height: 50,
        fontSize: 16,
        borderWidth: 2,
        borderBottomWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        paddingLeft: 5,
        paddingRight: 5,
    },
    inputpassword: {
        width: '50%',
        height: 50,
        fontSize: 16,
        borderWidth: 2,
        borderTopWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        paddingLeft: 5,
        paddingRight: 5,
        marginBottom: 10,
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
                source={require('../../assets/rsz_black-cat-icon-6.png')} 
                style={styles.img}
            />
            <TextInput 
                placeholder='Username'
                placeholderTextColor='gray'
                value={username}
                style={styles.inputusername}
                onChangeText={(text) => setUsername(text)}
            />
            <TextInput 
                placeholder='Password'
                placeholderTextColor='gray'
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
        </View>
    );
};

export default Login;