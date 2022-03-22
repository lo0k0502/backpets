import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, Dialog } from 'react-native-paper';

export default ({ visible, close }) => {

    const [isLoading, setIsLoading] = useState(false);// Whether it is during posting, if so, disable inputs and buttons.
    const [isImgLoading, setIsImgLoading] = useState(false);// Whether it is during image picking, if so, disable inputs and buttons. 

    const handleClose = () => {
        close();
    };

    const handleSubmit = () => {

    };

    return (
        <Dialog visible={visible} onDismiss={handleClose}>
            <Dialog.Title>發佈認養貼文</Dialog.Title>
            <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
                <ScrollView style={{ height: '80%', padding: 20 }}>

                </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
                <Button
                    disabled={isImgLoading || isLoading}
                    onPress={handleClose}
                    contentStyle={{ paddingHorizontal: 10 }}
                >
                    取消
                </Button>
                <Button
                    mode='contained'
                    dark
                    disabled={
                        isImgLoading
                        || isLoading
                    }
                    loading={isLoading}
                    onPress={handleSubmit}
                    contentStyle={{ paddingHorizontal: 10 }}
                >
                    發佈
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
};