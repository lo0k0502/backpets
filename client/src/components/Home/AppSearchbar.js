import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef } from 'react';
import { Appbar, TextInput, useTheme } from 'react-native-paper';
import { backIcon } from '../../utils/constants';

export default ({
  route,
  style = {},
  inputStyle = {},
  routeName,
  value,
  outlineColor,
  activeOutlineColor,
  onChangeText = () => {},
  onFocus = () => {},
  onPressOut = () => {},
  onBackPress = () => {},
  onMenuPress = () => {},
  onClearButtonPress = () => {},
  searchFunction = () => {},
}) => {
  const _routeName = routeName || route.name;

  const { colors } = useTheme();
  const textInputRef = useRef();

  const isSearch = _routeName === 'Search';

  useEffect(() => {
    if (_routeName === 'Search') {
      textInputRef.current.focus();
    } else {
      textInputRef.current.blur();
    }
  }, [_routeName]);

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
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onPressOut={onPressOut}
        onSubmitEditing={e => e.nativeEvent.text && searchFunction()}
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
              name={backIcon}
              color='gray'
              forceTextInputFocus={false}
              onPress={onBackPress}
            />
          ) : (
            <TextInput.Icon
              name='menu'
              color='gray'
              forceTextInputFocus={false}
              onPress={onMenuPress}
            />
          )
        }
        right={(
          <TextInput.Icon
            name='close'
            color='gray'
            onPress={onClearButtonPress}
          />
        )}
      />
    </Appbar>
  );
};