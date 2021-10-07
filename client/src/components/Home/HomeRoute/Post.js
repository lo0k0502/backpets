import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import { ScrollView, View } from 'react-native';
import { Card, Divider, Paragraph, Subheading, Title, Appbar, Headline, Text, Caption, Avatar } from 'react-native-paper';
import { fetchUserById } from '../../../api';

export default ({ route: { params: { post } } }) => {
    const [poster, setPoster] = useState({});

    const fetchPoster = async () => {
        try {
            const res = await fetchUserById(post.userId);
            setPoster(res.data.result);
        } catch (error) {
            console.log('While fetching post: ', error);
        }
    };
    
    useFocusEffect(useCallback(() => {
        fetchPoster();
    }, []));

    return (
        <ScrollView 
            style={{ 
                flex: 1, 
                backgroundColor: 'white', 
                paddingHorizontal: 20,
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar.Image source={{ uri: poster.photoUrl }} size={50} style={{ margin: 10 }} />
                <View>
                    <Title>{poster.username}</Title>
                    <Caption>{moment(post.post_time).fromNow()}</Caption>
                </View>
            </View>
            <Divider style={{ backgroundColor: 'gray', height: 2, borderRadius: 10 }} />
            <Headline>{post.title}</Headline>
            <Paragraph style={{ marginVertical: 10 }}>{post.content}</Paragraph>
            {post.photoUrl ? <Card.Cover source={{ uri: post.photoUrl }}/> : null}
        </ScrollView>
    );
};