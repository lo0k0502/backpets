import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { ActivityIndicator, Text, Title, useTheme } from 'react-native-paper';
import { useClues } from '../../../hooks';

export default ({ route }) => {
    const { missionId } = route.params;
    console.log(missionId)
    const { colors } = useTheme();
    const { clues, refreshClues, isFetching } = useClues(missionId);

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: 'white',
            }}
            refreshControl={
                <RefreshControl
                    refreshing={isFetching}
                    onRefresh={refreshClues}
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
                    clues.length ? (
                        clues.map(clue => (
                            <Text>{clue._id}</Text>
                        ))
                    ) : (
                        <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有線索QQ</Title>
                    )
                )
            }
            <View style={{ height: 70 }} />
        </ScrollView>
    );
};