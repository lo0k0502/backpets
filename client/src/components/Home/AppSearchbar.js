import React from 'react';
import { Appbar, TextInput, useTheme } from 'react-native-paper';

export default ({ navigation, searchTextState: [searchText, setSearchText] }) => {
  const { colors } = useTheme();

  return (
    <Appbar style={{ backgroundColor: 'white' }}>
      <TextInput
        mode='outlined'
        placeholder='搜尋'
        value={searchText}
        onChangeText={text => setSearchText(text)}
        dense={true}
        style={{
          flex: 1,
          paddingVertical: 0,
          justifyContent: 'center',
          marginHorizontal: '2%',
        }}
        outlineColor='transparent'
        activeOutlineColor={colors.background2}
        selectionColor={colors.primary}
        left={
          <TextInput.Icon
            name='menu'
            color='gray'
            forceTextInputFocus={false}
            onPress={navigation.toggleDrawer}
          />
        }
        right={
          <TextInput.Icon
            name='magnify'
            color='gray'
          />
        }
      />
    </Appbar>
  );
};