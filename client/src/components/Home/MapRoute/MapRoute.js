import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Colors, useTheme, FAB } from 'react-native-paper';
import { useCurrentLocation, useMissions, useReports, usePets } from '../../../hooks';
import PostCallout from './PostCallout';
import PlaceCallout from './PlaceCallout';
import ReportCallout from './ReportCallout';
import TagsView from '../../common/TagsView';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/userSlice';
import { constants } from '../../../utils';

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 70,
    elevation: 1,
  },
  appSearchBar: { 
    backgroundColor: 'transparent', 
    elevation: 10,
  },
  tagsView: { 
    backgroundColor: 'transparent',
  },
})

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

  const mapView = React.createRef();
  const backToCurrentLocation = () => {
    mapView.current.animateToRegion({
      latitude: currentLatitude,
      longitude: currentLongitude,
      ...constants.locationDeltas,
    }, 500)
  };

  // Tag for Mission
  const { pets } = usePets();
  const [animalTags, setAnimalTags] = useState(constants.animalTagsArray.map(tagName => ({ name: tagName, selected: false })));

  const selectedTagsForMission = constants.animalTagsArray.filter(tag => animalTags.find(_tag => _tag.name === tag && _tag.selected));

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
  const [reportTags, setReportTags] = useState(constants.reportTagsArray.map(tagName => ({ name: tagName, selected: false })));

  const selectedTagsForReport = constants.reportTagsArray.filter(tag => reportTags.find(_tag => _tag.name === tag && _tag.selected));

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

  //Hospital
  const hospital_ChiaYi = require('./Hospital_ChiaYi.json');
  
  return (

    <>
    <MapView
    ref={ mapView }
      provider='google'
      style={ styles.map }
      region={{
        ...region,
        ...constants.locationDeltas,
      }}
      showsUserLocation={true}
      followsUserLocation={true}
      showsMyLocationButton={false}
    >

      {//Chia Yi Hospital map
      hospital_ChiaYi.map((hospital, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: hospital.lat,
            longitude: hospital.long,
          }}
          description={hospital.name}
          image={require('../../../../assets/hospital_marker.png')}
        >
          <Callout
            tooltip
            onPress={() => { } }
          >
            <PlaceCallout hospital={hospital} />
          </Callout>
        </Marker>
      ))}

      { //Start of Marker for Mission
      allMissions.map((mission, index) => (
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
      // End of Marker for Mission
      ))} 

      { //Start of Marker for Report
      allReports.map((report, index) => (
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
                  <ReportCallout report={report} />
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
              <ReportCallout report={report} />
            </Callout>
          </Marker>
        )
      // End of Marker for Report
      ))}
    </MapView>

    <FAB
      small
      style = { styles.fab }
      icon = 'map-marker'
      onPress = { () => { backToCurrentLocation() }}
    />

    <View style={{ flex: 1 }}>
      <TagsView 
        style={ styles.tagsView } 
        tagsState={[animalTags, setAnimalTags]}
      />
    </View>
  </>);
}