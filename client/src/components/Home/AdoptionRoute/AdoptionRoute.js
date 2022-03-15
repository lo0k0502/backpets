import React, { useState } from 'react'
import { View } from 'react-native';
import AppSearchbar from '../AppSearchbar';

export default ({ route, navigation }) => {
    const [searchText, setSearchText] = useState('');

  return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <AppSearchbar
            route={route}
            navigation={navigation}
            searchTextState={[searchText, setSearchText]}
        />
      </View>
  );
};