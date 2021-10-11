import React, { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Card, Avatar, Paragraph, Title, TouchableRipple, Button, IconButton } from 'react-native-paper';
import { fetchUserById } from '../../../api';

export default ({ post }) => {
    const navigation = useNavigation();
    const [poster, setPoster] = useState({});

    // Fetch the poster of this post
    useFocusEffect(useCallback(() => {
        (async () => {
            try {
                const res = await fetchUserById(post.userId);
                setPoster(res.data.result);
            } catch (error) {
                console.log(error.response.data.message);
            }
        })()
    }, []));

    return (
        <Card 
            style={{
                margin: 20,
                justifyContent: 'center',
                elevation: 3,
                borderRadius: 20,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderTopWidth: 5,
                borderTopColor: '#ff8000',
                overflow: 'hidden',
            }}
        >
            <TouchableRipple 
                style={{ width: '100%' }}
                onPress={() => navigation.navigate('Post', { post })}
            >
                <Card.Title title={poster.username} 
                    subtitle={moment(post.post_time).fromNow()} 
                    left={props => <Avatar.Image {...props} source={{ uri: poster.photoUrl }} />} 
                />
            </TouchableRipple>
            <Card.Actions style={{ flexDirection: 'column', alignItems: 'flex-start', padding: 0 }}>
                <Title style={{ marginLeft: 10 }}>{post.title}</Title>
                <Paragraph style={{ padding: 10 }}>{post.content}</Paragraph>
                {post.photoUrl ? <Card.Cover source={{ uri: post.photoUrl }} style={{ width: 300, height: 200, alignSelf: 'center', marginVertical: 5 }}/> : null}
                <Button
                    mode='contained'
                    color='#ff8000'
                    dark
                    style={{ width: '100%', borderRadius: 0, flexGrow: 1 }}
                    onPress={() => {}}
                >
                    Accept
                </Button>
            </Card.Actions>
        </Card>
    );
};