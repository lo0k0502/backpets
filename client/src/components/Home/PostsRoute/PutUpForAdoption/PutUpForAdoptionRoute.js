import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Divider, FAB, Portal, useTheme } from 'react-native-paper';
import { animalTagsArray } from '../../../../utils/constants';
import TagsView from '../TagsView';

export default () => {
  const { colors } = useTheme();

  const [putUpForAdoptionDialog, setPutUpForAdoptionDialog] = useState(false);// Whether putUpForAdoption dialog is open

  const [animalTags, setAnimalTags] = useState(animalTagsArray.map(tagName => ({ name: tagName, selected: false })));

  return (
    <>
      <TagsView tagsState={[animalTags, setAnimalTags]} />
      <Divider />
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        <Portal>
          
        </Portal>
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

