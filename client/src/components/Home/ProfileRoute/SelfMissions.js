import React, { useContext } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Title } from 'react-native-paper';
import Context from '../../../context';
import MissionCard from '../PostsRoute/Mission/MissionCard';

export default ({ navigation }) => {
    const { selfMissions, refreshSelfMissions, isFetchingSelfMissions } = useContext(Context);

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