import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import { Alert, ScrollView, View, Share } from 'react-native';
import { Card, Divider, Paragraph, Subheading, Title, Appbar, Headline, Text, Caption, Avatar, Menu } from 'react-native-paper';
import { DeletePost, fetchUserById } from '../../../api';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/userSlice';

export default ({ navigation, route: { params: { post } } }) => {
    const user = useSelector(selectUser);
    const [poster, setPoster] = useState({});
    const [menuOpen, setMenuOpen] = useState(false);
    
    // Fetch the poster of this post
    useFocusEffect(useCallback(() => {
        (async () => {
            try {
                const res = await fetchUserById(post.userId);
                setPoster(res.data.result);
            } catch (error) {
                console.log('While fetching poster: ', error.response.data.message);
            }
        })();
    }, []));

    // Share this post's link (Not finished yet)
    const sharePost = async () => {
        await Share.share({
            message: 'ProjectP | A Great App',
            url: 'https://www.google.com',
        });
    };

    // Delete this post. Only the poster can see this function
    const deletePost = async () => {
        Alert.alert(
            'DELETING POST!',
            'Your are deleting your post!\nThis action is irreversible, please think twice before you make your decision!',
            [
                { text: 'Cancel' },
                { 
                    text: 'DELETE ANYWAY',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            if ((await DeletePost(post._id)).data.success) {
                                Alert.alert(
                                    'Success!!',
                                    'Successfully deleted post!!\nGoing back...',
                                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                                );
                            }
                        } catch (error) {
                            console.log(error.response.data.message);
                        }
                    }
                }
            ]
        );
    };

    return (
        <>
            <Appbar style={{ backgroundColor: 'white' }}>
                <Appbar.Action icon='arrow-left' onPress={navigation.goBack} />
                <Appbar.Content />
                <Menu
                    visible={menuOpen}
                    onDismiss={() => setMenuOpen(false)}
                    anchor={<Appbar.Action icon='dots-horizontal' onPress={() => setMenuOpen(prev => !prev)} />}
                >
                    <Menu.Item 
                        title='Share' 
                        onPress={() => sharePost()} 
                    />
                    {user.info?._id === poster._id ? (
                        <>
                            <Menu.Item 
                                title='Delete Post' 
                                onPress={deletePost} 
                                style={{ backgroundColor: 'red' }}
                                titleStyle={{ color: 'white' }} 
                            />
                        </>
                    ) : null}
                </Menu>
            </Appbar>
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
        </>
    );
};