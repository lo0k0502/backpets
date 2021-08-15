import React from 'react';
import { Appbar } from 'react-native-paper';

export default ({ route, navigation }) => {
    const isHome = route.name === 'Home';
    const isPost = route.name === 'Post';
    const isChangePassword = route.name === 'ChangePassword';
    const isEditProfile = route.name === 'EditProfile';

    return (
        <Appbar style={{ backgroundColor: 'white' }}>
            {isHome ? <Appbar.Action icon='menu' onPress={navigation.toggleDrawer} />
                : <Appbar.Action icon='arrow-left' onPress={navigation.goBack} />}
            <Appbar.Content 
                title={isHome ? 'ProjectP!!!' : 
                    isPost ? '' : 
                    isChangePassword ? 'Change Password' :
                    isEditProfile ? 'Edit Profile' : route.name
                } 
                subtitle={isHome ? 'P!!!' : ''} 
            />
            {isPost ? <Appbar.Action icon='dots-horizontal' onPress={() => {}} /> : null}
        </Appbar>
    );
};