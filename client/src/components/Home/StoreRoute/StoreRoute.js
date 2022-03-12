import React, { useState } from 'react';
import { Dimensions, StyleSheet, View, VirtualizedList, Text, StatusBar } from 'react-native';
import AppSearchbar from '../AppSearchbar';

const boxSize = Dimensions.get('window').width / 2 - 50;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        //flexWrap: 'wrap',
        backgroundColor: 'white',
        //alignContent: 'space-around',
    },
    item: {
        backgroundColor: 'aliceblue',
        height: boxSize,
        width: boxSize,
        justifyContent: 'center',
        marginHorizontal: 20,
        marginVertical: 5,
    },
    title: {
        color: 'black',
        textAlign: 'center',
        fontSize: 20,

    }
});

const DATA = [];

const getItem = (data, index) => ({
    id: Math.random().toString(12).substring(0),
    title: `Food ${index+1}`
});

const getItemCount = (data) => 50;

const Item = ({ title }) => (
    <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
    </View>
);


export default ({ navigation }) => {
    const [searchText, setSearchText] = useState('');

    return (
        <View style={styles.root}>
            <AppSearchbar navigation searchTextState={[searchText, setSearchText]} />
            <VirtualizedList 
                data={DATA}
                initialNumToRender={4}
                renderItem={({ item }) => <Item title={item.title}/>}
                keyExtractor={ item => item.id }
                getItemCount={getItemCount}
                getItem={getItem}
            >

            </VirtualizedList>
        </View>
    )
};