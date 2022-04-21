import React, { useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Portal, Title } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useSelfPets, useSelfPutUpForAdoptions } from '../../../hooks';
import { selectUser } from '../../../redux/userSlice';
import PutUpForAdoptionCard from '../AdoptionRoute/PutUpForAdoption/PutUpForAdoptionCard';
import PutUpForAdoptionDialog from '../AdoptionRoute/PutUpForAdoption/PutUpForAdoptionDialog';

export default () => {
    const user = useSelector(selectUser);
    const { selfPutUpForAdoptions, refreshSelfPutUpForAdoptions, isFetchingSelfPutUpForAdoptions } = useSelfPutUpForAdoptions(user.info?._id);
    const { selfPets, refreshSelfPets, isFetchingSelfPets } = useSelfPets(user.info?._id);

    const [putUpForAdoptionDialog, setPutUpForAdoptionDialog] = useState(false);// Whether putUpForAdoption dialog is open
    const [editPutUpForAdoption, setEditPutUpForAdoption] = useState({});

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: 'white',
            }}
            refreshControl={
                <RefreshControl
                    refreshing={isFetchingSelfPutUpForAdoptions}
                    onRefresh={refreshSelfPutUpForAdoptions}
                />
            }
        >
            <Portal>
                <PutUpForAdoptionDialog
                    visible={putUpForAdoptionDialog}
                    close={() => setPutUpForAdoptionDialog(false)}
                    putUpForAdoption={editPutUpForAdoption}
                    setPutUpForAdoption={setEditPutUpForAdoption}
                    allPutUpForAdoptions={selfPutUpForAdoptions}
                    refreshAllPutUpForAdoptions={refreshSelfPutUpForAdoptions}
                    isFetchingAllPutUpForAdoptions={isFetchingSelfPutUpForAdoptions}
                    selfPets={selfPets}
                    refreshSelfPets={refreshSelfPets}
                    isFetchingSelfPets={isFetchingSelfPets}
                />
            </Portal>
            {
                isFetchingSelfPutUpForAdoptions ? null : (
                    selfPutUpForAdoptions.length ? (
                        selfPutUpForAdoptions.map(putUpForAdoption => (
                            <PutUpForAdoptionCard
                                key={putUpForAdoption._id}
                                putUpForAdoption={putUpForAdoption}
                                setEditPutUpForAdoption={setEditPutUpForAdoption}
                                setPutUpForAdoptionDialog={setPutUpForAdoptionDialog}
                            />
                        ))
                    ) : (
                        <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有貼文QQ</Title>
                    )
                )
            }
            <View style={{ height: 70 }} />
        </ScrollView>
    );
};