import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { deleteUser } from '../../api';

export default ({ navigation }) => {
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
                placeholder='帳號名稱'
                placeholderTextColor='gray'
                disabled={isLoading}
                style={{ margin: 10, }}
                value={username}
                onChangeText={setUsername}
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