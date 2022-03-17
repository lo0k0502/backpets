import React from 'react';
import { View } from 'react-native';
import { Card, Avatar, Paragraph, useTheme, Text } from 'react-native-paper';
import moment from 'moment';
import { useUser } from '../../../hooks';
import { SERVERURL } from '../../../api/API';

export default ({ clue }) => {
    const { colors } = useTheme();
    const poster = useUser(clue.userId);

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
                    subtitle={moment(clue.post_time).fromNow()}
                    left={props => (
                        <Avatar.Image
                            {...props}
                            source={{ uri: poster.photoId ? `${SERVERURL}/image/${poster.photoId}` : null }}
                            style={{ backgroundColor: 'white' }}
                        />
                    )} 
                />
                <Card.Cover
                    source={{ uri: `${SERVERURL}/image/${clue.photoId}` }}
                    style={{
                        width: 300,
                        height: 200,
                        alignSelf: 'center',
                        marginVertical: 5,
                    }}
                />
                <Paragraph style={{ padding: 10 }}>
                    <Text style={{ color: colors.primary }}>{'說明:\n'}</Text>
                    {clue.content}
                </Paragraph>
            </View>
        </Card>
    );
};