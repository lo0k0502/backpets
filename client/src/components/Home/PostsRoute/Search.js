import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setSearchText } from '../../../redux/userSlice';
import { List } from 'react-native-paper';
import { unwrapResult } from '@reduxjs/toolkit';
import { updateSearchHistory } from '../../../redux/userReducer';

export default ({ navigation }) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

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
          onPress={async () => {
            dispatch(setSearchText(history));
            unwrapResult(await dispatch(updateSearchHistory({ searchHistory: history })));
            navigation.goBack();
          }}
          style={{ height: 50, justifyContent: 'center' }}
          right={() => <List.Icon icon='arrow-top-left' color='gray' />}
        />
      ))}
    </List.Section>
  );
};