import React from 'react';
import { Button, Dialog } from 'react-native-paper';

export default ({
    cancelBtnLabel,
    submitBtnLabel,
    cancelBtnDisabled,
    submitBtnDisabled,
    isLoading,
    onSubmit = () => {},
    onCancel = () => {},
}) => {
    return (
        <Dialog.Actions>
            <Button
                disabled={cancelBtnDisabled}
                onPress={onCancel}
                contentStyle={{ paddingHorizontal: 10 }}
            >
                {cancelBtnLabel}
            </Button>
            <Button
                mode='contained'
                dark
                disabled={submitBtnDisabled}
                loading={isLoading}
                onPress={onSubmit}
                contentStyle={{ paddingHorizontal: 10 }}
            >
                {submitBtnLabel}
            </Button>
        </Dialog.Actions>
    );
};