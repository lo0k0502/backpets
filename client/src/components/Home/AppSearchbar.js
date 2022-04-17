import React, { useCallback, useRef } from 'react';
import { Appbar, TextInput, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setSearchText } from '../../redux/userSlice';
import { useFocusEffect } from '@react-navigation/native';
import { updateSearchHistory } from '../../redux/userReducer';
import { unwrapResult } from '@reduxjs/toolkit';
import { constants } from '../../utils';

export default ({
  route,
  navigation,
  style = {},
  inputStyle = {},
  outlineColor,
  activeOutlineColor,
}) => {
  const user = useSelector(selectUser);

  const { colors } = useTheme();
  const textInputRef = useRef();
  const dispatch = useDispatch();

  const isSearch = route.name === 'Search';

  useFocusEffect(useCallback(() => {
    if (isSearch) {
      setTimeout(() => textInputRef.current.focus(), 100);
    } else {
      textInputRef.current.blur();
    }
  }, [route.name]));

  return (
    <Appbar
      style={[
        { backgroundColor: 'white', ...style },
        isSearch && { elevation: 0, shadowOpacity: 0 },
      ]}
    >
      <TextInput
        mode='outlined'
        placeholder='搜尋'
        selectTextOnFocus
        value={user.searchText}
        onChangeText={text => dispatch(setSearchText(text))}
        onPressOut={() => {
          if (!isSearch) navigation.navigate('Search');
        }}
        onSubmitEditing={async e => {
          if (!e.nativeEvent.text) return;

          unwrapResult(await dispatch(updateSearchHistory({ searchHistory: user.searchText })));
          if (isSearch) navigation.goBack();
        }}
        dense
        style={{
          flex: 1,
          paddingVertical: 0,
          justifyContent: 'center',
          marginHorizontal: '2%',
          ...inputStyle,
        }}
        ref={textInputRef}
        outlineColor={outlineColor}
        activeOutlineColor={activeOutlineColor}
        selectionColor={colors.primary}
        left={isSearch ? (
            <TextInput.Icon
              name={constants.backIcon}
              color='gray'
              forceTextInputFocus={false}
              onPress={() => {
                dispatch(setSearchText(''));
                if (isSearch) navigation.goBack();
              }}
            />
          ) : (
            <TextInput.Icon
              name='menu'
              color='gray'
              forceTextInputFocus={false}
              onPress={navigation.toggleDrawer}
            />
          )
        }
        right={!isSearch && !user.searchText ? null : (
          <TextInput.Icon
            name='close'
            color='gray'
            onPress={() => {
              if (!isSearch) navigation.navigate('Search');
              dispatch(setSearchText(''));
            }}
          />
        )}
      />
    </Appbar>
  );
};