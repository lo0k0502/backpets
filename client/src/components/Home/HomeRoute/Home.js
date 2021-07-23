import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { FAB, Card, Button, Appbar } from 'react-native-paper';

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

const Home = ({ navigation, logoutback, fetch }) => {
    
    return (
        <View style={styles.root}>
            <Appbar style={styles.appbar}>
                <Appbar.Content title='Project P!!!' subtitle='P!!!' />
                <Appbar.Action icon='menu' onPress={() => navigation.navigate('Profile')} />
            </Appbar>
            <Card style={styles.card}>
                <Card.Title title='Hello there!' subtitle='What do you think of this picture?' />
                <Card.Cover 
                    source={{ uri: 'http://192.168.1.103:5001/file/c8d49b3477d25baf073fbcf0ae17a13b' }} 
                    style={styles.cardimg}
                />
                <Card.Actions style={styles.cardactions}>
                    <Button icon='thumb-up' color='#ff8000'>OK</Button>
                    <Button icon='thumb-down' color='#ff8000'>Not OK</Button>
                </Card.Actions>
            </Card>
            <Button 
                mode='contained' 
                style={{ width: '50%', margin: 20 }}
                onPress={logoutback}
            >
                Logout
            </Button>
            <Button 
                mode='contained' 
                style={{ width: '50%', margin: 20 }}
                onPress={fetch}
            >
                Fetch
            </Button>
            <FAB style={styles.fab} icon='plus' />
        </View>
    );
};

export default Home;