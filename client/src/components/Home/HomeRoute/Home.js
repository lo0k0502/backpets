import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { FAB, Card, Button, Appbar, Avatar, Paragraph } from 'react-native-paper';

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

const Home = ({ navigation }) => {
    
    return (
        <View style={styles.root}>
            <Appbar style={styles.appbar}>
                <Appbar.Action icon='menu' onPress={() => navigation.toggleDrawer()} />
                <Appbar.Content title='Project P!!!' subtitle='P!!!' />
                {/*<Appbar.Action icon='menu' onPress={() => navigation.openDrawer()} />*/}
            </Appbar>
            <Card style={styles.card}>
                <Card.Title title='Mr.P' subtitle='1分鐘前' left={props => <Avatar.Icon {...props} icon="folder" />} />
                <Card.Content>
                    <Paragraph>協尋我家的小橘貓</Paragraph>
                </Card.Content>
                <Card.Cover 
                    source={{ uri: 'https://picsum.photos/300' }} 
                    style={styles.cardimg}
                />
                <Card.Actions style={styles.cardactions}>
                    <Button icon='thumb-up' color='#ff8000'>OK</Button>
                    <Button icon='thumb-down' color='#ff8000'>Not OK</Button>
                </Card.Actions>
            </Card>
            <FAB style={styles.fab} icon='plus' />
        </View>
    );
};

export default Home;