import React, { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Card, Avatar, Paragraph, Title, TouchableRipple } from 'react-native-paper';
import { fetchUserById } from '../../../api';

export default ({ post }) => {
    const navigation = useNavigation();
    const [poster, setPoster] = useState({});

    const fetchPoster = async () => {
        try {
            const res = await fetchUserById(post.userId);
            setPoster(res.data.result);
        } catch (error) {
            console.log(error)
        }
    };
    
    useFocusEffect(useCallback(() => {
        fetchPoster();
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
                borderTopWidth: 10,
                borderTopColor: '#ff8000',
            }}
        >
            <TouchableRipple 
                style={{ width: '100%' }}
                onPress={() => navigation.navigate('Post', { post })}
            >
                <Card.Title title={poster.username} subtitle={moment(post.post_time).fromNow()} left={props => <Avatar.Icon {...props} icon="folder" />} />
            </TouchableRipple>
            <Card.Actions style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Title style={{ marginLeft: 10 }}>{post.title}</Title>
                <Paragraph style={{ padding: 10 }}>{post.content}</Paragraph>
                {post.photoUrl ? <Card.Cover source={{ uri: post.photoUrl }} style={{ width: 300, height: 200, alignSelf: 'center' }}/> : null}
            </Card.Actions>
        </Card>
    );
};