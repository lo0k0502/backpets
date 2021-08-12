import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, ScrollView, View, RefreshControl } from 'react-native';
import { Card, Button, Avatar, Paragraph, Title, Portal } from 'react-native-paper';
import { fetchAllPosts } from '../../../api';
import moment from 'moment';
import PostDialog from './PostDialog';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'white',
    },
    card: {
        margin: 20,
        elevation: 3,
        borderRadius: 10,
    },
    cardimg: {
        width: 300,
        height: 200,
        alignSelf: 'center',
    },
    cardactions: {
        justifyContent: 'flex-end',
    },
    cardbtn: {
        color: '#ff8000',
    },
    fab: {
        position: 'absolute',
        right: 40,
        bottom: 80,
        backgroundColor: '#ff8000',
    },
});

export default ({ navigation }) => {
    const [refreshing, setRefreshing] = useState(false);

    const [posts, setPosts] = useState([]);
    const [postDrawer, setPostDrawer] = useState(false);

    const fetch = async () => {
        setPosts((await fetchAllPosts()).data.result)
    };

    useFocusEffect(useCallback(() => {
        fetch();
    }, []));

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        fetch().then(() => setRefreshing(false));
    }, []);
    
    return (
        <ScrollView style={styles.root} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
            <Button
                mode='contained'
                icon='plus'
                color='dodgerblue'
                onPress={() => setPostDrawer(true)}
            >
                Post
            </Button>
            <Portal>
                <PostDialog visible={postDrawer} close={() => setPostDrawer(false)} refresh={fetch} />
            </Portal>
            {posts.map(post => 
                <Card style={styles.card} key={post._id}>
                    <Card.Title title={post.username} subtitle={moment(post.post_time).fromNow()} left={props => <Avatar.Icon {...props} icon="folder" />} />
                    <Card.Content>
                        <Title>{post.title}</Title>
                        <Paragraph>{post.content}</Paragraph>
                        {post.photoUrl ? <Card.Cover source={{ uri: post.photoUrl }} style={styles.cardimg}/> : null}
                    </Card.Content>
                </Card>
            )}
            <View style={{ height: 50 }}></View>
        </ScrollView>
    );
};