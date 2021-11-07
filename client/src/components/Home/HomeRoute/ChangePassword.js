import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { Button, TextInput, HelperText } from 'react-native-paper';
import { updateUserPassword } from '../../../api';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/userSlice';
import { useStateWithValidation } from '../../../hooks';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    title: {
        fontSize: 40,
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
        backgroundColor: 'red',
        marginTop: 50,
        elevation: 5,
    },
});

export default ({  navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    
    const [oldPassword, setOldPassword, isOldPasswordValid] = useStateWithValidation('');
    const [newPassword, setNewPassword, isNewPasswordValid] = useStateWithValidation('', value => value.length >= 8);

    const [oldPasswordSecure, setOldPasswordSecure] = useState(true);
    const [newPasswordSecure, setNewPasswordSecure] = useState(true);

    const [errorMsg, setErrorMsg] = useState('');

    const user = useSelector(selectUser);
    
    const handleSubmit = async () => {
        if (!oldPassword || !newPassword) {
            if (!oldPassword) setOldPassword('');
            if (!newPassword) setNewPassword('');
            return
        }

        setIsLoading(true);
        
        try {
            const result = await updateUserPassword({ 
                email: user.info?.email, 
                password: oldPassword,
                newPassword, 
            });
            if (result) {
                Alert.alert(
                    'Success!!', 
                    'Password Successfully Updated!!\nGoing back...', 
                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
            }
            setIsLoading(false);
            setOldPassword('');
            setNewPassword('');
            setErrorMsg('');
        } catch (error) {
            setIsLoading(false);
            console.log('Changing password:', error.response.data.message);
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
                    fontSize: 20, 
                    marginBottom: -20,
                }}
            >
                {errorMsg}
            </HelperText>
            <TextInput
                mode='outlined'
                placeholder='Old Password'
                placeholderTextColor='gray'
                error={!isOldPasswordValid}
                disabled={isLoading}
                secureTextEntry={oldPasswordSecure}
                style={styles.input}
                selectionColor='#666'
                theme={{ colors: { primary: 'red' } }}
                onChangeText={text => setOldPassword(text)}
                right={
                    <TextInput.Icon 
                        name={oldPasswordSecure ? 'eye-off' : 'eye'} 
                        onPress={() => setOldPasswordSecure(!oldPasswordSecure)}
                    />
                }
            />
            <HelperText 
                type='error' 
                style={styles.helpertext}
            >
                {isOldPasswordValid ? '' : 'Must not be null!'}
            </HelperText>
            <TextInput
                mode='outlined'
                placeholder='New Password'
                placeholderTextColor='gray'
                error={!isNewPasswordValid}
                disabled={isLoading}
                secureTextEntry={newPasswordSecure}
                style={styles.input}
                selectionColor='#666'
                theme={{ colors: { primary: 'red' } }}
                onChangeText={text => setNewPassword(text)}
                right={
                    <TextInput.Icon 
                        name={newPasswordSecure ? 'eye-off' : 'eye'} 
                        onPress={() => setNewPasswordSecure(!newPasswordSecure)}
                    />
                }
            />
            <HelperText 
                type='error' 
                style={styles.helpertext}
            >
                {isNewPasswordValid ? '' : 'Must be at least 8 letters!'}
            </HelperText>
            <Button
                mode='contained'
                disabled={isLoading}
                loading={isLoading}
                style={styles.submitbtn}
                contentStyle={{ width: '100%', height: '100%' }}
                onPress={handleSubmit}
            >
                Submit
            </Button>
        </View>
    );
};