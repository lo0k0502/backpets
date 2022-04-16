import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Colors, useTheme } from 'react-native-paper';
import { useCurrentLocation, useMissions, useReports, usePets } from '../../../hooks';
import PostCallout from './PostCallout';
import TagsView from '../PostsRoute/TagsView';
import { animalTagsArray, reportTagsArray } from '../../../utils/constants';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/userSlice';

export default ({ route, navigation }) => {
  const user = useSelector(selectUser);

  // Location start
  const { location } = route.params ? route.params : { location: null }; // Location from post

  const { currentLatitude, currentLongitude } = useCurrentLocation();
  const { allMissions } = useMissions();
  const { allReports } = useReports();
  const { colors } = useTheme();

  const [region, setRegion] = useState({ latitude: currentLatitude, longitude: currentLongitude });

  useFocusEffect(useCallback(() => {
    setRegion(location === null ? { latitude: currentLatitude, longitude: currentLongitude } : location);
  }, [location, currentLatitude, currentLongitude]));

  // Tag for Mission
  const { pets } = usePets();
  const [animalTags, setAnimalTags] = useState(animalTagsArray.map(tagName => ({ name: tagName, selected: false })));

  const selectedTagsForMission = animalTagsArray.filter(tag => animalTags.find(_tag => _tag.name === tag && _tag.selected));

  const checkMissionMatchTagAndSearchText = (mission) => {
      const pet = pets.find(_pet => _pet._id === mission.petId);

      return (
          (!selectedTagsForMission.length || selectedTagsForMission.includes(pet.tag))
          && (
              !user.searchText
              || mission.content.search(user.searchText) !== -1
              || pet.name.search(user.searchText) !== -1
              || pet.breed.search(user.searchText) !== -1
              || pet.feature.search(user.searchText) !== -1
              || pet.gender.search(user.searchText) !== -1
          )
      );
  };

  const checkMissionsMatchTagAndSearchText = () => {
    const missionsMatchTag = selectedTagsForMission.length ? (
      allMissions.filter(mission => {
          return selectedTagsForMission.includes(pets.find(_pet => _pet._id === mission.petId).tag);
      })
    ) : allMissions;
    if (!missionsMatchTag.length) return false;

    const missionsMatchTagAndSearchText = user.searchText ? (
      missionsMatchTag.filter(mission => {
        const pet = pets.find(_pet => _pet._id === mission.petId);

        return (
          mission.content.search(user.searchText) !== -1
          || pet.name.search(user.searchText) !== -1
          || pet.breed.search(user.searchText) !== -1
          || pet.feature.search(user.searchText) !== -1
          || pet.gender.search(user.searchText) !== -1
        );
      })
    ) : missionsMatchTag;

    return missionsMatchTagAndSearchText.length ? true : false;
  };
  
  //Tag for Report
  const [reportTags, setReportTags] = useState(reportTagsArray.map(tagName => ({ name: tagName, selected: false })));

  const selectedTagsForReport = reportTagsArray.filter(tag => reportTags.find(_tag => _tag.name === tag && _tag.selected));

  const checkReportMatchTagAndSearchText = (report) => (
    (!selectedTagsForReport.length || selectedTagsForReport.includes(report.tag))
    && (!user.searchText || report.content.search(user.searchText) !== -1)
  );

  const checkReportsMatchTagAndSearchText = () => {
    const reportsMatchTag = selectedTagsForReport.length ? (
        allReports.filter(report => selectedTagsForReport.includes(report.tag))
    ) : allReports;
    if (!reportsMatchTag.length) return false;
    
    const reportsMatchTagAndSearchText = user.searchText ? (
        reportsMatchTag.filter(report => report.content.search(user.searchText) !== -1)
    ) : reportsMatchTag;

    return reportsMatchTagAndSearchText.length ? true : false;
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

      { //Start of Marker for Mission
      allMissions.map((mission, index) => (
        allMissions.length ? (
          selectedTagsForMission.length || user.searchText ? (
            checkMissionsMatchTagAndSearchText() ? (
              allMissions.filter(checkMissionMatchTagAndSearchText).map( mission => (
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
      // End of Marker for Mission
      ))} 

      { //Start of Marker for Report
      allReports.map((report, index) => (
        allReports.length ? (
          selectedTagsForReport.length || user.searchText ? (
            checkReportsMatchTagAndSearchText() ? (
              allReports.filter(checkReportMatchTagAndSearchText).map(report => (
                <Marker
                  key={report._id}
                  coordinate={{
                    latitude: report.location.latitude,
                    longitude: report.location.longitude,
                  }}
                  description={report.content}
                  image={require('../../../../assets/map_marker.png')}
                >
                  <Callout
                    tooltip
                    onPress={() => { } }
                  >
                    <PostCallout report={report} />
                  </Callout>
                </Marker>
              ))
            ) : ( null )
          ) : (
            <Marker
              key={index}
              coordinate={{
                latitude: report.location.latitude,
                longitude: report.location.longitude,
              }}
              description={report.content}
              image={require('../../../../assets/map_marker.png')}
            >
              <Callout
                tooltip
                onPress={() => { } }
              >
                <PostCallout report={report} />
              </Callout>
            </Marker>
          )
        ) : ( null )
      // End of Marker for Report
      ))}
    </MapView>

    <View style={{ flex: 1 }}>
      <TagsView style={{ backgroundColor: 'transparent' }} tagsState={[animalTags, setAnimalTags]} />
    </View>

  </>);
}