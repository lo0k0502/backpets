import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Colors, Divider, useTheme } from 'react-native-paper';
import { useCurrentLocation, useMissions, usePets } from '../../../hooks';
import PostCallout from './PostCallout';
import AppSearchbar from '../AppSearchbar';
import TagsView from '../PostsRoute/TagsView';
import { constants } from '../../../utils';

export default ({ route, navigation }) => {

  // Location start
  const { location } = route.params ? route.params : { location: null }; // Location from post

  const { currentLatitude, currentLongitude } = useCurrentLocation();
  const { missions } = useMissions();
  const { colors } = useTheme();

  const [region, setRegion] = useState({ latitude: currentLatitude, longitude: currentLongitude });

  useFocusEffect(useCallback(() => {
    setRegion(location === null ? { latitude: currentLatitude, longitude: currentLongitude } : location);
  }, [location, currentLatitude, currentLongitude]));

  // Search Bar
  const [searchText, setSearchText] = useState('');

  // Tag
  const { pets } = usePets();
  const [animalTags, setAnimalTags] = useState(constants.animalTagsArray.map(tagName => ({ name: tagName, selected: false })));

  const selectedTags = constants.animalTagsArray.filter(tag => animalTags.find(_tag => _tag.name === tag && _tag.selected));

    const checkMissionMatchTagAndSearchText = (mission) => {
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
            )
        );
    };

    const checkMissionsMatchTagAndSearchText = () => {
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

        return missionsMatchTagAndSearchText.length ? true : false;
    };
  
  return (

    <>
    <MapView
      provider='google'
      style={{
        ...StyleSheet.absoluteFillObject,
      }}
      region={{
        ...region,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.003,
      }}
      showsUserLocation={true}
      followsUserLocation={true}
    >
      {missions.map((mission, index) => (
        missions.length ? (
          selectedTags.length || searchText ? (
            checkMissionsMatchTagAndSearchText() ? (
              missions.filter(checkMissionMatchTagAndSearchText).map( mission => (
                <Marker
                  key={mission._id}
                  coordinate={{
                    latitude: mission.location.latitude,
                    longitude: mission.location.longitude,
                  }}
                  description={mission.content}
                  image={require('../../../../assets/map_marker.png')}
                >
                  <Callout
                    tooltip
                    onPress={() => { } }
                  >
                    <PostCallout mission={mission} />
                  </Callout>
                </Marker>
              ))
            ) : ( null )
          ) : (
            <Marker
              key={index}
              coordinate={{
                latitude: mission.location.latitude,
                longitude: mission.location.longitude,
              }}
              description={mission.content}
              image={require('../../../../assets/map_marker.png')}
            >
              <Callout
                tooltip
                onPress={() => { } }
              >
                <PostCallout mission={mission} />
              </Callout>
            </Marker>
          )
        ) : ( null )
      ))}
    </MapView>


    <View style={{ flex: 1 }}>
      <AppSearchbar
        style={{ backgroundColor: 'transparent', elevation: 10 }}
        inputStyle={{ backgroundColor: 'white' }}
        outlineColor={colors.primary}
        activeOutlineColor={colors.background2}
        route={route}
        navigation={navigation}
        searchTextState={[searchText, setSearchText]}
      />
      <TagsView style={{ backgroundColor: 'transparent' }} tagsState={[animalTags, setAnimalTags]} />
    </View>

  </>);
}