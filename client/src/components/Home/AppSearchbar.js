import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useRef } from 'react';
import { Appbar, TextInput, useTheme } from 'react-native-paper';
import { backIcon } from '../../utils/constants';

export default ({
  route,
  navigation,
  searchTextState: [searchText, setSearchText],
  autoFocus = false,
  searchFunction = () => {},
}) => {
  const { colors } = useTheme();
  const textInputRef = useRef();

  const isSearch = route.name === 'Search';

  useFocusEffect(useCallback(() => {
    if (autoFocus) setTimeout(() => textInputRef.current.focus(), 200);
  }, [navigation]));

  return (
    <Appbar
      style={[
        { backgroundColor: 'white' },
        isSearch && { elevation: 0, shadowOpacity: 0 },
      ]}
    >
      <TextInput
        mode='outlined'
        placeholder='搜尋'
        selectTextOnFocus
        value={searchText}
        onChangeText={text => setSearchText(text)}
        dense
        style={{
          flex: 1,
          paddingVertical: 0,
          justifyContent: 'center',
          marginHorizontal: '2%',
        }}
        ref={textInputRef}
        outlineColor='transparent'
        activeOutlineColor={colors.background2}
        selectionColor={colors.primary}
        left={isSearch ? (
            <TextInput.Icon
              name={backIcon}
              color='gray'
              forceTextInputFocus={false}
              onPress={() => navigation.pop(1)}
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
        right={
          <TextInput.Icon
            name='magnify'
            color='gray'
            onPress={searchFunction}
          />
        }
      />
    </Appbar>
  );
};