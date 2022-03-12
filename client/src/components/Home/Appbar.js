import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, TextInput, useTheme } from 'react-native-paper';

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: 'white',
    },
});

export default ({ route, navigation }) => {
    const isChangePassword = route.name === 'ChangePassword';
    const isEditProfile = route.name === 'EditProfile';

    return (
        <Appbar style={styles.appbar}>
            <Appbar.Action icon='arrow-left' onPress={() => isChangePassword || isEditProfile ? navigation.navigate('Profile') : navigation.goBack()} />
            <Appbar.Content 
                title={isChangePassword ? '更改密碼' :
                    isEditProfile ? '更改個人資料' : route.name
                }
            />
        </Appbar>
    );
};