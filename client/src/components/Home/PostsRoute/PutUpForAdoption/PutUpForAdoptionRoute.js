import React, { useContext, useState } from 'react';
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
import TagsView from '../TagsView';
import ViolationReportDialog from '../ViolationReportDialog';
import EditPutUpForAdoptionDialog from './EditPutUpForAdoptionDialog';
import PutUpForAdoptionCard from './PutUpForAdoptionCard';
import PutUpForAdoptionDialog from './PutUpForAdoptionDialog';

export default () => {
  const user = useSelector(selectUser);
  const { allPutUpForAdoptions, refreshAllPutUpForAdoptions, isFetchingAllPutUpForAdoptions } = usePutUpForAdoptions();
  const { pets, isFetching: isFetchingPets } = usePets();
  const { selfPets, refreshSelfPets, isFetchingSelfPets } = useSelfPets(user.info?._id);
  const { showSnackbar } = useContext(Context);

  const [putUpForAdoptionDialog, setPutUpForAdoptionDialog] = useState(false);// Whether putUpForAdoption dialog is open
  const [editPutUpForAdoptionDialog, setEditPutUpForAdoptionDialog] = useState(false);// Whether edit putUpForAdoption dialog is open
  const [editPutUpForAdoption, setEditPutUpForAdoption] = useState({});
  const [violationReportDialog, setViolationReportDialog] = useState(false);
  const [editPutUpForAdoptionPoster, setEditPutUpForAdoptionPoster] = useState({});

  const [animalTags, setAnimalTags] = useState(constants.animalTagsArray.map(tagName => ({ name: tagName, selected: false })));
  const [county, setCounty] = useState(constants.all_countys[0]);
  const [district, setDistrict] = useState(constants.all_area_data[county][0]);

  const [countyMenu, setCountyMenu] = useState(false);
  const [districtMenu, setDistrictMenu] = useState(false);

  const selectedTags = constants.animalTagsArray.filter(tag => animalTags.find(_tag => _tag.name === tag && _tag.selected));

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
        county !== '全部'
        && (
          putUpForAdoption.county === county
          && putUpForAdoption.district === district
        )
      )
    );
  };

  const checkPutUpForAdoptionsMatchTagAndSearchTextAndArea = () => {
      const putUpForAdoptionsMatchTag = selectedTags.length ? (
          allPutUpForAdoptions.filter(putUpForAdoption => {
            return selectedTags.includes(pets.find(_pet => _pet._id === putUpForAdoption.petId).tag);
          })
      ) : allPutUpForAdoptions;
      if (!putUpForAdoptionsMatchTag.length) return false;
      
      const putUpForAdoptionsMatchTagAndSearchText = user.searchText ? (
          putUpForAdoptionsMatchTag.filter(putUpForAdoption => {
            const pet = pets.find(_pet => _pet._id === putUpForAdoption.petId);

            return (
              putUpForAdoption.content.search(user.searchText) !== -1
              || pet.name.search(user.searchText) !== -1
              || pet.breed.search(user.searchText) !== -1
              || pet.gender.search(user.searchText) !== -1
            );
          })
      ) : putUpForAdoptionsMatchTag;
      if (!putUpForAdoptionsMatchTagAndSearchText.length) return false

      const putUpForAdoptionsMatchTagAndSearchTextAndArea = county !== '全部' ? (
        putUpForAdoptionsMatchTagAndSearchText.filter(putUpForAdoption => {
          return putUpForAdoption.county === county && putUpForAdoption.district === district;
        })
      ) : putUpForAdoptionsMatchTagAndSearchText;

      return putUpForAdoptionsMatchTagAndSearchTextAndArea.length ? true : false;
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
            allPutUpForAdoptions={allPutUpForAdoptions}
            refreshAllPutUpForAdoptions={refreshAllPutUpForAdoptions}
            isFetchingAllPutUpForAdoptions={isFetchingAllPutUpForAdoptions}
            selfPets={selfPets}
            refreshSelfPets={refreshSelfPets}
            isFetchingSelfPets={isFetchingSelfPets}
          />
          <EditPutUpForAdoptionDialog
            putUpForAdoption={editPutUpForAdoption}
            visible={editPutUpForAdoptionDialog}
            close={() => setEditPutUpForAdoptionDialog(false)}
            refreshAllPutUpForAdoptions={refreshAllPutUpForAdoptions}
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
        </Portal>
        {
          isFetchingAllPutUpForAdoptions || isFetchingPets ? null : (
            allPutUpForAdoptions.length ? (
              selectedTags.length || user.searchText || county !== '全部' ? (
                checkPutUpForAdoptionsMatchTagAndSearchTextAndArea() ? (
                  allPutUpForAdoptions.filter(checkPutUpForAdoptionMatchTagAndSearchTextAndArea).map(putUpForAdoption => (
                    <PutUpForAdoptionCard
                      key={putUpForAdoption._id}
                      putUpForAdoption={putUpForAdoption}
                      tagSelected={selectedTags.length}
                      setEditPutUpForAdoption={setEditPutUpForAdoption}
                      setEditPutUpForAdoptionDialog={setEditPutUpForAdoptionDialog}
                      setViolationReportDialog={setViolationReportDialog}
                      setEditPutUpForAdoptionPoster={setEditPutUpForAdoptionPoster}
                    />
                  ))
                ) : (
                  <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有貼文QQ</Title>
                )
              ) : (
                allPutUpForAdoptions.map(putUpForAdoption => (
                  <PutUpForAdoptionCard
                    key={putUpForAdoption._id}
                    putUpForAdoption={putUpForAdoption}
                    setEditPutUpForAdoption={setEditPutUpForAdoption}
                    setEditPutUpForAdoptionDialog={setEditPutUpForAdoptionDialog}
                    setViolationReportDialog={setViolationReportDialog}
                    setEditPutUpForAdoptionPoster={setEditPutUpForAdoptionPoster}
                  />
                ))
              )
            ) : <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有貼文QQ</Title>
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

