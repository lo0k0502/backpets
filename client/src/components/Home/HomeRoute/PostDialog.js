import React from 'react';
import { TextInput, Dialog, Button, Card } from 'react-native-paper';

export default ({ visible, close }) => {
    return (
        <Dialog visible={visible} onDismiss={close}>
            <Dialog.Title>Post</Dialog.Title>
            <Dialog.Content>
                <TextInput 
                    mode='outlined'
                    placeholder='Title'
                    placeholderTextColor='gray'
                    selectionColor='#666'
                    theme={{ colors: { primary: 'dodgerblue' } }}
                />
                <TextInput 
                    mode='outlined'
                    placeholder='Content'
                    placeholderTextColor='gray'
                    multiline
                    numberOfLines={9}
                    selectionColor='#666'
                    theme={{ colors: { primary: 'dodgerblue' } }}
                />
                <Button 
                    mode='contained'
                    icon='plus'
                    contentStyle={{ width: '100%', height: '100%' }}
                    style={{ 
                        width: 150,
                        height: '7%', 
                        alignSelf: 'center', 
                        marginVertical: 10, 
                    }}
                    color='dodgerblue'
                >
                    Add Image
                </Button>
                <Card.Cover 
                    source={{ uri: 'https://picsum.photos/700' }} 
                    style={{
                        // width: 300,
                        // height: 300,
                        // alignSelf: 'center',
                    }}
                />
            </Dialog.Content>
            <Dialog.Actions>
                <Button 
                    color='dodgerblue' 
                    onPress={close}
                >
                    Cancel
                </Button>
                <Button 
                    mode='contained' 
                    color='dodgerblue'
                    onPress={close}
                >
                    Post
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
};