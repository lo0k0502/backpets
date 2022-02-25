import React, { useState } from 'react';
import moment from 'moment';
import { Alert, ScrollView, View, Share, StyleSheet } from 'react-native';
import { 
    Card, 
    Divider, 
    Paragraph, 
    Title, 
    Appbar, 
    Headline, 
    Caption, 
    Avatar, 
    Menu,
} from 'react-native-paper';
import { DeletePost } from '../../../api';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/userSlice';
import { usePoster } from '../../../hooks';
import { SERVERURL } from '../../../api/API';

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: 'white',
    },
    scrollView: {
        flex: 1, 
        backgroundColor: 'white', 
        paddingHorizontal: 20,
    },
    momentView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageDivider: { 
        backgroundColor: 'gray',
        height: 2, 
        borderRadius: 10, 
    },
    p: { 
        marginVertical: 10,
    },
});

export default ({ navigation, route: { params: { post } } }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const user = useSelector(selectUser);
    const poster = usePoster(post);

    // Share this post's link (Not finished yet)
    const sharePost = async () => {
        await Share.share({
            message: 'BackPets | A Great App',
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
                                    [{ 
                                        text: 'OK', 
                                        onPress: () => {
                                            setMenuOpen(false);
                                            navigation.goBack();
                                        },
                                    }]
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
            <Appbar style={ styles.appbar }>
                <Appbar.Action icon='arrow-left' onPress={navigation.goBack} />
                <Appbar.Content />
                <Menu
                    visible={menuOpen}
                    onDismiss={() => setMenuOpen(false)}
                    anchor={<Appbar.Action icon='dots-horizontal' onPress={() => setMenuOpen(prev => !prev)} />}
                >
                    <Menu.Item 
                        title='分享' 
                        onPress={() => sharePost()} 
                    />
                    {user.info?._id === poster._id ? (
                        <>
                            <Menu.Item 
                                title='刪除任務'
                                onPress={deletePost}
                                style={{ backgroundColor: 'red' }}
                                titleStyle={{ color: 'white' }}
                            />
                        </>
                    ) : null}
                </Menu>
            </Appbar>
            <ScrollView 
                style={ styles.scrollView }
            >
                <View style={ styles.momentView }>
                    <Avatar.Image source={{ uri: poster.photoId ? `${SERVERURL}/image/${poster.photoId}` : null }} size={50} style={{ margin: 10, backgroundColor: 'white' }} />
                    <View>
                        <Title>{poster.username}</Title>
                        <Caption>{moment(post.post_time).fromNow()}</Caption>
                    </View>
                </View>
                <Divider style={ styles.imageDivider } />
                <Headline>{post.title}</Headline>
                <Paragraph style={ styles.p }>{post.content}</Paragraph>
                {post.photoId ? <Card.Cover source={{ uri: `${SERVERURL}/image/${post.photoId}` }}/> : null}
            </ScrollView>
        </>
    );
};