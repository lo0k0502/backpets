import React from 'react';
import { Appbar } from 'react-native-paper';
import { backIcon } from '../../utils/constants';

export default ({ route, navigation }) => {
    const isPostsTab = route.name === 'PostsTab';
    const isChangePassword = route.name === 'ChangePassword';
    const isEditProfile = route.name === 'EditProfile';
    const isPetPassports = route.name === 'PetPassports';
    const isSelfMissions = route.name === 'SelfMissions';
    const isClue = route.name === 'Clue';
    const isSelfClues = route.name === 'SelfClues';

    const onBackIconPress = () => {
        if (navigation.canGoBack()) return navigation.goBack();
        if (isClue) return navigation.navigate('Profile');
    };

    return (
        <Appbar style={{ backgroundColor: 'white' }}>
        {
            isPostsTab ? (
                <Appbar.Action icon='menu' onPress={navigation.toggleDrawer} />
            ) : (
                <Appbar.Action icon={backIcon} onPress={onBackIconPress} />
            )
        }
            <Appbar.Content
                title={
                    isPostsTab ? 'BackPets' : (
                        isChangePassword ? '更改密碼' : (
                            isEditProfile ? '編輯個人資料' : (
                                isPetPassports ? '寵物護照列表' : (
                                    isSelfMissions ? '發布過的貼文' : (
                                        isClue ? '線索' : (
                                            isSelfClues ? '回報過的線索' : route.name
                                        )
                                    )
                                )
                            )
                        )
                    )
                }
            />
        {
            isPostsTab ? (
                <Appbar.Action icon='magnify' onPress={() => navigation.navigate('Search')} />
            ) : null
        }
        </Appbar>
    );
};