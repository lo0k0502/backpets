import React from 'react';
import { TextInput as NativeTextInput } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

export default ({
    label,
    disabled,
    errorMsg,
    value,
    maxLength,
    onChangeText = () => {},
}) => {
    return (
        <>
            <TextInput
                mode='outlined'
                label={label}
                error={errorMsg}
                disabled={disabled}
                value={value}
                multiline
                maxLength={maxLength}
                right={<TextInput.Affix text={`${value.length}/${maxLength}`} />}
                render={(innerProps) => (
                    <NativeTextInput
                        {...innerProps}
                        style={[
                            innerProps.style,
                            innerProps.multiline ? {
                                paddingTop: 8,
                                paddingBottom: 8,
                                height: 200,
                            } : null,
                        ]}
                    />
                )}
                onChangeText={onChangeText}
            />
            <HelperText type='error'>
                {errorMsg}
            </HelperText>
        </>
    );
};