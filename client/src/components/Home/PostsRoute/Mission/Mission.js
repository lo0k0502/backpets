import React, { useCallback, useContext, useState } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    RefreshControl,
    Text,
    Alert,
} from 'react-native';
import {
    Divider,
    FAB,
    Portal,
    Subheading,
    Title,
} from 'react-native-paper';
import MissionDialog from './MissionDialog';
import MissionCard from './MissionCard';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../redux/userSlice';
import { useMissions, usePets, useSelfPets } from '../../../../hooks';
import ClueDialog from './ClueDialog';
import TagsView from '../../../common/TagsView';
import { constants } from '../../../../utils';
import SelectButton from '../../SelectButton';
import Context from '../../../../context';
import ViolationReportDialog from '../ViolationReportDialog';
import { useFocusEffect } from '@react-navigation/native';

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

export default ({ navigation }) => {
    const user = useSelector(selectUser);
    const { allMissions, refreshAllMissions, isFetchingAllMissions } = useMissions();
    const { pets, isFetching: isFetchingPets } = usePets();
    const { selfPets, refreshSelfPets, isFetchingSelfPets } = useSelfPets(user.info?._id);
    const { showSnackbar } = useContext(Context);

    const [animalTags, setAnimalTags] = useState(constants.animalTagsArray.map(tagName => ({ name: tagName, selected: false })));
    const [completed, setCompleted] = useState(constants.completedOptions[0]);

    const [missionDialog, setMissionDialog] = useState(false);// Whether mission dialog is open
    const [editMission, setEditMission] = useState({});
    const [violationReportDialog, setViolationReportDialog] = useState(false);
    const [editMissionPoster, setEditMissionPoster] = useState({});
    const [clueDialog, setClueDialog] = useState(false);// Whether clue dialog is open
    const [addClueMissionId, setAddClueMissionId] = useState('');
    const [completedMenu, setCompletedMenu] = useState(false);

    const selectedTags = constants.animalTagsArray.filter(tag => animalTags.find(_tag => _tag.name === tag && _tag.selected));

    const checkMissionMatchFilters = (mission) => {
        const pet = pets.find(_pet => _pet._id === mission.petId);

        return (
            (!selectedTags.length || selectedTags.includes(pet.tag))
            && (
                !user.searchText
                || mission.content.search(user.searchText) !== -1
                || pet.name.search(user.searchText) !== -1
                || pet.breed.search(user.searchText) !== -1
                || pet.feature.search(user.searchText) !== -1
                || pet.gender.search(user.searchText) !== -1
            ) && (
                completed === constants.completedOptions[0]
                || (completed === constants.completedOptions[1] && mission.completed)
                || (completed === constants.completedOptions[2] && !mission.completed)
            )
        );
    };

    const passedCheckMissions = allMissions.filter(checkMissionMatchFilters);

    const MissionItem = mission => (
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
            setMissionDialog={setMissionDialog}
            setViolationReportDialog={setViolationReportDialog}
            setEditMissionPoster={setEditMissionPoster}
        />
    );

    useFocusEffect(useCallback(() => {
        refreshSelfPets();
    }, []));

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
                        refreshing={isFetchingAllMissions}
                        onRefresh={refreshAllMissions}
                    />
                )}
            >
                <Portal>
                    <MissionDialog
                        visible={missionDialog}
                        close={() => setMissionDialog(false)}
                        mission={editMission}
                        setMission={setEditMission}
                        allMissions={allMissions}
                        refreshAllMissions={refreshAllMissions}
                        isFetchingAllMissions={isFetchingAllMissions}
                        selfPets={selfPets}
                        refreshSelfPets={refreshSelfPets}
                        isFetchingSelfPets={isFetchingSelfPets}
                    />
                    <ViolationReportDialog
                        postType='mission'
                        post={editMission}
                        poster={editMissionPoster}
                        visible={violationReportDialog}
                        close={() => setViolationReportDialog(false)}
                        refreshPosts={refreshAllMissions}
                        showSnackbar={showSnackbar}
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
                    isFetchingAllMissions || isFetchingPets ? null : (
                        passedCheckMissions.length ? (
                            passedCheckMissions.map(MissionItem)
                        ) : (
                            <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有貼文QQ</Title>
                        )
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