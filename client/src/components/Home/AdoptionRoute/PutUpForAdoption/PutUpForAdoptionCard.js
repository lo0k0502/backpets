import React, { useState } from 'react';
import moment from 'moment';
import { View } from 'react-native';
import {
    Avatar,
    Button,
    Caption,
    Card,
    Divider,
    IconButton,
    Menu,
    Paragraph,
    Subheading,
    Text,
    useTheme,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import { SERVERURL } from '../../../../api/API';
import { usePet, useUser } from '../../../../hooks';
import { selectUser } from '../../../../redux/userSlice';
import Tag from '../../../common/Tag';
import { isEmptyObject } from '../../../../utils';
import { Skeleton } from '../../Skeleton';
import PostSubheading from '../../../common/PostSubheading';

export default ({
    putUpForAdoption,
    tagSelected = false,
    setEditPutUpForAdoption = () => {},
    setPutUpForAdoptionDialog = () => {},
    setViolationReportDialog = () => {},
    setEditPutUpForAdoptionPoster = () => {},
    onCompletePress = () => {},
    onAdoptPress = () => {},
}) => {
    const user = useSelector(selectUser);
    const { colors } = useTheme();
    const { pet, isFetching: isFetchingPet } = usePet(putUpForAdoption.petId);
    const { user: poster, isFetching: isFetchingPoster } = useUser(putUpForAdoption.userId);

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
                    subtitle={moment(putUpForAdoption.post_time).fromNow()} 
                    left={props => (
                        <Avatar.Image
                            {...props}
                            source={{ uri: `${SERVERURL}/image/${poster.photoId}` }}
                            style={{ backgroundColor: 'white' }}
                        />
                    )}
                    right={props => (
                        <View {...props} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Caption>{putUpForAdoption.completed ? '已完成' : '未完成'}</Caption>
                            <Menu
                                {...props}
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
                                    user.info._id === poster._id ? (
                                        <>
                                            <Menu.Item
                                                title='編輯貼文'
                                                onPress={() => {
                                                    setMenu(false);
                                                    setEditPutUpForAdoption(putUpForAdoption);
                                                    setPutUpForAdoptionDialog(true);
                                                }}
                                            />
                                            <Menu.Item title='刪除貼文' titleStyle={{ color: 'red' }} onPress={() => {}} />
                                        </>
                                    ) : (
                                        <Menu.Item
                                            title='檢舉貼文'
                                            titleStyle={{
                                                color: 'red',
                                            }}
                                            onPress={() => {
                                                setMenu(false);
                                                setEditPutUpForAdoption(putUpForAdoption);
                                                setEditPutUpForAdoptionPoster(poster);
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
                <PostSubheading label='性別'>
                    {pet.gender}
                </PostSubheading>
                <PostSubheading label='特徵'>
                    {pet.feature}
                </PostSubheading>
                <PostSubheading label='是否結紮'>
                    {pet.ligated ? '是' : '否'}
                </PostSubheading>
                <PostSubheading label='年齡'>
                    {pet.age.toString()}
                </PostSubheading>
                {
                    pet.microchip ? (
                        <PostSubheading label='寵物晶片號碼'>
                            {pet?.microchip}
                        </PostSubheading>
                    ) : null
                }
                {
                    putUpForAdoption.content ? (
                        <Paragraph style={{ padding: 10 }}>
                            <Subheading style={{ color: colors.primary }}>{'補充:\n'}</Subheading>
                            {putUpForAdoption.content}
                        </Paragraph>
                    ) : null
                }
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingBottom: 10 }}>
                    <Tag tag={{ name: pet.tag, selected: tagSelected }} />
                </View>
                <PostSubheading label='地區'>
                    {putUpForAdoption.county}{putUpForAdoption.district}
                </PostSubheading>
                <PostSubheading label='電話'>
                    {putUpForAdoption.phone}
                </PostSubheading>
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
                {
                    poster._id === user.info?._id ? (
                        <Button
                            dark
                            disabled={putUpForAdoption.completed}
                            style={{ flexGrow: 1 }}
                            theme={{ roundness: 0 }}
                            onPress={onCompletePress}
                        >
                            完成送養
                        </Button>
                    ) : (
                        <Button
                            dark
                            style={{ flexGrow: 1 }}
                            theme={{ roundness: 0 }}
                            onPress={onAdoptPress}
                        >
                            我要領養
                        </Button>
                    )
                }
            </Card.Actions>
        </Card>
    ) : <Skeleton />;
};