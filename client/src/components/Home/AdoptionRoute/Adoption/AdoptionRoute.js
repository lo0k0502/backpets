import React, { useState } from 'react';
import { View, RefreshControl } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { Divider, Portal, Title } from 'react-native-paper';
import { useAdoptionData } from '../../../../hooks';
import { constants } from '../../../../utils';
import AdoptionCard from './AdoptionCard';
import TagsView from '../../../common/TagsView';
import { selectUser } from '../../../../redux/userSlice';
import { useSelector } from 'react-redux';
import DetailDialog from './DetailDialog';

export default () => {
  const user = useSelector(selectUser);
  const { data, refreshData, isFetchingData } = useAdoptionData();

  const [detailDialog, setDetailDialog] = useState(false);
  const [detailDailogData, setDetailDialogData] = useState({});

  const [animalTags, setAnimalTags] = useState(['貓', '狗', '其他'].map(tagName => ({ name: tagName, selected: false })));

  const selectedTags = animalTags.filter(_tag => _tag.selected).map(_tag => _tag.name);

  const checkData = (item) => (
    (
      !selectedTags.length
      || selectedTags.includes(item.animal_kind)
    ) && (
      !user.searchText
      || item.animal_foundplace.search(user.searchText) !== -1
      || item.shelter_name.search(user.searchText) !== -1
    )
  );

  const passedCheckData = data.filter(checkData);

  return (
    <>
      <TagsView tagsState={[animalTags, setAnimalTags]} />
      <Divider />
      {
        !isFetchingData && !passedCheckData.length ? (
          <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有資料QQ</Title>
        ) : null
      }
      <Portal>
        <DetailDialog
          visible={detailDialog}
          close={() => {
            setDetailDialog(false);
            setDetailDialogData({});
          }}
          adoption={detailDailogData}
        />
      </Portal>
      <FlatGrid
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}
        contentContainerStyle={{ paddingBottom: 70 }}
        refreshControl={(
          <RefreshControl
            refreshing={isFetchingData}
            onRefresh={refreshData}
          />
        )}
        itemDimension={constants.boxSize}
        data={isFetchingData ? [] : passedCheckData}
        renderItem={({ item }) => (
          <AdoptionCard
            item={item}
            tagSelected={selectedTags.length}
            onDetailPress={() => {
              setDetailDialogData(item);
              setDetailDialog(true);
            }}
          />
        )}
      />
    </>
  );
};