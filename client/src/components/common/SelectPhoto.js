import React from 'react';
import { Button, Card, HelperText } from 'react-native-paper';

export default ({
    label,
    photoUrl,
    photoSize,
    errorMsg,
    disabled,
    isLoading,
    onChange = () => {},
}) => {
    return (
        <>
            <Button
                mode='contained'
                icon='plus'
                dark
                disabled={disabled}
                loading={isLoading}
                style={{ marginVertical: 10, elevation: 0 }}
                onPress={onChange}
            >
                {label}
            </Button>
            <HelperText type='error'>
                {errorMsg}
            </HelperText>
            {photoUrl ? (
                <Card.Cover
                    source={{ uri: photoUrl }}
                    style={{
                        ...photoSize,
                        alignSelf: 'center',
                    }}
                />
            ) : null}
        </>
    );
};