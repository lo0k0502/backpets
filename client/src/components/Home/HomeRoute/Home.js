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

const Home = ({ navigation, user, logoutback }) => {
    
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
                onPress={logoutback}
            >
                Logout
            </Button>
            <FAB style={styles.fab} icon='plus' />
        </View>
    );
};

export default Home;