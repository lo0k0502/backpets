import React from 'react';
import { List, useTheme, Divider } from 'react-native-paper';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
});

export default ({ navigation, logoutback }) => {
    const { colors } = useTheme();

    return (
        <DrawerContentScrollView style={styles.root}>
            <List.Section style={{ flex: 1 }}>
                {['設定', '意見回饋', '登出'].map((title, index) => (
                    <ListItem 
                        key={index}
                        title={title}
                        itemColor={colors.primary}
                        dividerColor={colors.border}
                        onItemPress={() => {
                            switch (title) {
                                case '設定': {
                                    navigation.navigate('Setting');
                                    break;
                                }
                                case '意見回饋': {
                                    navigation.navigate('Feedback');
                                    break;
                                }
                                case '登出': {
                                    logoutback();
                                    break;
                                }
                            }
                        }}
                    />
                ))}
            </List.Section>
        </DrawerContentScrollView>
    );
};

const ListItem = ({ title, itemColor, dividerColor, onItemPress }) => (
    <>
        <List.Item
            title={title}
            style={{ backgroundColor: itemColor }}
            titleStyle={{ color: 'white', textAlign: 'center', marginLeft: -8 }}
            onPress={onItemPress}
        />
        <Divider style={{ backgroundColor: dividerColor, height: 3 }} />
    </>
);