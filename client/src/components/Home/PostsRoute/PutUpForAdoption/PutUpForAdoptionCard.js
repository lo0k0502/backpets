import React, { useState } from 'react';
import moment from 'moment';
import { View } from 'react-native';
import {
    Avatar,
    Card,
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
import Tag from '../Tag';
import { isEmptyObject } from '../../../../utils';
import { Skeleton } from '../../Skeleton';

export default ({
    putUpForAdoption,
    tagSelected = false,
    setEditPutUpForAdoption = () => {},
    setPutUpForAdoptionDialog = () => {},
    setViolationReportDialog = () => {},
    setEditPutUpForAdoptionPoster = () => {},
}) => {
    const { colors } = useTheme();
    const user = useSelector(selectUser);
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
                <Subheading style={{ padding: 10 }}>
                    <Text style={{ color: colors.primary }}>寵物名稱: </Text>
                    {pet.name}
                </Subheading>
                <Subheading style={{ padding: 10 }}>
                    <Text style={{ color: colors.primary }}>品種: </Text>
                    {pet.breed}
                </Subheading>
                <Subheading style={{ padding: 10 }}>
                    <Text style={{ color: colors.primary }}>性別: </Text>
                    {pet.gender}
                </Subheading>
                <Subheading style={{ padding: 10 }}>
                    <Text style={{ color: colors.primary }}>特徵: </Text>
                    {pet.feature}
                </Subheading>
                <Subheading style={{ padding: 10 }}>
                    <Text style={{ color: colors.primary }}>是否結紮: </Text>
                    {pet.ligated ? '是' : '否'}
                </Subheading>
                <Subheading style={{ padding: 10 }}>
                    <Text style={{ color: colors.primary }}>年齡: </Text>
                    {pet.age.toString()}
                </Subheading>
                {
                    pet.microchip ? (
                        <Subheading style={{ padding: 10 }}>
                            <Text style={{ color: colors.primary }}>寵物晶片號碼: </Text>
                            {pet?.microchip}
                        </Subheading>
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
                <Subheading style={{ padding: 10 }}>
                    <Text style={{ color: colors.primary }}>地區: </Text>
                    {putUpForAdoption.county}{putUpForAdoption.district}
                </Subheading>
                <Subheading style={{ padding: 10 }}>
                    <Text style={{ color: colors.primary }}>電話: </Text>
                    {putUpForAdoption.phone}
                </Subheading>
            </View>
        </Card>
    ) : <Skeleton />;
};