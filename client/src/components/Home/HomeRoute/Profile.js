import React from 'react';
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
    imgrow: {
        flexDirection: 'column',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 5,
        margin: 10,
    },
    row: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 5,
        margin: 10,
    },
    modifybtn: {
        width: 85,
        height: 22,
    },
});

const Profile = ({ user }) => {
    return (
        <View style={styles.root}>
            <Text style={styles.title}>
                Profile
            </Text>
            <View style={styles.imgrow}>
                <Avatar.Image source={{ uri: user?.result.photoUrl }} />
                <Button 
                    compact
                    style={styles.modifybtn}
                    contentStyle={{ width: '100%', height: '100%', }}
                >
                    modify
                </Button>
            </View>
            <View style={styles.row}>
                <Text>
                    {user?.result.username}
                </Text>
                <Button 
                    compact
                    style={styles.modifybtn}
                    contentStyle={{ width: '100%', height: '100%', }}
                >
                    modify
                </Button>
            </View>
            <View style={styles.row}>
                <Text>
                    {user?.result.email}
                </Text>
                <Button 
                    compact
                    style={styles.modifybtn}
                    contentStyle={{ width: '100%', height: '100%', }}
                >
                    modify
                </Button>
            </View>
        </View>
    );
};

export default Profile;