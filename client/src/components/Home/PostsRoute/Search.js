import React from 'react';
import AppSearchbar from '../AppSearchbar';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/userSlice';
import { List, Text } from 'react-native-paper';

export default ({ route, navigation, searchTextState }) => {
  const [searchText, setSearchText] = searchTextState;
  const user = useSelector(selectUser);

  const search = () => {
    navigation.navigate('PostsTab', { searchText });
  };

  return (
    <>
      <AppSearchbar
          route={route}
          navigation={navigation}
          searchTextState={searchTextState}
          autoFocus
          searchFunction={search}
      />
      <List.Section style={{ flex: 1 }}>
      {user.info?.searchHistory.map((history, index) => (
        <List.Item
          key={index}
          title={history}
          onPress={() => setSearchText(history)}
          style={{ height: '15%', justifyContent: 'center' }}
          right={() => <List.Icon icon='arrow-top-left' color='gray' />}
        />
      ))}
      </List.Section>
    </>
  );
};