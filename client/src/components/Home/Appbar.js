import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, TextInput, useTheme } from 'react-native-paper';
import { backIcon } from '../../utils/constants';

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: 'white',
    },
});

export default ({ route, navigation }) => {
    const isPostsTab = route.name === 'PostsTab';
    const isChangePassword = route.name === 'ChangePassword';
    const isEditProfile = route.name === 'EditProfile';

    return (
        <Appbar style={styles.appbar}>
        {
            isPostsTab ? (
                <Appbar.Action icon='menu' onPress={navigation.toggleDrawer} />
            ) : (
                <Appbar.Action icon={backIcon} onPress={navigation.goBack} />
            )
        }
            <Appbar.Content 
                title={isChangePassword ? '更改密碼' : (
                    isEditProfile ? '更改個人資料' : route.name
                )}
            />
        {
            isPostsTab ? (
                <Appbar.Action icon='magnify' onPress={() => navigation.navigate('Search')} />
            ) : null
        }
        </Appbar>
    );
};