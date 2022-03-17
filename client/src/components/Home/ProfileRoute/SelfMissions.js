import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { ActivityIndicator, Title, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useSelfMissions } from '../../../hooks';
import { selectUser } from '../../../redux/userSlice';
import MissionCard from '../PostsRoute/Mission/MissionCard';

export default ({ navigation }) => {
    const user = useSelector(selectUser);
    const { missions, refreshMissions, isFetching } = useSelfMissions(user.info?._id);
    const { colors } = useTheme();
    
    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: 'white',
            }}
            refreshControl={
                <RefreshControl
                    refreshing={isFetching}
                    onRefresh={refreshMissions}
                />
            }
        >
            {
                isFetching ? (
                    <ActivityIndicator
                        animating={true}
                        color={colors.primary}
                        size='large'
                        style={{ marginTop: 50 }}
                    />
                ) : (
                    missions.length ? (
                        missions.map(mission => (
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