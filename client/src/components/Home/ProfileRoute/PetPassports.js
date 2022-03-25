import React, { useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { Avatar, Divider, List, Portal } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { SERVERURL } from '../../../api/API';
import { useSelfPets } from '../../../hooks';
import { selectUser } from '../../../redux/userSlice';
import PetPassportsDialog from './PetPassportsDialog';

export default () =>  {
    const user = useSelector(selectUser);
    const { pets, refreshPets, isFetching } = useSelfPets(user.info?._id);

    const [petPassportsDialog, setPetPassportsDialog] = useState(false);// Whether petPassports dialog is open

    return (
        <>
            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                }}
                refreshControl={(
                    <RefreshControl
                        refreshing={isFetching}
                        onRefresh={refreshPets}
                    />
                )}
            >
                <Portal>
                    <PetPassportsDialog
                        visible={petPassportsDialog}
                        close={() => setPetPassportsDialog(false)}
                        refreshPets={refreshPets}
                    />
                </Portal>
                <List.Section style={{ flex: 1, marginTop: 0 }}>
                    {pets.map(pet => <ListItem key={pet._id} pet={pet} />)}
                    <List.Item
                        left={props => <List.Icon {...props} icon='plus' />}
                        title='新增寵物護照'
                        onPress={() => setPetPassportsDialog(true)}
                    />
                    <Divider />
                </List.Section>
            </ScrollView>
        </>
    );
};

const ListItem = ({ pet }) => {
    return (
        <>
            <List.Item
                title={pet.name}
                left={() => <Avatar.Image source={{ uri: `${SERVERURL}/image/${pet.photoId}` }} style={{ backgroundColor: 'white' }} />}
                right={() => <List.Icon icon='chevron-right' style={{ alignSelf: 'center' }} />}
                onPress={() => {}}
            />
            <Divider />
        </>
    );
};