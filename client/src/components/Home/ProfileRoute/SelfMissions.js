import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Title } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useSelfMissions } from '../../../hooks';
import { selectUser } from '../../../redux/userSlice';
import MissionCard from '../PostsRoute/Mission/MissionCard';

export default ({ navigation }) => {
    const user = useSelector(selectUser);
    const { selfMissions, refreshSelfMissions, isFetchingSelfMissions } = useSelfMissions(user.info?._id);

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
            {
                isFetchingSelfMissions ? null : (
                    selfMissions.length ? (
                        selfMissions.map(mission => (
                            <MissionCard
                                key={mission._id}
                                mission={mission}
                                onViewCluePress={() => navigation.navigate('Clue', { missionId: mission._id })}
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