import React, { useState } from 'react';
import { Alert, RefreshControl, ScrollView } from 'react-native';
import { Avatar, Divider, IconButton, List, Portal } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { SERVERURL } from '../../../api/API';
import { useSelfPets } from '../../../hooks';
import { selectUser } from '../../../redux/userSlice';
import EditPetPassportDialog from './EditPetPassportDialog';
import PetPassportDialog from './PetPassportDialog';

export default () =>  {
    const user = useSelector(selectUser);
    const { selfPets, refreshSelfPets, isFetchingSelfPets } = useSelfPets(user.info?._id);

    const [petPassportsDialog, setPetPassportDialog] = useState(false);// Whether petPassports dialog is open
    const [editPetPassportDialog, setEditPetPassportDialog] = useState(false);// Whether editPetPassports dialog is open
    const [editPetPassport, setEditPetPassport] = useState({});

    return (
        <>
            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                }}
                refreshControl={(
                    <RefreshControl
                        refreshing={isFetchingSelfPets}
                        onRefresh={refreshSelfPets}
                    />
                )}
            >
                <Portal>
                    <PetPassportDialog
                        visible={petPassportsDialog}
                        close={() => setPetPassportDialog(false)}
                        refreshSelfPets={refreshSelfPets}
                    />
                    <EditPetPassportDialog
                        pet={editPetPassport}
                        visible={editPetPassportDialog}
                        close={() => setEditPetPassportDialog(false)}
                        refreshSelfPets={refreshSelfPets}
                    />
                </Portal>
                <List.Section style={{ flex: 1, marginTop: 0 }}>
                    {
                        isFetchingSelfPets ? null : (
                            selfPets.length ? (
                                selfPets.map(pet => (
                                    <ListItem
                                        key={pet._id}
                                        pet={pet}
                                        onEditPress={() => {
                                            setEditPetPassport(pet);
                                            setEditPetPassportDialog(true);
                                        }}
                                        onDeletePress={() => {
                                            Alert.alert('正在刪除寵物!', '這個動作將會刪除所有與此寵物有關的貼文!\n請問確定要刪除嗎?', [
                                                { text: '取消' },
                                                { text: '確定刪除', onPress: () => {} }
                                            ])
                                        }}
                                    />
                                ))
                            ) : null
                        )
                    }
                    <List.Item
                        left={props => <List.Icon {...props} icon='plus' />}
                        title='新增寵物護照'
                        onPress={() => setPetPassportDialog(true)}
                    />
                    <Divider />
                </List.Section>
            </ScrollView>
        </>
    );
};

const ListItem = ({ pet, onEditPress, onDeletePress }) => {
    return (
        <>
            <List.Item
                title={pet.name}
                left={() => <Avatar.Image source={{ uri: `${SERVERURL}/image/${pet.photoId}` }} style={{ backgroundColor: 'white' }} />}
                right={props => (
                    <>
                        <IconButton
                            {...props}
                            icon='pencil-outline'
                            style={{ alignSelf: 'center' }}
                            onPress={onEditPress}
                        />
                        <IconButton
                            {...props}
                            icon='trash-can-outline'
                            style={{ alignSelf: 'center' }}
                            onPress={onDeletePress}
                        />
                    </>
                )}
                // onPress={onPress}
            />
            <Divider />
        </>
    );
};