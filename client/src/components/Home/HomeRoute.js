import React from 'react';
import { StyleSheet, View } from 'react-native';
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
      bottom: 40,
      backgroundColor: '#ff8000',
    },
});

const HomeRoute = () => {
    
    return (
        <View style={styles.root}>
            <Appbar style={styles.appbar}>
                <Appbar.BackAction onPress={() => {}} />
                <Appbar.Content title="Project P!!!" subtitle={"Stray animal's another home"} />
                <Appbar.Action icon="menu" />
            </Appbar>
            <Card style={styles.card}>
                <Card.Title title="Hello there!" subtitle="What do you think of this picture?" />
                <Card.Content>

                </Card.Content>
                <Card.Cover 
                    source={require('../../../assets/black-cat-icon-18776.png')} 
                    style={styles.cardimg}
                />
                <Card.Actions style={styles.cardactions}>
                    <Button icon="thumb-up" color="#ff8000">OK</Button>
                    <Button icon="thumb-down" color="#ff8000">Not OK</Button>
                </Card.Actions>
            </Card>
            <FAB style={styles.fab} icon="plus" />
        </View>
    )
};

export default HomeRoute;