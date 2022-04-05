import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/userSlice';
import { List } from 'react-native-paper';

export default ({
  onItemPress = () => {},
}) => {
  const user = useSelector(selectUser);

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
          onPress={() => onItemPress(history)}
          style={{ height: 50, justifyContent: 'center' }}
          right={() => <List.Icon icon='arrow-top-left' color='gray' />}
        />
      ))}
    </List.Section>
  );
};