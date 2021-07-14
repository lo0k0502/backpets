import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Alert } from 'react-native';
import { FAB, Card, Button, Appbar } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/userReducer';

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
        bottom: 40,
        backgroundColor: '#ff8000',
    },
});

const HomeRoute = ({ navigation, setUser, user }) => {

    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userInfo');
            dispatch(logout());
            setUser(null);
            navigation.goBack('Login');
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
                <Appbar.Content title='Project P!!!' subtitle={user?.result.username} />
                <Appbar.Action icon='menu' />
            </Appbar>
            <Card style={styles.card}>
                <Card.Title title='Hello there!' subtitle='What do you think of this picture?' />
                <Card.Content>
                    
                </Card.Content>
                <Card.Cover 
                    source={require('../../../assets/black-cat-icon-18776.png')} 
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
    )
};

export default HomeRoute;