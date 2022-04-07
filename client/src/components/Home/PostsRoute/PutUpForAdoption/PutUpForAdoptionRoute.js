import React, { useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Divider,
  FAB,
  Menu,
  Portal,
  Subheading,
  Title,
  useTheme,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import { usePets, usePutUpForAdoptions, useFocusSelfPets } from '../../../../hooks';
import { selectUser } from '../../../../redux/userSlice';
import { constants } from '../../../../utils';
import SelectButton from '../../SelectButton';
import TagsView from '../TagsView';
import EditPutUpForAdoptionDialog from './EditPutUpForAdoptionDialog';
import PutUpForAdoptionCard from './PutUpForAdoptionCard';
import PutUpForAdoptionDialog from './PutUpForAdoptionDialog';

export default ({ searchTextState }) => {
  const [searchText, setSearchText] = searchTextState;
  const user = useSelector(selectUser);
  const { putUpForAdoptions, refreshPutUpForAdoptions, isFetching } = usePutUpForAdoptions();
  const { pets, isFetching: isFetchingPets } = usePets();
  const { pets: selfPets, isFetching: isFetchingSelfPets } = useFocusSelfPets(user.info?._id);
  const { colors } = useTheme();

  const [putUpForAdoptionDialog, setPutUpForAdoptionDialog] = useState(false);// Whether putUpForAdoption dialog is open
  const [editPutUpForAdoptionDialog, setEditPutUpForAdoptionDialog] = useState(false);// Whether edit putUpForAdoption dialog is open
  const [editPutUpForAdoption, setEditPutUpForAdoption] = useState({});

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
        !searchText
        || putUpForAdoption.content.search(searchText) !== -1
        || pet.name.search(searchText) !== -1
        || pet.breed.search(searchText) !== -1
        || pet.gender.search(searchText) !== -1
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
          putUpForAdoptions.filter(putUpForAdoption => {
            return selectedTags.includes(pets.find(_pet => _pet._id === putUpForAdoption.petId).tag);
          })
      ) : putUpForAdoptions;
      if (!putUpForAdoptionsMatchTag.length) return false;
      
      const putUpForAdoptionsMatchTagAndSearchText = searchText ? (
          putUpForAdoptionsMatchTag.filter(putUpForAdoption => {
            const pet = pets.find(_pet => _pet._id === putUpForAdoption.petId);

            return (
              putUpForAdoption.content.search(searchText) !== -1
              || pet.name.search(searchText) !== -1
              || pet.breed.search(searchText) !== -1
              || pet.gender.search(searchText) !== -1
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
            refreshing={isFetching}
            onRefresh={refreshPutUpForAdoptions}
          />
        )}
      >
        <Portal>
          <PutUpForAdoptionDialog
            visible={putUpForAdoptionDialog}
            close={() => setPutUpForAdoptionDialog(false)}
            refreshPutUpForAdoptions={refreshPutUpForAdoptions}
          />
          <EditPutUpForAdoptionDialog
            putUpForAdoption={editPutUpForAdoption}
            visible={editPutUpForAdoptionDialog}
            close={() => setEditPutUpForAdoptionDialog(false)}
            refreshPutUpForAdoptions={refreshPutUpForAdoptions}
          />
        </Portal>
        {
          isFetching || isFetchingPets ? (
            <ActivityIndicator
              animating={true}
              size='large'
              style={{ marginTop: 50 }}
            />
          ) : (
            putUpForAdoptions.length ? (
              selectedTags.length || searchText || county !== '全部' ? (
                checkPutUpForAdoptionsMatchTagAndSearchTextAndArea() ? (
                  putUpForAdoptions.filter(checkPutUpForAdoptionMatchTagAndSearchTextAndArea).map(putUpForAdoption => (
                    <PutUpForAdoptionCard
                      key={putUpForAdoption._id}
                      putUpForAdoption={putUpForAdoption}
                      tagSelected={selectedTags.length}
                      setEditPutUpForAdoption={setEditPutUpForAdoption}
                      setEditPutUpForAdoptionDialog={setEditPutUpForAdoptionDialog}
                    />
                  ))
                ) : (
                  <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有貼文QQ</Title>
                )
              ) : (
                putUpForAdoptions.map(putUpForAdoption => (
                  <PutUpForAdoptionCard
                    key={putUpForAdoption._id}
                    putUpForAdoption={putUpForAdoption}
                    setEditPutUpForAdoption={setEditPutUpForAdoption}
                    setEditPutUpForAdoptionDialog={setEditPutUpForAdoptionDialog}
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

