import React, { useState } from 'react'
import {
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  Divider,
  FAB,
  Portal,
  Title,
  useTheme,
} from 'react-native-paper';
import { useReports } from '../../../../hooks';
import { reportTagsArray } from '../../../../utils/constants';
import TagsView from '../TagsView';
import EditReportDialog from './EditReportDialog';
import ReportCard from './ReportCard';
import ReportDialog from './ReportDialog';

export default ({ searchTextState }) => {
  const [searchText, setSearchText] = searchTextState;
  const { reports, refreshReports, isFetching } = useReports();
  const { colors } = useTheme();

  const [reportTags, setReportTags] = useState(reportTagsArray.map(tagName => ({ name: tagName, selected: false })));

  const [reportDialog, setReportDialog] = useState(false);// Whether report dialog is open
  const [editReportDialog, setEditReportDialog] = useState(false);// Whether edit report dialog is open
  const [editReport, setEditReport] = useState({});

  const selectedTags = reportTagsArray.filter(tag => reportTags.find(_tag => _tag.name === tag && _tag.selected));

  const checkReportMatchTagAndSearchText = (report) => (
    (!selectedTags.length || selectedTags.includes(report.tag))
    && (!searchText || report.content.search(searchText) !== -1)
  );

  const checkReportsMatchTagAndSearchText = () => {
    const reportsMatchTag = selectedTags.length ? (
        reports.filter(report => selectedTags.includes(report.tag))
    ) : reports;
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
            refreshing={isFetching}
            onRefresh={refreshReports}
          />
        )}
      >
        <Portal>
          <ReportDialog
            visible={reportDialog}
            close={() => setReportDialog(false)}
            refreshReports={refreshReports}
          />
          <EditReportDialog
            report={editReport}
            visible={editReportDialog}
            close={() => setEditReportDialog(false)}
            refreshReports={refreshReports}
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
              reports.length ? (
                selectedTags.length || searchText ? (
                  checkReportsMatchTagAndSearchText() ? (
                    reports.map(report => checkReportMatchTagAndSearchText(report) ? (
                      <ReportCard
                        key={report._id}
                        report={report}
                        tagSelected={selectedTags.length}
                        setEditReport={setEditReport}
                        setEditReportDialog={setEditReportDialog}
                      />
                    ) : null)
                  ) : (
                    <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有通報QQ</Title>
                  )
                ) : (
                  reports.map(report => (
                    <ReportCard
                      key={report._id}
                      report={report}
                      setEditReport={setEditReport}
                      setEditReportDialog={setEditReportDialog}
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
        theme={{ colors: { accent: colors.primary } }}
        onPress={() => setReportDialog(true)}
      />
    </>
  );
};

