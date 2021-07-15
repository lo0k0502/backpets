import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { deleteUser } from '../../api';

const DeleteUser = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!username) return;
        try {
            setIsLoading(true);
            const res = await deleteUser({ username });
            if (res.data.success) navigation.goBack();
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setErrorMsg(error.response.data.message);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', }}>
            <HelperText
                type='error'
                visible={errorMsg}
            >
                {errorMsg}
            </HelperText>
            <TextInput 
                mode='outlined'
                placeholder='Username'
                placeholderTextColor='gray'
                disabled={isLoading}
                style={{ margin: 10, }}
                value={username}
                onChangeText={(text) => setUsername(text)}
            />
            <Button
                mode='contained'
                loading={isLoading}
                onPress={handleSubmit}
            >
                Delete
            </Button>
        </View>
    );
};

export default DeleteUser;