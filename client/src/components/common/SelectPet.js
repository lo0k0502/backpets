import React from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { Avatar, Button, Dialog, Divider, List, Portal } from 'react-native-paper';
import { SERVERURL } from '../../api/API';

export default ({
    petId,
    mode,
    petsDialog,
    setPetsDialog,
    selfPets,
    isFetchingSelfPets,
    refreshSelfPets = () => {},
    isFetchingPosts,
    posts,
    onPetPress = () => {},
    disabled,
}) => {
    return (
        <>
            <Portal>
                <Dialog visible={petsDialog} onDismiss={() => setPetsDialog(false)}>
                    <Dialog.Title>請選擇一個寵物</Dialog.Title>
                    <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
                        <ScrollView
                            style={{
                                height: '80%',
                                padding: 20,
                            }}
                            refreshControl={(
                                <RefreshControl
                                    refreshing={isFetchingSelfPets}
                                    onRefresh={refreshSelfPets}
                                />
                            )}
                        >
                            <List.Section style={{ marginTop: 0 }}>
                                {
                                    !isFetchingPosts ? (
                                        posts.length ? (
                                            selfPets.map(pet => (
                                                <ListItem
                                                    mode={mode}
                                                    key={pet._id}
                                                    pet={pet}
                                                    disabled={posts.find(post => post.petId === pet._id)}
                                                    onPress={onPetPress}
                                                />
                                            ))
                                        ) : null
                                    ) : null
                                }
                            </List.Section>
                        </ScrollView>
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button
                            disabled={disabled}
                            onPress={() => setPetsDialog(false)}
                            contentStyle={{ paddingHorizontal: 10 }}
                        >
                            取消
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Button 
                mode='contained'
                dark
                disabled={disabled}
                style={{ marginVertical: 10, elevation: 0 }}
                onPress={() => setPetsDialog(true)}
            >
                {petId ? '更改寵物' : '選擇寵物(必要)'}
            </Button>
        </>
    );
};

const ListItem = ({ mode, pet, disabled = false, onPress }) => {
    return (
        <>
            <List.Item
                title={pet.name}
                description={disabled ? `無法選擇: 已存在此寵物的${mode === 'mission' ? '遺失任務' : '送養貼文'}` : null}
                descriptionStyle={{ color: 'red' }}
                style={disabled && { backgroundColor: '#eee', opacity: 0.7 }}
                disabled={disabled}
                left={() => <Avatar.Image source={{ uri: `${SERVERURL}/image/${pet.photoId}` }} style={{ backgroundColor: 'white' }} />}
                onPress={onPress}
            />
            <Divider />
        </>
    );
};