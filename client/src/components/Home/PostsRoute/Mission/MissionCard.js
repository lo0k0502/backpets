import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Avatar, Paragraph, Title, TouchableRipple, Button, useTheme, Text, Subheading, Divider } from 'react-native-paper';
import moment from 'moment';
import { useUser } from '../../../../hooks';
import { SERVERURL } from '../../../../api/API';
import Tag from '../Tag';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../redux/userSlice';

const styles = StyleSheet.create({
    card: {
        justifyContent: 'center',
        borderRadius: 0,
        borderBottomWidth: 10,
        borderColor: '#be9a78',
        overflow: 'hidden',
    },
});

export default ({ mission, setClueDialog }) => {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const user = useSelector(selectUser);
    const poster = useUser(mission.userId);

    return (
        <Card style={ styles.card }>
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
                />
                <Subheading style={{ padding: 10 }}>
                    <Text style={{ color: colors.primary }}>品種: </Text>
                    {mission.breed}
                </Subheading>
                <Subheading style={{ padding: 10 }}>
                    <Text style={{ color: colors.primary }}>特徵: </Text>
                    {mission.feature}
                </Subheading>
                <Subheading style={{ padding: 10 }}>
                    <Text style={{ color: colors.primary }}>遺失時間: </Text>
                    {(new Date(mission.lost_time)).toISOString().replace('T', ' ').slice(0, -8)}
                </Subheading>
                {
                    mission.photoId ? (
                        <Card.Cover
                            source={{ uri: `${SERVERURL}/image/${mission.photoId}` }}
                            style={{
                                width: 300,
                                height: 200,
                                alignSelf: 'center',
                                marginVertical: 5,
                            }}
                        />
                    ) : null
                }
                {
                    mission.content ? (
                        <Paragraph style={{ padding: 10 }}>
                            <Text style={{ color: colors.primary }}>{'補充:\n'}</Text>
                            {mission.content}
                        </Paragraph>
                    ) : null
                }
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingBottom: 10 }}>
                    <Tag tag={{ name: mission.tag, selected: true }} />
                </View>
                <Divider
                    style={{
                        backgroundColor: colors.primary,
                        width: '100%',
                        height: 1,
                    }}
                />
            </View>
            <Card.Actions style={{ flexDirection: 'row', padding: 0 }}>
                <Button
                    icon='white-balance-sunny'
                    dark
                    style={{ flexGrow: 1 }}
                    theme={{ roundness: 0 }}
                    onPress={() => (
                        user.info?._id === poster._id ? null : setClueDialog(true)
                    )}
                >
                    {user.info?._id === poster._id ? '檢視線索' : '回報線索'}
                </Button>
                <Button
                    icon='map-marker-outline'
                    dark
                    style={{ flexGrow: 1 }}
                    theme={{ roundness: 0 }}
                    onPress={() => navigation.navigate('Map', { location: mission.location })}
                >
                    前往地圖
                </Button>
            </Card.Actions>
        </Card>
    );
};