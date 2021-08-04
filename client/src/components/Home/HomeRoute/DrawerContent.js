import React from 'react';
import { Button, Drawer } from "react-native-paper";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Text } from "react-native";

export default ({ navigation }) => {
    return (
        <DrawerContentScrollView>
            <Drawer.Section>
                <Button
                    onPress={() => navigation.navigate('Profile')}
                >
                    個人資訊
                </Button>
            </Drawer.Section>
            <Drawer.Section>
                <Button
                    onPress={() => navigation.navigate('Login')}
                >
                    登出
                </Button>
            </Drawer.Section>
        </DrawerContentScrollView>
    );
};