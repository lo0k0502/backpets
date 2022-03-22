import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { Avatar, Button, Card, Subheading, useTheme } from 'react-native-paper';
import { deleteUser, fetchAllUsers } from '../../api';
import { SERVERURL } from '../../api/API';

export default ({ navigation }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const isMounted = useRef(true);

    const fetchUsers = async () => {
        setIsFetching(true);

        try {
            const res = await fetchAllUsers();
            if (isMounted.current) {
                setAllUsers(res.data.result);
            }
        } catch (error) {
            console.log(error);
        }

        setIsFetching(false);
    };

    useEffect(() => {
        isMounted.current = true;

        fetchUsers();

        return () => { isMounted.current = false };
    }, []);

    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }} refreshControl={<RefreshControl refreshing={isFetching} onRefresh={fetchUsers} />}>
            {allUsers.map(user => (
                <Item key={user._id} user={user} refreshUsers={fetchUsers} />
            ))}
        </ScrollView>
    );
};

const Item = ({ user, refreshUsers }) => {
    const { colors } = useTheme();

    const handleSubmit = async () => {
        try {
            await deleteUser(user._id);

            refreshUsers();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Card
            style={{
                margin: 5,
                justifyContent: 'center',
                backgroundColor: colors.background2,
            }}
        >
            <Text style={{ textAlign: 'center' }}>{user._id}</Text>
            <Card.Title
                title={user.username}
                subtitle={user.email}
                left={props => (
                    <Avatar.Image
                        {...props}
                        source={{ uri: `${SERVERURL}/image/${user.photoId}` }}
                        style={{ backgroundColor: 'white' }}
                    />
                )}
            />
            <Subheading style={{ padding: 10 }}>
                Verified: {user.verified.toString()}
            </Subheading>
            <Subheading style={{ padding: 10 }}>
                Points: {user.points.toString()}
            </Subheading>
            <Subheading style={{ padding: 10 }}>
                Search history: {user.searchHistory.join(' | ')}
            </Subheading>
            <Button
                mode='contained'
                dark
                uppercase={false}
                onPress={handleSubmit}
            >
                Delete
            </Button>
        </Card>
    );
};