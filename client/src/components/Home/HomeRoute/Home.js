import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, ScrollView, View, RefreshControl, Text } from 'react-native';
import { Card, Button, Avatar, Paragraph, Title, Portal, TouchableRipple } from 'react-native-paper';
import { fetchAllPosts } from '../../../api';
import moment from 'moment';
import PostDialog from './PostDialog';
import PostCard from './PostCard';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/userSlice';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'white',
    },
    emailVerifySuggest: {
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        borderWidth: 3,
        borderColor: 'red',
        borderRadius: 10,
        margin: 10,
        padding: 5,
    },
    card: {
        margin: 20,
        justifyContent: 'center',
        elevation: 3,
        borderRadius: 20,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderTopWidth: 10,
        borderTopColor: '#ff8000',
    },
    postaction: {
        width: '100%',
        textAlign: 'left',
        borderRadius: 0,
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

    const user = useSelector(selectUser);
    const [posts, setPosts] = useState([]);
    const [postDrawer, setPostDrawer] = useState(false);

    const fetch = async () => {
        setPosts((await fetchAllPosts()).data.result);
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
                color='#ff8000'
                dark
                onPress={() => setPostDrawer(true)}
            >
                Post
            </Button>
            <View style={[styles.emailVerifySuggest, { display: user?.verified ? 'none' : 'flex' }]}>
                <Text style={{ color: 'black' }}>Your email is not verified yet!</Text>
                <Text style={{ color: 'black' }}>We highly recommed you to verify your email first!</Text>
            </View>
            <Portal>
                <PostDialog visible={postDrawer} close={() => setPostDrawer(false)} refresh={fetch} />
            </Portal>
            {posts.map(post => <PostCard post={post} key={post._id} />)}
            <View style={{ height: 50 }} />
        </ScrollView>
    );
};