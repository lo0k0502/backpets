import React, { useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    View,
} from 'react-native';
import {
    FAB,
    HelperText,
    Title,
    useTheme,
} from 'react-native-paper';
import { completeMission } from '../../api';
import { useMission, useMissionClues } from '../../hooks';
import ClueCard from './ClueCard';

export default ({ route }) => {
    const { missionId } = route.params;
    const { colors } = useTheme();
    const { mission, refreshMission, isFetchingMission } = useMission(missionId);
    const { missionClues, refreshMissionClues, isFetchingMissionClues } = useMissionClues(missionId);

    const [selecting, setSelecting] = useState(false);
    const [clueCheckBoxes, setClueCheckboxses] = useState([]);
    const [selectingErrorMsg, setSelectingErrorMsg] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const refreshPage = async () => {
        await refreshMission();
        await refreshMissionClues();
    };

    const handleSubmit = async () => {
        setSelectingErrorMsg('');
        setIsLoading(true);

        try {
            await completeMission(
                missionId,
                { chosen_clueIds: clueCheckBoxes.filter(clueCheckBox => clueCheckBox.status === 'checked').map(clueCheckBox => clueCheckBox.id) }
            );

            refreshPage();
            setSelecting(false);
        } catch (error) {
            console.log('While completing mission: ', error);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        setClueCheckboxses(missionClues.map(clue => ({ id: clue._id, userId: clue.userId, status: 'unchecked' })));
    }, [missionClues]);

    return (
        <>
            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={isFetchingMission || isFetchingMissionClues}
                        onRefresh={refreshPage}
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
                    isFetchingMission || isFetchingMissionClues ? null : (
                        missionClues.length ? (
                            missionClues.map(clue => (
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
                (
                    isFetchingMission
                    || isFetchingMissionClues
                ) ? null : (
                    missionClues.length ? (
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
                                    disabled={isLoading || !clueCheckBoxes.filter(clueCheckBox => clueCheckBox.status === 'checked').length}
                                    style={{
                                        position: 'absolute',
                                        right: 10,
                                        bottom: 70,
                                    }}
                                    onPress={handleSubmit}
                                />
                            </>
                        ) : (
                            <FAB
                                icon={mission.completed ? null : 'check'}
                                label={mission.completed ? '任務已完成' : '完成任務'}
                                color='white'
                                extended
                                disabled={isLoading || mission.completed}
                                style={{
                                    position: 'absolute',
                                    right: 10,
                                    bottom: 70,
                                }}
                                onPress={() => setSelecting(true)}
                            />
                        )
                    ) : null
                )
            }
        </>
    );
};