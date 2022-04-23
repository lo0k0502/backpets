import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import {
  Divider,
  FAB,
  Portal,
  Subheading,
  Title,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import Context from '../../../../context';
import { usePets, usePutUpForAdoptions, useSelfPets } from '../../../../hooks';
import { selectUser } from '../../../../redux/userSlice';
import { constants } from '../../../../utils';
import SelectButton from '../../SelectButton';
import TagsView from '../../../common/TagsView';
import ViolationReportDialog from '../../PostsRoute/ViolationReportDialog';
import CompletePutUpForAdoptionDialog from './CompletePutUpForAdoptionDialog';
import PutUpForAdoptionCard from './PutUpForAdoptionCard';
import PutUpForAdoptionDialog from './PutUpForAdoptionDialog';

export default () => {
  const user = useSelector(selectUser);
  const { allPutUpForAdoptions, refreshAllPutUpForAdoptions, isFetchingAllPutUpForAdoptions } = usePutUpForAdoptions();
  const { pets, isFetching: isFetchingPets } = usePets();
  const { selfPets, refreshSelfPets, isFetchingSelfPets } = useSelfPets(user.info?._id);
  const { showSnackbar } = useContext(Context);

  const [putUpForAdoptionDialog, setPutUpForAdoptionDialog] = useState(false);// Whether putUpForAdoption dialog is open
  const [editPutUpForAdoption, setEditPutUpForAdoption] = useState({});
  const [violationReportDialog, setViolationReportDialog] = useState(false);
  const [editPutUpForAdoptionPoster, setEditPutUpForAdoptionPoster] = useState({});
  const [completeDialog, setCompleteDialog] = useState(false);
  const [completeId, setCompleteId] = useState('');

  const [animalTags, setAnimalTags] = useState(constants.animalTagsArray.map(tagName => ({ name: tagName, selected: false })));
  const [county, setCounty] = useState(constants.all_countys[0]);
  const [district, setDistrict] = useState(constants.all_area_data[county][0]);

  const [countyMenu, setCountyMenu] = useState(false);
  const [districtMenu, setDistrictMenu] = useState(false);

  const selectedTags = animalTags.filter(_tag => _tag.selected).map(_tag => _tag.name);

  const checkPutUpForAdoptionMatchTagAndSearchTextAndArea = (putUpForAdoption) => {
    const pet = pets.find(_pet => _pet._id === putUpForAdoption.petId);

    return (
      (!selectedTags.length || selectedTags.includes(pet.tag))
      && (
        !user.searchText
        || putUpForAdoption.content.search(user.searchText) !== -1
        || pet.name.search(user.searchText) !== -1
        || pet.breed.search(user.searchText) !== -1
        || pet.gender.search(user.searchText) !== -1
      ) && (
        (county === '全部' || putUpForAdoption.county === county)
        && (district === '全部' || putUpForAdoption.district === district)
      )
    );
  };

  const passedCheckPutUpForAdoptions = allPutUpForAdoptions.filter(checkPutUpForAdoptionMatchTagAndSearchTextAndArea);

  const PutUpForAdoptionItem = putUpForAdoption => (
    <PutUpForAdoptionCard
      key={putUpForAdoption._id}
      putUpForAdoption={putUpForAdoption}
      tagSelected={selectedTags.length}
      setEditPutUpForAdoption={setEditPutUpForAdoption}
      setPutUpForAdoptionDialog={setPutUpForAdoptionDialog}
      setViolationReportDialog={setViolationReportDialog}
      setEditPutUpForAdoptionPoster={setEditPutUpForAdoptionPoster}
      onCompletePress={() => {
        setCompleteId(putUpForAdoption._id);
        setCompleteDialog(true);
      }}
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
          <Subheading>縣市: </Subheading>
          <SelectButton
            stateSet={[county, setCounty]}
            menuStateSet={[countyMenu, setCountyMenu]}
            options={constants.all_countys}
            optionOnPress={option => setDistrict(constants.all_area_data[option][0])}
          />
          <Subheading> 地區: </Subheading>
          <SelectButton
            stateSet={[district, setDistrict]}
            menuStateSet={[districtMenu, setDistrictMenu]}
            options={constants.all_area_data[county]}
          />
      </View>
      <Divider />
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}
        refreshControl={(
          <RefreshControl
            refreshing={isFetchingAllPutUpForAdoptions}
            onRefresh={refreshAllPutUpForAdoptions}
          />
        )}
      >
        <Portal>
          <PutUpForAdoptionDialog
            visible={putUpForAdoptionDialog}
            close={() => setPutUpForAdoptionDialog(false)}
            putUpForAdoption={editPutUpForAdoption}
            setPutUpForAdoption={setEditPutUpForAdoption}
            allPutUpForAdoptions={allPutUpForAdoptions}
            refreshAllPutUpForAdoptions={refreshAllPutUpForAdoptions}
            isFetchingAllPutUpForAdoptions={isFetchingAllPutUpForAdoptions}
            selfPets={selfPets}
            refreshSelfPets={refreshSelfPets}
            isFetchingSelfPets={isFetchingSelfPets}
          />
          <ViolationReportDialog
            postType='putUpForAdoption'
            post={editPutUpForAdoption}
            poster={editPutUpForAdoptionPoster}
            visible={violationReportDialog}
            close={() => setViolationReportDialog(false)}
            refreshPosts={refreshAllPutUpForAdoptions}
            showSnackbar={showSnackbar}
          />
          <CompletePutUpForAdoptionDialog
            visible={completeDialog}
            close={() => {
              setCompleteDialog(false);
              setCompleteId('');
            }}
            putUpForAdoptionId={completeId}
            refreshAllPutUpForAdoptions={refreshAllPutUpForAdoptions}
            refreshSelfPets={refreshSelfPets}
          />
        </Portal>
        {
          isFetchingAllPutUpForAdoptions || isFetchingPets ? null : (
            passedCheckPutUpForAdoptions.length ? (
              passedCheckPutUpForAdoptions.map(PutUpForAdoptionItem)
            ) : (
              <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有貼文QQ</Title>
            )
          )
        }
        <View style={{ marginBottom: 70 }} />
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
          setPutUpForAdoptionDialog(true);
        }}
      />
    </>
  );
};

