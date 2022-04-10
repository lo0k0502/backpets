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
import Context from '../../../../context';
import { useReports } from '../../../../hooks';
import { reportTagsArray } from '../../../../utils/constants';
import TagsView from '../TagsView';
import ViolationReportDialog from '../ViolationReportDialog';
import EditReportDialog from './EditReportDialog';
import ReportCard from './ReportCard';
import ReportDialog from './ReportDialog';

export default ({ searchTextState }) => {
  const [searchText, setSearchText] = searchTextState;
  const { allReports, refreshAllReports, isFetchingAllReports } = useReports();
  const { showSnackbar } = useContext(Context);

  const [reportTags, setReportTags] = useState(reportTagsArray.map(tagName => ({ name: tagName, selected: false })));

  const [reportDialog, setReportDialog] = useState(false);// Whether report dialog is open
  const [editReportDialog, setEditReportDialog] = useState(false);// Whether edit report dialog is open
  const [editReport, setEditReport] = useState({});
  const [violationReportDialog, setViolationReportDialog] = useState(false);
  const [editReportPoster, setEditReportPoster] = useState({});

  const selectedTags = reportTagsArray.filter(tag => reportTags.find(_tag => _tag.name === tag && _tag.selected));

  const checkReportMatchTagAndSearchText = (report) => (
    (!selectedTags.length || selectedTags.includes(report.tag))
    && (!searchText || report.content.search(searchText) !== -1)
  );

  const checkReportsMatchTagAndSearchText = () => {
    const reportsMatchTag = selectedTags.length ? (
        allReports.filter(report => selectedTags.includes(report.tag))
    ) : allReports;
    if (!reportsMatchTag.length) return false;

    const reportsMatchTagAndSearchText = searchText ? (
        reportsMatchTag.filter(report => report.content.search(searchText) !== -1)
    ) : reportsMatchTag;

    return reportsMatchTagAndSearchText.length ? true : false;
  };

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
            refreshAllReports={refreshAllReports}
          />
          <EditReportDialog
            report={editReport}
            visible={editReportDialog}
            close={() => setEditReportDialog(false)}
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
              allReports.length ? (
                selectedTags.length || searchText ? (
                  checkReportsMatchTagAndSearchText() ? (
                    allReports.filter(checkReportMatchTagAndSearchText).map(report => (
                      <ReportCard
                        key={report._id}
                        report={report}
                        tagSelected={selectedTags.length}
                        setEditReport={setEditReport}
                        setEditReportDialog={setEditReportDialog}
                        setViolationReportDialog={setViolationReportDialog}
                        setEditReportPoster={setEditReportPoster}
                      />
                    ))
                  ) : (
                    <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有通報QQ</Title>
                  )
                ) : (
                  allReports.map(report => (
                    <ReportCard
                      key={report._id}
                      report={report}
                      setEditReport={setEditReport}
                      setEditReportDialog={setEditReportDialog}
                      setViolationReportDialog={setViolationReportDialog}
                      setEditReportPoster={setEditReportPoster}
                    />
                  ))
                )
              ) : <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有通報QQ</Title>
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

