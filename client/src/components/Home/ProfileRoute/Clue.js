import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { ActivityIndicator, AnimatedFAB, FAB, HelperText, Subheading, Text, Title, useTheme } from 'react-native-paper';
import { useClues, useMission } from '../../../hooks';
import ClueCard from './ClueCard';

export default ({ route, navigation }) => {
    const { missionId } = route.params;
    const { colors } = useTheme();
    const mission = useMission(missionId);
    const { clues, refreshClues, isFetching } = useClues(missionId);

    const [selecting, setSelecting] = useState(false);
    const [clueCheckBoxes, setClueCheckboxses] = useState([]);
    const [selectingErrorMsg, setSelectingErrorMsg] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setClueCheckboxses(clues.map(clue => ({ id: clue._id, status: 'unchecked' })));
    }, [clues]);

    return (
        <>
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
                    selecting ? (
                        <>
                            <HelperText>
                                請選擇有幫助到您的線索({clueCheckBoxes.filter(clueCheckBox => clueCheckBox.status === 'checked').length}/3)
                            </HelperText>
                            <HelperText type='error'>
                            {selectingErrorMsg}
                            </HelperText>
                        </>
                    ) : null
                }
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
                                <ClueCard
                                    key={clue._id}
                                    clue={clue}
                                    selecting={selecting}
                                    disabled={isLoading}
                                    clueCheckBoxesState={[clueCheckBoxes, setClueCheckboxses]}
                                    setSelectingErrorMsg={setSelectingErrorMsg}
                                />
                            ))
                        ) : (
                            <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有線索QQ</Title>
                        )
                    )
                }
                <View style={{ height: 70 }} />
            </ScrollView>
            {
                mission.completed ? null : (
                    !isFetching && clues.length ? (
                        selecting ? (
                            <>
                                <FAB
                                    icon='close'
                                    label='取消'
                                    color={isLoading ? 'white' : colors.primary}
                                    extended
                                    disabled={isLoading}
                                    style={{
                                        position: 'absolute',
                                        right: 10,
                                        bottom: 140,
                                        elevation: 1,
                                    }}
                                    theme={{ colors: { accent: 'white' } }}
                                    onPress={() => {
                                        setSelectingErrorMsg('');
                                        setSelecting(false);
                                    }}
                                />
                                <FAB
                                    icon='check'
                                    label='確定選擇'
                                    color='white'
                                    extended
                                    disabled={isLoading}
                                    style={{
                                        position: 'absolute',
                                        right: 10,
                                        bottom: 70,
                                        elevation: 1,
                                    }}
                                    theme={{ colors: { accent: colors.primary } }}
                                    onPress={() => {
                                        setSelectingErrorMsg('');
                                        setIsLoading(true);
                                        setTimeout(() => setIsLoading(false), 1000);
                                    }}
                                />
                            </>
                        ) : (
                            <FAB
                                icon='check'
                                label='完成任務'
                                color='white'
                                extended
                                disabled={isLoading}
                                style={{
                                    position: 'absolute',
                                    right: 10,
                                    bottom: 70,
                                    elevation: 1,
                                }}
                                theme={{ colors: { accent: colors.primary } }}
                                onPress={() => setSelecting(true)}
                            />
                        )
                    ) : null
                ) 
            }
        </>
    );
};