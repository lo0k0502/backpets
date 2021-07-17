import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAB, Card, Button, Appbar } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { Logout } from '../../../api';
import { logout } from '../../../redux/userReducer';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'white',
    },
    appbar: {
        backgroundColor: 'white',
        elevation: 0,
    },
    card: {
        margin: 20,
        elevation: 3,
        borderRadius: 10,
    },
    cardimg: {
        height: 300,
        backgroundColor: '#ff8000',
    },
    cardactions: {
        justifyContent: 'flex-end',
    },
    cardbtn: {
        color: '#ff8000',
    },
    fab: {
        position: 'absolute',
        right: 40,
        bottom: 80,
        backgroundColor: '#ff8000',
    },
});

const Home = ({ navigation, setUser, user, checkLogin }) => {

    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            const logOutRes = await Logout({ refreshToken: user.result.refreshToken });
            const removeInfoRes = await AsyncStorage.removeItem('userInfo');
            dispatch(logout());
            setUser(null);
            checkLogin();
        } catch (error) {
            console.log(error);
        }
    };

    const logoutAlert = () => {
        Alert.alert('Logging out', 'Are you sure you want to log out?', [
            { text: 'Yes', onPress: handleLogout },
            { text: 'No' },
        ]);
    };
    
    return (
        <View style={styles.root}>
            <Appbar style={styles.appbar}>
                <Appbar.Content title='Project P!!!' subtitle={user?.result?.username} />
                <Appbar.Action icon='menu' onPress={() => navigation.navigate('Profile')} />
            </Appbar>
            <Card style={styles.card}>
                <Card.Title title='Hello there!' subtitle='What do you think of this picture?' />
                <Card.Content>
                    
                </Card.Content>
                <Card.Cover 
                    source={{ uri: user?.result?.photoUrl }} 
                    style={styles.cardimg}
                />
                <Card.Actions style={styles.cardactions}>
                    <Button icon='thumb-up' color='#ff8000'>OK</Button>
                    <Button icon='thumb-down' color='#ff8000'>Not OK</Button>
                </Card.Actions>
            </Card>
            <Text>{}</Text>
            <Button 
                mode='contained' 
                style={{ width: '50%' }}
                onPress={logoutAlert}
            >
                Logout
            </Button>
            <FAB style={styles.fab} icon='plus' />
        </View>
    );
};

export default Home;