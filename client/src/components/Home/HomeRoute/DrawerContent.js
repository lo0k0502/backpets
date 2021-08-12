import React, { useState, useCallback } from 'react';
import { Button, Drawer, Avatar } from "react-native-paper";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    profile: { 
        flex: 1, 
        backgroundColor: 'dodgerblue',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 30,
    },
    text: {
        color: 'white',
    },
});

export default ({ navigation, logoutback }) => {
    const [user, setUser] = useState(null);

    const fetch = async () => {
        setUser(JSON.parse(await AsyncStorage.getItem('userInfo')));
    };
    
    useFocusEffect(useCallback(() => {
        fetch();
    }, []));

    const handleSendEmail = async () => {
        try {
            // await sendEmailVerification({
            //     to: user.result.email,
            //     subject: 'Email Verification',
            //     body: 'Someone just register an ProjectP account with this email!!',
            //     options: {
            //         cc: 'thomas85514@gmail.com',
            //         bcc: 'thomas85514@gmail.com',
            //     },
            // });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <DrawerContentScrollView style={styles.root}>
            <View style={styles.profile}>
                <View>
                    <Text style={[styles.text, { fontSize: 25 }]}>{user?.result.username}</Text>
                    <Text style={[styles.text, { fontSize: 10 }]}>{user?.result.email}</Text>
                </View>
                <Avatar.Image 
                    source={{ uri: user?.result.photoUrl }} 
                    size={60}
                />
            </View>
            <Drawer.Section>
                <Button
                    color='dodgerblue'
                    onPress={() => navigation.navigate('EditProfile')}
                >
                    修改個人資訊
                </Button>
            </Drawer.Section>
            <Drawer.Section>
                <Button
                    color='red'
                    onPress={() => navigation.navigate('ChangePassword')}
                >
                    修改密碼
                </Button>
            </Drawer.Section>
            <Drawer.Section>
                <Button
                    color='dodgerblue'
                    onPress={handleSendEmail}
                >
                    寄
                </Button>
            </Drawer.Section>
            <Drawer.Section>
                <Button
                    color='dodgerblue'
                    onPress={logoutback}
                >
                    登出
                </Button>
            </Drawer.Section>
        </DrawerContentScrollView>
    );
};