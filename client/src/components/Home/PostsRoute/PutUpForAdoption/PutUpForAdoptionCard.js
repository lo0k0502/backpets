import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { View } from 'react-native';
import {
    Avatar,
    Button,
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
import Tag from '../Tag';

export default ({
    putUpForAdoption,
    tagSelected = false,
    setEditPutUpForAdoption = () => {},
    setEditPutUpForAdoptionDialog = () => {},
}) => {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const user = useSelector(selectUser);
    const { pet } = usePet(putUpForAdoption.petId);
    const { user: poster } = useUser(pet?.userId);

    const [menu, setMenu] = useState(false);

    return (
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
                            source={{ uri: poster.photoId ? `${SERVERURL}/image/${poster.photoId}` : null }}
                            style={{ backgroundColor: 'white' }}
                        />
                    )}
                    right={props => (
                        user.info?._id === poster._id ? (
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
                                <Menu.Item
                                    title='編輯貼文'
                                    onPress={() => {
                                        setMenu(false);
                                        setEditPutUpForAdoption(putUpForAdoption);
                                        setEditPutUpForAdoptionDialog(true);
                                    }}
                                />
                                <Menu.Item title='刪除貼文' titleStyle={{ color: 'red' }} onPress={() => {}} />
                            </Menu>
                        ) : null
                    )}
                />
                {
                    pet?.photoId ? (
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
                    {pet?.name}
                </Subheading>
                <Subheading style={{ padding: 10 }}>
                    <Text style={{ color: colors.primary }}>品種: </Text>
                    {pet?.breed}
                </Subheading>
                <Subheading style={{ padding: 10 }}>
                    <Text style={{ color: colors.primary }}>性別: </Text>
                    {pet?.gender}
                </Subheading>
                <Subheading style={{ padding: 10 }}>
                    <Text style={{ color: colors.primary }}>特徵: </Text>
                    {pet?.feature}
                </Subheading>
                <Subheading style={{ padding: 10 }}>
                    <Text style={{ color: colors.primary }}>是否結紮: </Text>
                    {pet?.ligated ? '是' : '否'}
                </Subheading>
                <Subheading style={{ padding: 10 }}>
                    <Text style={{ color: colors.primary }}>年齡: </Text>
                    {pet?.age?.toString()}
                </Subheading>
                {
                    pet?.microchip ? (
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
                {
                    pet?.tag ? (
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
                    icon='map-marker-outline'
                    dark
                    style={{ flexGrow: 1 }}
                    theme={{ roundness: 0 }}
                    onPress={() => navigation.navigate('Map', { location: putUpForAdoption.location })}
                >
                    前往地圖
                </Button>
            </Card.Actions>
        </Card>
    );
};