import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Avatar, Paragraph, Title, TouchableRipple, Button, useTheme, Text, Subheading } from 'react-native-paper';
import moment from 'moment';
import { useUser } from '../../../../hooks';
import { SERVERURL } from '../../../../api/API';
import Tag from '../Tag';

const styles = StyleSheet.create({
    card: {
        margin: 20,
        justifyContent: 'center',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderTopWidth: 5,
        borderTopColor: '#be9a78',
        overflow: 'hidden',
    },
    cardAction: { 
        flexDirection: 'column', 
        alignItems: 'flex-start', 
        padding: 0,
    },
    acceptButton: { 
        width: '100%', 
        borderRadius: 0, 
        flexGrow: 1,
    },
});

export default ({ mission }) => {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const poster = useUser(mission.userId);

    return (
        <Card style={ styles.card }>
            <TouchableRipple 
                style={{ width: '100%' }}
                onPress={() => navigation.navigate('Post', { post: mission })}
            >
                <View>
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
                    <Title style={{ padding: 10 }}>{mission.title}</Title>
                    <Subheading style={{ padding: 10 }}>品種: {mission.breed}</Subheading>
                    <Subheading style={{ padding: 10 }}>特徵: {mission.feature}</Subheading>
                    <Subheading style={{ padding: 10 }}>遺失時間: {(new Date(mission.lost_time)).toISOString().replace('T', ' ').slice(0, -8)}</Subheading>
                    <Pressable
                        style={{ margin: 10 }}
                        onPress={() => navigation.navigate('Map', { location: mission.location })}
                    >
                        <Subheading
                            style={{
                                color: colors.primary,
                                borderBottomWidth: 1,
                                borderColor: colors.primary,
                                alignSelf: 'flex-start',
                            }}
                        >
                            前往地圖
                        </Subheading>
                    </Pressable>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Tag tag={{ name: mission.tag, selected: true }} />
                    </View>
                    <Paragraph style={{ padding: 10 }}>{mission.content}</Paragraph>
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
                </View>
            </TouchableRipple>
            <Card.Actions style={styles.cardAction}>
                <Button
                    mode='contained'
                    color={colors.primary}
                    dark
                    style={styles.acceptButton}
                    onPress={() => {}}
                >
                    執行
                </Button>
            </Card.Actions>
        </Card>
    );
};