import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Avatar, Paragraph, Button, useTheme, Text, Subheading, Divider, Caption } from 'react-native-paper';
import moment from 'moment';
import { usePet, useUser } from '../../../../hooks';
import { SERVERURL } from '../../../../api/API';
import Tag from '../Tag';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../redux/userSlice';

export default ({
    mission,
    tagSelected = false,
    setClueDialog = () => {},
    onViewCluePress = () => {},
}) => {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const user = useSelector(selectUser);
    const { pet } = usePet(mission.petId);
    const { user: poster } = useUser(pet?.userId);

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
                    subtitle={moment(mission.post_time).fromNow()} 
                    left={props => (
                        <Avatar.Image
                            {...props}
                            source={{ uri: poster.photoId ? `${SERVERURL}/image/${poster.photoId}` : null }}
                            style={{ backgroundColor: 'white' }}
                        />
                    )}
                    right={props => <Caption {...props}>{mission.completed ? '已完成' : '未完成'}</Caption>}
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
                    <Text style={{ color: colors.primary }}>品種: </Text>
                    {pet?.breed}
                </Subheading>
                <Subheading style={{ padding: 10 }}>
                    <Text style={{ color: colors.primary }}>特徵: </Text>
                    {pet?.feature}
                </Subheading>
                <Subheading style={{ padding: 10 }}>
                    <Text style={{ color: colors.primary }}>性別: </Text>
                    {pet?.gender}
                </Subheading>
                <Subheading style={{ padding: 10 }}>
                    <Text style={{ color: colors.primary }}>遺失時間: </Text>
                    {(new Date(mission.lost_time)).toISOString().replace('T', ' ').slice(0, -8)}
                </Subheading>
                {
                    mission.content ? (
                        <Paragraph style={{ padding: 10 }}>
                            <Subheading style={{ color: colors.primary }}>{'補充:\n'}</Subheading>
                            {mission.content}
                        </Paragraph>
                    ) : null
                }
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingBottom: 10 }}>
                    <Tag tag={{ name: pet?.tag, selected: tagSelected }} />
                </View>
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
                    style={{ flexGrow: 1, borderRightWidth: 0.5, borderColor: colors.primary }}
                    theme={{ roundness: 0 }}
                    onPress={() => (
                        user.info?._id === poster._id ? onViewCluePress() : setClueDialog(true)
                    )}
                >
                    {user.info?._id === poster._id ? '檢視線索' : '回報線索'}
                </Button>
                <Button
                    icon='map-marker-outline'
                    dark
                    style={{ flexGrow: 1, borderLeftWidth: 0.5, borderColor: colors.primary }}
                    theme={{ roundness: 0 }}
                    onPress={() => navigation.navigate('Map', { location: mission.location })}
                >
                    前往地圖
                </Button>
            </Card.Actions>
        </Card>
    );
};