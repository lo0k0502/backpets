import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    Card,
    Avatar,
    Paragraph,
    Button,
    useTheme,
    Text,
    Subheading,
    Divider,
    Caption,
    IconButton,
    Menu,
} from 'react-native-paper';
import moment from 'moment';
import { usePet, useUser } from '../../../../hooks';
import { SERVERURL } from '../../../../api/API';
import Tag from '../../../common/Tag';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../redux/userSlice';
import { constants, isEmptyObject } from '../../../../utils';
import { Skeleton } from '../../Skeleton';
import PostSubheading from '../../../common/PostSubheading';

export default ({
    mission,
    tagSelected = false,
    onReportCluePress = () => {},
    onViewCluePress = () => {},
    setMissionDialog = () => {},
    setEditMission = () => {},
    setViolationReportDialog = () => {},
    setEditMissionPoster = () => {},
}) => {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const user = useSelector(selectUser);
    const { pet, isFetching: isFetchingPet } = usePet(mission.petId);
    const { user: poster, isFetching: isFetchingPoster } = useUser(pet.userId);

    const [menu, setMenu] = useState(false);

    return !(
        isFetchingPet
        || isFetchingPoster
        || isEmptyObject(pet)
        || isEmptyObject(poster)
        || !user.info?._id
    ) ? (
        <Card
            style={{
                justifyContent: 'center',
                borderRadius: 0,
                borderBottomWidth: 10,
                borderColor: '#be9a78',
                marginHorizontal: '5%',
                elevation: 0,
            }}
        >
            <View style={{ alignItems: 'flex-start' }}>
                <Card.Title
                    title={poster.username}
                    subtitle={moment(mission.post_time).fromNow()}
                    left={props => (
                        <Avatar.Image
                            {...props}
                            source={{ uri: poster.photoId ? `${SERVERURL}/image/${poster.photoId}` : null }}
                            style={{ backgroundColor: 'white' }}
                        />
                    )}
                    right={props => (
                        <View {...props} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Caption>{mission.completed ? '已完成' : '未完成'}</Caption>
                            <Menu
                                visible={menu}
                                onDismiss={() => setMenu(false)}
                                anchor={(
                                    <IconButton
                                        icon='dots-vertical'
                                        size={30}
                                        onPress={() => setMenu(true)}
                                    />
                                )}
                                theme={{ roundness: 0 }}
                            >
                                {
                                    user.info?._id === poster._id ? (
                                        <>
                                            <Menu.Item
                                                title='編輯任務'
                                                onPress={() => {
                                                    setMenu(false);
                                                    setEditMission(mission);
                                                    setMissionDialog(true);
                                                }}
                                            />
                                            <Menu.Item title='刪除任務' titleStyle={{ color: 'red' }} onPress={() => {}} />
                                        </>
                                    ) : (
                                        <Menu.Item
                                            title='檢舉貼文'
                                            titleStyle={{
                                                color: 'red',
                                            }}
                                            onPress={() => {
                                                setMenu(false);
                                                setEditMission(mission);
                                                setEditMissionPoster(poster);
                                                setViolationReportDialog(true);
                                            }}
                                        />
                                    )
                                }
                            </Menu>
                        </View>
                    )}
                />
                {
                    pet.photoId ? (
                        <Avatar.Image
                            source={{ uri: `${SERVERURL}/image/${pet.photoId}` }}
                            size={200}
                            style={{
                                alignSelf: 'center',
                                marginVertical: 5,
                            }}
                        />
                    ) : null
                }
                <PostSubheading label='寵物名稱'>
                    {pet.name}
                </PostSubheading>
                <PostSubheading label='品種'>
                    {pet.breed}
                </PostSubheading>
                <PostSubheading label='特徵'>
                    {pet.feature}
                </PostSubheading>
                <PostSubheading label='性別'>
                    {pet.gender}
                </PostSubheading>
                <PostSubheading label='遺失時間'>
                    {(new Date(mission.lost_time)).toISOString().replace('T', ' ').slice(0, -8)}
                </PostSubheading>
                {
                    mission.content ? (
                        <Paragraph style={{ padding: 10 }}>
                            <Subheading style={{ color: colors.primary }}>{'補充:\n'}</Subheading>
                            {mission.content}
                        </Paragraph>
                    ) : null
                }
                {
                    pet.tag ? (
                        <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingBottom: 10 }}>
                            <Tag tag={{ name: pet.tag, selected: tagSelected }} />
                        </View>
                    ) : null
                }
                <Divider
                    style={{
                        backgroundColor: colors.primary,
                        width: '95%',
                        height: 1,
                        alignSelf: 'center',
                    }}
                />
            </View>
            <Card.Actions style={{ flexDirection: 'row', padding: 0 }}>
                <Button
                    icon='lightbulb-on-outline'
                    dark
                    disabled={user.info?._id !== poster._id && mission.completed}
                    style={{ flexGrow: 1, borderRightWidth: 0.5, borderColor: colors.primary }}
                    theme={{ roundness: 0 }}
                    onPress={() => (
                        user.info?._id === poster._id ? onViewCluePress() : onReportCluePress()
                    )}
                >
                    {user.info?._id === poster._id ? '檢視線索' : '回報線索'}
                </Button>
                <Button
                    icon='map-marker-outline'
                    dark
                    style={{ flexGrow: 1, borderLeftWidth: 0.5, borderColor: colors.primary }}
                    theme={{ roundness: 0 }}
                    onPress={() => navigation.navigate(constants.pageNames[1], { location: mission.location })}
                >
                    前往地圖
                </Button>
            </Card.Actions>
        </Card>
    ) : <Skeleton />;
};