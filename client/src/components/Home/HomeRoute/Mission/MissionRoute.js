import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, View, RefreshControl, Text } from 'react-native';
import { Button, Portal } from 'react-native-paper';
import MissionDialog from './MissionDialog';
import MissionCard from './MissionCard';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../redux/userSlice';
import { usePosts } from '../../../../hooks';

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
    const [refreshing, setRefreshing] = useState(false);// State for RefreshControl component
    const [missionDialog, setMissionDialog] = useState(false);// Whether posting dialog is open

    const user = useSelector(selectUser);
    const { posts, refreshPosts } = usePosts();

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        refreshPosts().then(() => setRefreshing(false));
    }, []);
    
    return (
        <ScrollView style={styles.root} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
            <Button
                mode='contained'
                icon='plus'
                color='#ff8000'
                dark
                onPress={() => setMissionDialog(true)}
            >
                新增任務
            </Button>
            <View style={[styles.emailVerifySuggest, { display: user.info?.verified ? 'none' : 'flex' }]}>
                <Text style={{ color: 'black' }}>你的信箱還未驗證喔!</Text>
                <Text style={{ color: 'black' }}>我們強烈建議您先驗證您的信箱!</Text>
            </View>
            <Portal>
                <MissionDialog visible={missionDialog} close={() => setMissionDialog(false)} refreshPosts={refreshPosts} />
            </Portal>
            {posts.map(post => <MissionCard post={post} key={post._id} />)}
            <View style={{ height: 50 }} />
        </ScrollView>
    );
};