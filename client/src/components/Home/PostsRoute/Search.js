import React from 'react';
import AppSearchbar from '../AppSearchbar';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/userSlice';
import { List, Text } from 'react-native-paper';

export default ({ route, navigation, searchTextState }) => {
  const [searchText, setSearchText] = searchTextState;
  const user = useSelector(selectUser);

  return (
    <List.Section style={{ flex: 1, backgroundColor: 'white', marginTop: 0 }}>
      {user.info?.searchHistory.map((history, index) => (
        <List.Item
          key={index}
          title={history}
          onPress={() => {
            setSearchText(history);
            navigation.navigate('PostsTab');
          }}
          style={{ height: 50, justifyContent: 'center' }}
          right={() => <List.Icon icon='arrow-top-left' color='gray' />}
        />
      ))}
    </List.Section>
  );
};