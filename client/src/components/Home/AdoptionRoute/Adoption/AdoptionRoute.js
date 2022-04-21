import React from 'react';
import { FlatList, View, StyleSheet, SafeAreaView, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import AdoptionData from './AdoptedData.json';

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    marginTop: 10,
    marginHorizontal: 10,
    flex: 1,
    justifyContent: 'space-around',
  },
  box: {
    width: '50%',
    height: '40%',
    margin: 5,
  },
  item: {
  },
});

export default () => {
    
  const Item = ({ title }) => (
      title.album_file ? (
        <View style={styles.box}>
        <Image source={{ uri: title.album_file }}/>
        <Text>品種：{title.animal_Variety}</Text>
        <Text>類別：{title.animal_kind}</Text>
        <Text>性別：{title.animal_sex}</Text>
        <Text>我在：{title.shelter_name}</Text>
      </View>
      ) : (null)
  );

  const renderItem = ({ item }) => (
    <Item title = {item} />
  );

    return (
        <SafeAreaView style={styles.container}>
        <FlatList
            data={AdoptionData}
            renderItem={renderItem}
            keyExtractor={item => item.animal_id}
            numColumns={2}
        />
        </SafeAreaView>
    );
};