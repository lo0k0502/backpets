import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import { View } from 'react-native';
import { Avatar, Button, Card, Divider, Paragraph, Subheading, Text, useTheme } from 'react-native-paper';
import { SERVERURL } from '../../../../api/API';
import { useUser } from '../../../../hooks';
import Tag from '../Tag';

export default ({ putUpForAdoption }) => {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const poster = useUser(putUpForAdoption.userId);

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
                />
                <Subheading style={{ padding: 10 }}>
                    <Text style={{ color: colors.primary }}>品種: </Text>
                    {putUpForAdoption.breed}
                </Subheading>
                <Subheading style={{ padding: 10 }}>
                    <Text style={{ color: colors.primary }}>性別: </Text>
                    {putUpForAdoption.gender}
                </Subheading>
                <Card.Cover
                    source={{ uri: `${SERVERURL}/image/${putUpForAdoption.photoId}` }}
                    style={{
                        width: 300,
                        height: 200,
                        alignSelf: 'center',
                        marginVertical: 5,
                    }}
                />
                {
                    putUpForAdoption.content ? (
                        <Paragraph style={{ padding: 10 }}>
                            <Text style={{ color: colors.primary }}>{'補充:\n'}</Text>
                            {putUpForAdoption.content}
                        </Paragraph>
                    ) : null
                }
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingBottom: 10 }}>
                    <Tag tag={{ name: putUpForAdoption.tag, selected: true }} />
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