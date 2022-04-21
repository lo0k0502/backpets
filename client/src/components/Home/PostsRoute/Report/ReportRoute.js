import React, { useContext, useState } from 'react'
import {
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import {
  Divider,
  FAB,
  Portal,
  Title,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import Context from '../../../../context';
import { useReports } from '../../../../hooks';
import { selectUser } from '../../../../redux/userSlice';
import { constants } from '../../../../utils';
import TagsView from '../TagsView';
import ViolationReportDialog from '../ViolationReportDialog';
import ReportCard from './ReportCard';
import ReportDialog from './ReportDialog';

export default () => {
  const user = useSelector(selectUser);
  const { allReports, refreshAllReports, isFetchingAllReports } = useReports();
  const { showSnackbar } = useContext(Context);

  const [reportTags, setReportTags] = useState(constants.reportTagsArray.map(tagName => ({ name: tagName, selected: false })));

  const [reportDialog, setReportDialog] = useState(false);// Whether report dialog is open
  const [editReport, setEditReport] = useState({});
  const [violationReportDialog, setViolationReportDialog] = useState(false);
  const [editReportPoster, setEditReportPoster] = useState({});

  const selectedTags = constants.reportTagsArray.filter(tag => reportTags.find(_tag => _tag.name === tag && _tag.selected));

  const checkReportMatchTagAndSearchText = (report) => (
    (!selectedTags.length || selectedTags.includes(report.tag))
    && (!user.searchText || report.content.search(user.searchText) !== -1)
  );

  const passedCheckReports = allReports.filter(checkReportMatchTagAndSearchText);

  const ReportItem = report => (
    <ReportCard
      key={report._id}
      report={report}
      tagSelected={selectedTags.length}
      setEditReport={setEditReport}
      setReportDialog={setReportDialog}
      setViolationReportDialog={setViolationReportDialog}
      setEditReportPoster={setEditReportPoster}
    />
  );

  return (
    <>
      <TagsView tagsState={[reportTags, setReportTags]} />
      <Divider />
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}
        refreshControl={(
          <RefreshControl
            refreshing={isFetchingAllReports}
            onRefresh={refreshAllReports}
          />
        )}
      >
        <Portal>
          <ReportDialog
            visible={reportDialog}
            close={() => setReportDialog(false)}
            report={editReport}
            setReport={setEditReport}
            refreshAllReports={refreshAllReports}
          />
          <ViolationReportDialog
            postType='report'
            post={editReport}
            poster={editReportPoster}
            visible={violationReportDialog}
            close={() => setViolationReportDialog(false)}
            refreshPosts={refreshAllReports}
            showSnackbar={showSnackbar}
          />
        </Portal>
        {
          isFetchingAllReports ? null : (
            passedCheckReports.length ? (
              passedCheckReports.map(ReportItem)
            ) : (
              <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有通報QQ</Title>
            )
          )
        }
        <View style={{ height: 70 }} />
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
        onPress={() => setReportDialog(true)}
      />
    </>
  );
};

