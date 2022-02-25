import React from 'react';
import { Button, Drawer, Avatar } from "react-native-paper";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Text, View, StyleSheet } from "react-native";
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/userSlice';
import { usePhoto } from '../../../hooks';
import { SERVERURL } from '../../../api/API';

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    profile: { 
        flex: 1, 
        backgroundColor: '#ff8000',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 30,
    },
    text: {
        color: 'white',
    },
});

export default ({ navigation, logoutback }) => {
    const user = useSelector(selectUser);

    return (
        <DrawerContentScrollView style={styles.root}>
            <View style={styles.profile}>
                <View>
                    <Text style={[styles.text, { fontSize: 25 }]}>{user.info?.username}</Text>
                    <Text style={[styles.text, { fontSize: 10 }]}>{user.info?.email}</Text>
                </View>
                <Avatar.Image source={{ uri: user.info?.photoId ? `${SERVERURL}/image/${user.info?.photoId}` : null }} size={60} style={{ backgroundColor: 'white' }} />
            </View>
            <Drawer.Section>
                <Button
                    color='#ff8000'
                    onPress={() => navigation.navigate('EditProfile')}
                >
                    修改個人資訊
                </Button>
            </Drawer.Section>
            <Drawer.Section style={{ marginVertical: 0 }}>
                <Button
                    mode='contained'
                    color='red'
                    style={{ borderRadius: 0 }}
                    onPress={() => navigation.navigate('ChangePassword')}
                >
                    修改密碼
                </Button>
            </Drawer.Section>
            <Drawer.Section>
                <Button
                    color='#ff8000'
                    onPress={logoutback}
                >
                    登出
                </Button>
            </Drawer.Section>
        </DrawerContentScrollView>
    );
};