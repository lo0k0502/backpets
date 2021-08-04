import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, Alert, ScrollView } from 'react-native';
import { FAB, Card, Button, Appbar, Avatar, Paragraph, Title } from 'react-native-paper';
import { fetchAllPosts } from '../../../api';
import moment from 'moment';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'white',
    },
    appbar: {
        backgroundColor: 'white',
        elevation: 0,
        zIndex: 10,
    },
    card: {
        margin: 20,
        elevation: 3,
        borderRadius: 10,
    },
    cardimg: {
        width: 300,
        height: 300,
        backgroundColor: '#ff8000',
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

const Home = ({ navigation }) => {
    const [posts, setPosts] = useState([]);

    const fetch = async () => {
        setPosts((await fetchAllPosts()).data.result)
    };

    useFocusEffect(useCallback(() => {
        fetch();
    }, []));
    
    return (
        <ScrollView style={styles.root}>
            <Appbar style={styles.appbar}>
                <Appbar.Action icon='menu' onPress={() => navigation.toggleDrawer()} />
                <Appbar.Content title='Project P!!!' subtitle='P!!!' />
            </Appbar>
            <Button
                icon='plus'
                color='dodgerblue'
                onPress={() => {}}
            >
                Post
            </Button>
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
        </ScrollView>
    );
};

export default Home;