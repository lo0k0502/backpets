import React, { useState } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    RefreshControl,
    Text,
    Alert,
} from 'react-native';
import {
    ActivityIndicator,
    Divider,
    FAB,
    Portal,
    Subheading,
    Title,
    useTheme,
} from 'react-native-paper';
import MissionDialog from './MissionDialog';
import MissionCard from './MissionCard';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../redux/userSlice';
import { useFocusSelfPets, useMissions, usePets } from '../../../../hooks';
import ClueDialog from './ClueDialog';
import TagsView from '../TagsView';
import EditMissionDialog from './EditMissionDialog';
import { constants } from '../../../../utils';
import SelectButton from '../../SelectButton';
import SkeletonCard from '../../SkeletonCard';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'white',
    },
    emailVerifySuggest: {
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        borderWidth: 3,
        borderColor: 'red',
        margin: 10,
        padding: 5,
    },
    cardimg: {
        width: 300,
        height: 200,
        alignSelf: 'center',
    },
    cardactions: {
        justifyContent: 'flex-end',
    },
    cardbtn: {
        color: '#be9a78',
    },
    fab: {
        position: 'absolute',
        right: 40,
        bottom: 80,
            backgroundColor: '#be9a78',
        },
    });

export default ({ navigation, searchTextState }) => {
    const [searchText, setSearchText] = searchTextState;
    const user = useSelector(selectUser);
    const { missions, refreshMissions, isFetching } = useMissions();
    const { pets, isFetching: isFetchingPets } = usePets();
    const { pets: selfPets, isFetching: isFetchingSelfPets } = useFocusSelfPets(user.info?._id);
    const { colors } = useTheme();

    const [animalTags, setAnimalTags] = useState(constants.animalTagsArray.map(tagName => ({ name: tagName, selected: false })));
    const [completed, setCompleted] = useState(constants.completedOptions[0]);

    const [missionDialog, setMissionDialog] = useState(false);// Whether mission dialog is open
    const [editMissionDialog, setEditMissionDialog] = useState(false);// Whether edit mission dialog is open
    const [editMission, setEditMission] = useState({});
    const [clueDialog, setClueDialog] = useState(false);// Whether clue dialog is open
    const [addClueMissionId, setAddClueMissionId] = useState('');
    const [completedMenu, setCompletedMenu] = useState(false);

    const selectedTags = constants.animalTagsArray.filter(tag => animalTags.find(_tag => _tag.name === tag && _tag.selected));

    const checkMissionMatchFilters = (mission) => {
        const pet = pets.find(_pet => _pet._id === mission.petId);

        return (
            (!selectedTags.length || selectedTags.includes(pet.tag))
            && (
                !searchText
                || mission.content.search(searchText) !== -1
                || pet.name.search(searchText) !== -1
                || pet.breed.search(searchText) !== -1
                || pet.feature.search(searchText) !== -1
                || pet.gender.search(searchText) !== -1
            ) && (
                completed === constants.completedOptions[0]
                || (completed === constants.completedOptions[1] && mission.completed)
                || (completed === constants.completedOptions[2] && !mission.completed)
            )
        );
    };

    const checkMissionsMatchFilters = () => {
        const missionsMatchTag = selectedTags.length ? (
            missions.filter(mission => {
                return selectedTags.includes(pets.find(_pet => _pet._id === mission.petId).tag);
            })
        ) : missions;
        if (!missionsMatchTag.length) return false;

        const missionsMatchTagAndSearchText = searchText ? (
            missionsMatchTag.filter(mission => {
                const pet = pets.find(_pet => _pet._id === mission.petId);
        
                return (
                    mission.content.search(searchText) !== -1
                    || pet.name.search(searchText) !== -1
                    || pet.breed.search(searchText) !== -1
                    || pet.feature.search(searchText) !== -1
                    || pet.gender.search(searchText) !== -1
                );
            })
        ) : missionsMatchTag;
        if (!missionsMatchTagAndSearchText.length) return false;

        const missionsMatchTagAndSearchTextAndCompleted = completed !== constants.completedOptions[0] ? (
            missionsMatchTagAndSearchText.filter(mission => {
                return (
                    (completed === constants.completedOptions[1] && mission.completed)
                    || (completed === constants.completedOptions[2] && !mission.completed)
                );
            })
        ) : missionsMatchTagAndSearchText;

        return !!missionsMatchTagAndSearchTextAndCompleted.length;
    };

    return (
        <>
            <TagsView tagsState={[animalTags, setAnimalTags]} />
            <Divider />
            <View
                style={{
                flexDirection: 'row',
                padding: '2%',
                alignItems: 'center',
                backgroundColor: 'white',
                }}
            >
                <Subheading>完成狀態: </Subheading>
                <SelectButton
                    stateSet={[completed, setCompleted]}
                    menuStateSet={[completedMenu, setCompletedMenu]}
                    options={constants.completedOptions}
                />
            </View>
            <Divider />
            <ScrollView
                style={styles.root}
                refreshControl={(
                    <RefreshControl
                        refreshing={isFetching}
                        onRefresh={refreshMissions}
                    />
                )}
            >
                <Portal>
                    <MissionDialog
                        visible={missionDialog}
                        close={() => setMissionDialog(false)}
                        refreshMissions={refreshMissions}
                    />
                    <EditMissionDialog
                        mission={editMission}
                        visible={editMissionDialog}
                        close={() => setEditMissionDialog(false)}
                        refreshMissions={refreshMissions}
                    />
                    <ClueDialog
                        missionId={addClueMissionId}
                        visible={clueDialog}
                        close={() => setClueDialog(false)}
                    />
                </Portal>
                {
                    user.info?.verified ? null : (
                        <View style={styles.emailVerifySuggest}>
                            <Text style={{ color: 'black' }}>你的信箱還未驗證喔!</Text>
                            <Text style={{ color: 'black' }}>我們強烈建議您先驗證您的信箱!</Text>
                        </View>
                    )
                }
                {
                    isFetching || isFetchingPets ? (
                        <>
                            <SkeletonCard />
                            <SkeletonCard />
                        </>
                    ) : (
                        missions.length ? (
                            selectedTags.length || searchText || completed !== constants.completedOptions[0] ? (
                                checkMissionsMatchFilters() ? (
                                    missions.filter(checkMissionMatchFilters).map(mission => (
                                        <MissionCard
                                            key={mission._id}
                                            mission={mission}
                                            tagSelected={selectedTags.length}
                                            onViewCluePress={() => {
                                                navigation.navigate('Clue', { missionId: mission._id });
                                            }}
                                            onReportCluePress={() => {
                                                setAddClueMissionId(mission._id);
                                                setClueDialog(true);
                                            }}
                                            setEditMission={setEditMission}
                                            setEditMissionDialog={setEditMissionDialog}
                                        />
                                    ))
                                ) : (
                                    <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有貼文QQ</Title>
                                )
                            ) : (
                                missions.map(mission => (
                                    <MissionCard
                                        key={mission._id}
                                        mission={mission}
                                        onViewCluePress={() => {
                                            navigation.navigate('Clue', { missionId: mission._id });
                                        }}
                                        onReportCluePress={() => {
                                            setAddClueMissionId(mission._id);
                                            setClueDialog(true);
                                        }}
                                        setEditMission={setEditMission}
                                        setEditMissionDialog={setEditMissionDialog}
                                    />
                                ))
                            )
                        ) : <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有貼文QQ</Title>
                    )
                }
                <View style={{ height: 70 }} />
            </ScrollView>
            <FAB
                icon='plus'
                color='white'
                visible={!isFetchingSelfPets}
                style={{
                    position: 'absolute',
                    right: 10,
                    bottom: 70,
                    elevation: 1,
                }}
                onPress={() => {
                    if (!selfPets.length) {
                        return Alert.alert('沒有寵物!', '您的寵物護照目前沒有寵物喔!', [{ text: '知道了' }]);
                    }
                    setMissionDialog(true);
                }}
            />
        </>
    );
};