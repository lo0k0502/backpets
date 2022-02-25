import React from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Avatar, Paragraph, Title, TouchableRipple, Button } from 'react-native-paper';
import moment from 'moment';
import { usePoster } from '../../../../hooks';
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
        borderTopColor: '#ff8000',
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

export default ({ post }) => {
    const navigation = useNavigation();
    const poster = usePoster(post);

    return (
        <Card style={ styles.card }>
            <TouchableRipple 
                style={{ width: '100%' }}
                onPress={() => navigation.navigate('Post', { post })}
            >
                <Card.Title title={poster.username} 
                    subtitle={moment(post.post_time).fromNow()} 
                    left={props => <Avatar.Image {...props} source={{ uri: poster.photoId ? `${SERVERURL}/image/${poster.photoId}` : null }} style={{ backgroundColor: 'white' }} />} 
                />
            </TouchableRipple>
            <Card.Actions style={ styles.cardAction }>
                <Title style={{ marginLeft: 10 }}>{post.title}</Title>
                <Paragraph style={{ padding: 10 }}>{post.content}</Paragraph>
                {post.photoId ? <Card.Cover source={{ uri: `${SERVERURL}/image/${post.photoId}` }} style={{ width: 300, height: 200, alignSelf: 'center', marginVertical: 5 }}/> : null}
                <Button
                    mode='contained'
                    color='#ff8000'
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