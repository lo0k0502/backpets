import React, { useState, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Card, Avatar, Paragraph, Title, TouchableRipple, Button, IconButton } from 'react-native-paper';
import moment from 'moment';
import { fetchUserById } from '../../../api';

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
        <Card style={ styles.card }>
            <TouchableRipple 
                style={{ width: '100%' }}
                onPress={() => navigation.navigate('Post', { post })}
            >
                <Card.Title title={poster.username} 
                    subtitle={moment(post.post_time).fromNow()} 
                    left={props => <Avatar.Image {...props} source={{ uri: poster.photoUrl }} />} 
                />
            </TouchableRipple>
            <Card.Actions style={ styles.cardAction }>
                <Title style={{ marginLeft: 10 }}>{post.title}</Title>
                <Paragraph style={{ padding: 10 }}>{post.content}</Paragraph>
                {post.photoUrl ? <Card.Cover source={{ uri: post.photoUrl }} style={{ width: 300, height: 200, alignSelf: 'center', marginVertical: 5 }}/> : null}
                <Button
                    mode='contained'
                    color='#ff8000'
                    dark
                    style={ styles.acceptButton }
                    onPress={() => {}}
                >
                    Accept
                </Button>
            </Card.Actions>
        </Card>
    );
};