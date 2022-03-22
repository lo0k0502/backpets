import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ActivityIndicator, Divider, FAB, Portal, Text, Title, useTheme } from 'react-native-paper';
import { usePutUpForAdoptions } from '../../../../hooks';
import { animalTagsArray } from '../../../../utils/constants';
import TagsView from '../TagsView';
import PutUpForAdoptionCard from './PutUpForAdoptionCard';
import PutUpForAdoptionDialog from './PutUpForAdoptionDialog';

export default ({ searchTextState }) => {
  const [searchText, setSearchText] = searchTextState;
  const { putUpForAdoptions, refreshPutUpForAdoptions, isFetching } = usePutUpForAdoptions();
  const { colors } = useTheme();

  const [putUpForAdoptionDialog, setPutUpForAdoptionDialog] = useState(false);// Whether putUpForAdoption dialog is open

  const [animalTags, setAnimalTags] = useState(animalTagsArray.map(tagName => ({ name: tagName, selected: false })));

  const selectedTags = animalTagsArray.filter(tag => animalTags.find(_tag => _tag.name === tag && _tag.selected));

  const checkPutUpForAdoptionMatchTagAndSearchText = (putUpForAdoption) => (
      (!selectedTags.length || selectedTags.includes(putUpForAdoption.tag))
      && (
          !searchText
          || putUpForAdoption.content.search(searchText) !== -1
          || putUpForAdoption.breed.search(searchText) !== -1
          || putUpForAdoption.gender.search(searchText) !== -1
      )
  );

  const checkPutUpForAdoptionsMatchTagAndSearchText = () => {
      const putUpForAdoptionsMatchTag = selectedTags.length ? (
          putUpForAdoptions.filter(putUpForAdoption => selectedTags.includes(putUpForAdoption.tag))
      ) : putUpForAdoptions;
      if (!putUpForAdoptionsMatchTag.length) return false;
      
      const putUpForAdoptionsMatchTagAndSearchText = searchText ? (
          putUpForAdoptionsMatchTag.filter(putUpForAdoption => (
              putUpForAdoption.content.search(searchText) !== -1
              || putUpForAdoption.breed.search(searchText) !== -1
              || putUpForAdoption.gender.search(searchText) !== -1
          ))
      ) : putUpForAdoptionsMatchTag;

      return putUpForAdoptionsMatchTagAndSearchText.length ? true : false;
  };

  return (
    <>
      <TagsView tagsState={[animalTags, setAnimalTags]} />
      <Divider />
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        <Portal>
          <PutUpForAdoptionDialog
            visible={putUpForAdoptionDialog}
            close={() => setPutUpForAdoptionDialog(false)}
            refreshPutUpForAdoptions={refreshPutUpForAdoptions}
          />
        </Portal>
        {
          isFetching ? (
            <ActivityIndicator
              animating={true}
              size='large'
              style={{ marginTop: 50 }}
            />
          ) : (
            putUpForAdoptions.length ? (
              selectedTags.length || searchText ? (
                checkPutUpForAdoptionsMatchTagAndSearchText() ? (
                  putUpForAdoptions.map(putUpForAdoption => checkPutUpForAdoptionMatchTagAndSearchText(putUpForAdoption) ? (
                    <PutUpForAdoptionCard
                      key={putUpForAdoption._id}
                      putUpForAdoption={putUpForAdoption}
                    />
                  ) : null)
                ) : (
                  <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有貼文QQ</Title>
                )
              ) : (
                putUpForAdoptions.map(putUpForAdoption => (
                  <PutUpForAdoptionCard
                    key={putUpForAdoption._id}
                    putUpForAdoption={putUpForAdoption}
                  />
                ))
              )
            ) : <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有貼文QQ</Title>
          )
        }
      </ScrollView>
      <FAB
        icon='plus'
        color='white'
        style={{
          position: 'absolute',
          right: 10,
          bottom: 70,
          elevation: 1,
        }}
        theme={{ colors: { accent: colors.primary } }}
        onPress={() => setPutUpForAdoptionDialog(true)}
      />
    </>
  );
};

