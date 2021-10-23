import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: 'white',
    },
});

export default ({ route, navigation }) => {
    const isHome = route.name === 'Home';
    const isChangePassword = route.name === 'ChangePassword';
    const isEditProfile = route.name === 'EditProfile';

    return (
        <Appbar style={styles.appbar}>
            {isHome ? <Appbar.Action icon='menu' onPress={navigation.toggleDrawer} />
                : <Appbar.Action icon='arrow-left' onPress={navigation.goBack} />}
            <Appbar.Content 
                title={isHome ? 'ProjectP!!!' : 
                    isChangePassword ? 'Change Password' :
                    isEditProfile ? 'Edit Profile' : route.name
                } 
                subtitle={isHome ? 'P!!!' : ''} 
            />
        </Appbar>
    );
};