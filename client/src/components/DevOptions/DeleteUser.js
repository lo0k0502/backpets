import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { deleteUser } from '../../api/index';

const DeleteUser = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async () => {
        if (!username || !password) return;
        console.log(username, password);
        try {
            const res = await deleteUser({ username, password });
            console.log('here');
            console.log(res.data.success);
        } catch (error) {
            setErrorMsg(error.response.data.message);
        }
    };

    return (
        <View style={{ flex: 1, }}>
            <HelperText
                type='error'
                visible={errorMsg}
            >
                {errorMsg}
            </HelperText>
            <TextInput 
                placeholder='Username'
                placeholderTextColor='gray'
                style={{ borderWidth: 2, }}
                value={username}
                onChangeText={(text) => setUsername(text)}
            />
            <TextInput 
                placeholder='Password'
                placeholderTextColor='gray'
                style={{ borderWidth: 2, }}
                value={password}
                onChangeText={(text) => setPassword(text)}
            />
            <Button
                mode='contained'
                onPress={handleSubmit}
            >
                Delete
            </Button>
        </View>
    );
};

export default DeleteUser;