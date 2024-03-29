import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Button, TextInput, HelperText } from 'react-native-paper';
import { updateUserPassword } from '../../../api';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/userSlice';
import { useStateWithValidation } from '../../../hooks';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
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
    },
});

export default ({  navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    
    const [oldPassword, setOldPassword, isOldPasswordValid] = useStateWithValidation('');
    const [newPassword, setNewPassword, isNewPasswordValid] = useStateWithValidation('', value => value.length >= 8);
    const [confirmNewPassword, setConfirmNewPassword, isConfirmNewPasswordValid] = useStateWithValidation('', value => value === newPassword);

    const [oldPasswordSecure, setOldPasswordSecure] = useState(true);
    const [newPasswordSecure, setNewPasswordSecure] = useState(true);
    const [confirmNewPasswordSecure, setConfirmNewPasswordSecure] = useState(true);

    const [errorMsg, setErrorMsg] = useState('');

    const user = useSelector(selectUser);
    
    const handleSubmit = async () => {
        setIsLoading(true);
        
        try {
            const result = await updateUserPassword({ 
                email: user.info?.email, 
                password: oldPassword,
                newPassword, 
            });
            if (result) {
                Alert.alert(
                    '更改成功!!', 
                    '回到上一頁...', 
                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
            }
            setIsLoading(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setErrorMsg('');
        } catch (error) {
            setIsLoading(false);
            console.log('Changing password:', error.response.data.message);
            setErrorMsg(error.response.data.message);
        }
    };

    return (
        <View style={styles.root}>
            <HelperText type='error' style={{ fontSize: 15 }}>
                {errorMsg}
            </HelperText>
            <TextInput
                mode='outlined'
                label='舊密碼'
                error={!isOldPasswordValid}
                disabled={isLoading}
                secureTextEntry={oldPasswordSecure}
                style={styles.input}
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
                {isOldPasswordValid ? '' : '不可為空!'}
            </HelperText>
            <TextInput
                mode='outlined'
                label='新密碼'
                error={!isNewPasswordValid}
                disabled={isLoading}
                secureTextEntry={newPasswordSecure}
                style={styles.input}
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
                {isNewPasswordValid ? '' : '必須為8個以上的英文字母或數字!'}
            </HelperText>
            <TextInput
                mode='outlined'
                label='確認新密碼'
                error={!isConfirmNewPasswordValid}
                disabled={isLoading}
                secureTextEntry={confirmNewPasswordSecure}
                style={styles.input}
                onChangeText={text => setConfirmNewPassword(text)}
                right={
                    <TextInput.Icon 
                        name={confirmNewPasswordSecure ? 'eye-off' : 'eye'} 
                        onPress={() => setConfirmNewPasswordSecure(!confirmNewPasswordSecure)}
                    />
                }
            />
            <HelperText 
                type='error' 
                style={styles.helpertext}
            >
                {isConfirmNewPasswordValid ? '' : '與新密碼不相符!'}
            </HelperText>
            <Button
                mode='contained'
                disabled={
                    isLoading
                    || !oldPassword
                    || !newPassword
                    || !confirmNewPassword
                    || !isOldPasswordValid
                    || !isNewPasswordValid
                    || !isConfirmNewPasswordValid
                }
                loading={isLoading}
                dark
                style={styles.submitbtn}
                contentStyle={{ width: '100%', height: '100%' }}
                onPress={handleSubmit}
            >
                更改
            </Button>
        </View>
    );
};