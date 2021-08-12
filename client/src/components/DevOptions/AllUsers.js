import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fetchAllUsers } from '../../api';

const styles = StyleSheet.create({
    username: {
        width: '37%',
        maxWidth: '37%',
        marginLeft: 5,
        paddingLeft: 5,
        paddingRight: 5,
        borderWidth: 1,
        borderRightWidth: 0.5,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
    },
    email: {
        width: '60%',
        maxWidth: '60%',
        marginRight: 5,
        paddingLeft: 5,
        paddingRight: 5,
        borderWidth: 1,
        borderLeftWidth: 0.5,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    },
});

export default ({ navigation }) => {
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const res = await fetchAllUsers();
            setAllUsers(res.data.result);
        };
        fetch();
    }, []);

    return (
        <View style={{ flex: 1, }}>
            {allUsers.map(user => (
                <View 
                    key={user._id} 
                    style={{ 
                        flexDirection: 'row', 
                        backgroundColor: 'white', 
                        margin: 2,
                    }}
                >
                    <Text style={styles.username}>{user.username}</Text>
                    <Text style={styles.email}>{user.email}</Text>
                </View>
            ))}
        </View>
    );
};