import React from 'react';
import { View } from 'react-native';
import { Button, HelperText, Text, useTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

export default ({
    show,
    value,
    disabled,
    dateTimePickerMode,
    errorMsg,
    onDatePress = () => {},
    onTimePress = () => {},
    onChange = () => {},
}) => {
    const { colors } = useTheme();

    return (
        <>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: colors.primary }}>日期</Text>
                    <Button
                        mode='contained'
                        dark
                        uppercase={false}
                        disabled={disabled}
                        onPress={onDatePress}
                        style={{
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            elevation: 0,
                        }}
                    >
                        {value.getFullYear() + '/' + (value.getMonth() + 1) + '/' + value.getDate()}
                    </Button>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: colors.primary }}>時間</Text>
                    <Button
                        mode='contained'
                        dark
                        uppercase={false}
                        disabled={disabled}
                        onPress={onTimePress}
                        style={{
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            elevation: 0,
                        }}
                    >
                        {value.getHours() + '時' + value.getMinutes() + '分'}
                    </Button>
                </View>
                {
                    show ? (
                        <DateTimePicker
                            testID='dateTimePicker'
                            value={value}
                            mode={dateTimePickerMode}
                            is24Hour
                            display='spinner'
                            onChange={onChange}
                        />
                    ) : null
                }
            </View>
            <HelperText type='error'>
                {errorMsg}
            </HelperText>
        </>
    );
};