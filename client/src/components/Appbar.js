import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: 'white',
    },
});

export default ({ route, navigation }) => {
    const isMission = route.name === 'MissionTab';
    const isChangePassword = route.name === 'ChangePassword';
    const isEditProfile = route.name === 'EditProfile';

    return (
        <Appbar style={styles.appbar}>
            {isMission ? <Appbar.Action icon='menu' onPress={navigation.toggleDrawer} />
                : <Appbar.Action icon='arrow-left' onPress={() => isChangePassword || isEditProfile ? navigation.navigate('Profile') : navigation.goBack()} />}
            <Appbar.Content 
                title={isMission ? 'BackPets' : 
                    isChangePassword ? '更改密碼' :
                    isEditProfile ? '更改個人資料' : route.name
                }
            />
        </Appbar>
    );
};