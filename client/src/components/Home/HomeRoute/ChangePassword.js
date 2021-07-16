import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, TextInput, HelperText } from 'react-native-paper';
import { updateUserPassword } from '../../../api';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    title: {
        fontSize: 40,
        marginTop: -50,
        marginBottom: 50,
    },
    input: {
        width: '60%',
        margin: 20,
    },
    helpertext: { 
        marginTop: -20, 
    },
    submitbtn: {
        width: '60%',
        height: 50,
        marginTop: 50,
        elevation: 5,
    },
});

const ChangePassword = ({ user }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [errorMsg, setErrorMsg] = useState('');
    const [oldPasswordErrorMsg, setOldPasswordErrorMsg] = useState('');
    const [newPasswordErrorMsg, setNewPasswordErrorMsg] = useState('');

    const checkOldPassword = (text) => {
        setOldPassword(text);
        setOldPasswordErrorMsg(text ? '' : 'Must not be null!')
    };

    const checkNewPassword = (text) => {
        setNewPassword(text);
        setNewPasswordErrorMsg(text.length >= 8 ? '' : 'Must be at least 8 letters!')
    };

    const handleSubmit = async () => {
        if (!oldPassword || !newPassword) {
            if (!oldPassword) setOldPasswordErrorMsg('Must not be null!');
            if (!newPassword) setNewPasswordErrorMsg('Must not be null!');
            return
        }
        if (oldPasswordErrorMsg || newPasswordErrorMsg) return;

        try {
            const result = 
                await updateUserPassword({ 
                    username: user.result.username, 
                    password: oldPassword,
                    newPassword, 
                });
        } catch (error) {
            console.log(error.response.data);
            setErrorMsg(error.response.data.message);
        }
    };

    return (
        <View style={styles.root}>
            <Text style={styles.title}>
                Change Password
            </Text>
            <HelperText
                type='error'
                style={{ 
                    fontSize: 16, 
                    marginBottom: -20,
                }}
            >
                {errorMsg}
            </HelperText>
            <TextInput
                mode='outlined'
                placeholder='Old Password'
                placeholderTextColor='gray'
                error={oldPasswordErrorMsg}
                style={styles.input}
                onChangeText={(text) => checkOldPassword(text)}
            />
            <HelperText 
                type='error' 
                style={styles.helpertext}
            >
                {oldPasswordErrorMsg}
            </HelperText>
            <TextInput
                mode='outlined'
                placeholder='New Password'
                placeholderTextColor='gray'
                error={newPasswordErrorMsg}
                style={styles.input}
                onChangeText={(text) => checkNewPassword(text)}
            />
            <HelperText 
                type='error' 
                style={styles.helpertext}
            >
                {newPasswordErrorMsg}
            </HelperText>
            <Button
                mode='contained'
                style={styles.submitbtn}
                contentStyle={{ width: '100%', height: '100%' }}
                onPress={handleSubmit}
            >
                Submit
            </Button>
        </View>
    );
};

export default ChangePassword;