import React, { useState } from 'react'
import { View } from 'react-native';
import AppSearchbar from '../AppSearchbar';

export default ({ navigation }) => {
    const [searchText, setSearchText] = useState('');

  return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
          <AppSearchbar navigation={navigation} searchTextState={[searchText, setSearchText]} />
      </View>
  );
};