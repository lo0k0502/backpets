import React from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Avatar, Paragraph, Title, TouchableRipple, Button, useTheme } from 'react-native-paper';
import moment from 'moment';
import { useUser } from '../../../../hooks';
import { SERVERURL } from '../../../../api/API';

const styles = StyleSheet.create({
    card: {
        margin: 20,
        justifyContent: 'center',
        elevation: 3,
        borderRadius: 20,
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
                <Card.Title title={poster.username} 
                    subtitle={moment(mission.post_time).fromNow()} 
                    left={props => <Avatar.Image {...props} source={{ uri: poster.photoId ? `${SERVERURL}/image/${poster.photoId}` : null }} style={{ backgroundColor: 'white' }} />} 
                />
            </TouchableRipple>
            <Card.Actions style={ styles.cardAction }>
                <Title style={{ marginLeft: 10 }}>{mission.title}</Title>
                <Paragraph style={{ padding: 10 }}>{mission.content}</Paragraph>
                {mission.photoId ? <Card.Cover source={{ uri: `${SERVERURL}/image/${mission.photoId}` }} style={{ width: 300, height: 200, alignSelf: 'center', marginVertical: 5 }}/> : null}
                <Button
                    mode='contained'
                    color={colors.primary}
                    dark
                    style={ styles.acceptButton }
                    onPress={() => {}}
                >
                    執行
                </Button>
            </Card.Actions>
        </Card>
    );
};