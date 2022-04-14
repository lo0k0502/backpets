import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/userSlice';
import { List } from 'react-native-paper';
import { postsContext } from '../../../context';

export default () => {
  const user = useSelector(selectUser);
  const { onSearchHistoryPress } = useContext(postsContext);

  return (
    <List.Section
      style={{
        flex: 1,
        flexDirection: 'column-reverse',
        justifyContent: 'flex-end',
        backgroundColor: 'white',
        marginVertical: 0,
      }}
    >
      {user.info?.searchHistory.map((history, index) => (
        <List.Item
          key={index}
          title={history}
          onPress={() => onSearchHistoryPress(history)}
          style={{ height: 50, justifyContent: 'center' }}
          right={() => <List.Icon icon='arrow-top-left' color='gray' />}
        />
      ))}
    </List.Section>
  );
};