import React from 'react';
import moment from 'moment';
import { ScrollView, View } from 'react-native';
import { Card, Divider, Paragraph, Subheading, Title, Appbar, Headline, Text, Caption, Avatar } from 'react-native-paper';

export default ({ navigation, route: { params: { post } } }) => {

    return (
        <ScrollView 
            style={{ 
                flex: 1, 
                backgroundColor: 'white', 
                paddingHorizontal: 20,
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar.Icon icon='folder' size={50} style={{ margin: 10 }} />
                <View>
                    <Title>{post.username}</Title>
                    <Caption>{moment(post.post_time).fromNow()}</Caption>
                </View>
            </View>
            <Divider style={{ backgroundColor: 'gray', height: 5, borderRadius: 10 }} />
            <Headline>{post.title}</Headline>
            <Paragraph style={{ marginVertical: 10 }}>{post.content}</Paragraph>
            {post.photoUrl ? <Card.Cover source={{ uri: post.photoUrl }}/> : null}
        </ScrollView>
    );
};