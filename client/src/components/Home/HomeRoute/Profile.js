import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Avatar } from 'react-native-paper';

const styles = StyleSheet.create({
    root: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems:'center',
        backgroundColor: 'white',
    },
    title: {
        fontSize: 50,
        marginTop: -50,
        marginBottom: 50,
    },
    editbtn: {
        color: 'white',
        backgroundColor: 'dodgerblue',
        marginTop: 20,
    },
    updatepasswordbtn: {
        color: 'white',
        backgroundColor: 'red',
        margin: 20,
    },
});

const Profile = ({ navigation }) => {
    const [user, setUser] = useState(null);

    const fetch = async () => {
        setUser(JSON.parse(await AsyncStorage.getItem('userInfo')));
    };
    
    useFocusEffect(useCallback(() => {
        fetch();
    }, []));

    return (
        <View style={styles.root}>
            <Text style={styles.title}>
                Profile
            </Text>
            <Avatar.Image source={{ uri: user?.result.photoUrl }} />
            <Text>
                {user?.result.username}
            </Text>
            <Text>
                {user?.result.email}
            </Text>
            <Button
                mode='contained'
                style={styles.editbtn}
                onPress={() => navigation.navigate('EditProfile')}
            >
                Edit Profile
            </Button>
            <Button
                mode='contained'
                style={styles.updatepasswordbtn}
                onPress={() => navigation.navigate('ChangePassword')}
            >
                Change Password
            </Button>
        </View>
    );
};

export default Profile;