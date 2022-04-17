import React, { useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Portal, Title } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useSelfMissions, useSelfPets } from '../../../hooks';
import { selectUser } from '../../../redux/userSlice';
import MissionCard from '../PostsRoute/Mission/MissionCard';
import MissionDialog from '../PostsRoute/Mission/MissionDialog';

export default ({ navigation }) => {
    const user = useSelector(selectUser);
    const { selfMissions, refreshSelfMissions, isFetchingSelfMissions } = useSelfMissions(user.info?._id);
    const { selfPets, refreshSelfPets, isFetchingSelfPets } = useSelfPets(user.info?._id);

    const [missionDialog, setMissionDialog] = useState(false);// Whether mission dialog is open
    const [editMission, setEditMission] = useState({});

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: 'white',
            }}
            refreshControl={
                <RefreshControl
                    refreshing={isFetchingSelfMissions}
                    onRefresh={refreshSelfMissions}
                />
            }
        >
            <Portal>
                <MissionDialog
                    visible={missionDialog}
                    close={() => setMissionDialog(false)}
                    mission={editMission}
                    setMission={setEditMission}
                    allMissions={selfMissions}
                    refreshAllMissions={refreshSelfMissions}
                    isFetchingAllMissions={isFetchingSelfMissions}
                    selfPets={selfPets}
                    refreshSelfPets={refreshSelfPets}
                    isFetchingSelfPets={isFetchingSelfPets}
                />
            </Portal>
            {
                isFetchingSelfMissions ? null : (
                    selfMissions.length ? (
                        selfMissions.map(mission => (
                            <MissionCard
                                key={mission._id}
                                mission={mission}
                                onViewCluePress={() => navigation.navigate('Clue', { missionId: mission._id })}
                                setEditMission={setEditMission}
                                setMissionDialog={setMissionDialog}
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