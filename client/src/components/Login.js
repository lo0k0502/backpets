import React, { useEffect, useRef } from 'react';
import { TextInput, View, StyleSheet, Image, Button, Text } from 'react-native';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        width: '60%',
        height: '50%',
        marginBottom: 10,
    },
    inputusername: {
        width: '50%',
        height: 40,
        fontSize: 15,
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
        height: 40,
        fontSize: 15,
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
        width: '30%',
    },
});

const Login = () => {

    return (
        <View style={styles.root}>
            <Image 
                source={require('../../assets/rsz_black-cat-icon-6.png')} 
                style={styles.img}
            />
            <TextInput 
                placeholder="Username"
                placeholderTextColor="black"
                style={styles.inputusername}
            />
            <TextInput 
                placeholder="Password"
                placeholderTextColor="black"
                secureTextEntry={true}
                style={styles.inputpassword}
            />
            <Button title="Login" />
        </View>
    );
};

export default Login;