import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { HexagonsContext } from '../data-fetching/HexagonsContext';
import { useState, useContext, useEffect } from 'react';
import WithAllSubjects from '../data-fetching/WithAllSubjects';
import fileDownload from 'js-file-download';
import { getPupilsByGroup } from '../../queries/Pupils';
import ErrorBoundary from '../data-fetching/ErrorBoundary';
import CustomSuspense from '../data-fetching/CustomSuspense';
import useSWR from 'swr';
import { getLevelsForOverview } from '../../queries/Pupils';

import { Alert } from '@mui/material';
import getCurrentLevel from '../../utils/getCurrentLevel';
import Loading from '../ui-globals/Loading';
import getNormalisedModuleNumber from '../../utils/getNormalisedModuleNumber';
import makeManualGraphQLRequest from '../data-fetching/makeManualGraphQLRequest';

function GetAllPupilsAndSubjects({ user, groupName, pupilsByGroupVariables, allSubjects }) {
  const [loading, setLoading] = useState(true);
  const [reportContent, setReportContent] = useState('');

  useEffect(() => {
    setReportContent('');
  }, [groupName]);

  async function getLevel(getLevelVariables) {
    return await makeManualGraphQLRequest({
      strapiToken: user.strapiToken,
      query: getLevelsForOverview,
      variables: getLevelVariables,
    });
  }

  async function queryAllData(pupilsData, subjectsData) {
    const pupilsWithLevelVars = pupilsData.pupils.map((pupil, i) => {
      const levels = subjectsData.map((subject, j) => {
        return { subjectId: parseInt(subject.id), pupilId: parseInt(pupil.id) };
      });
      return levels;
    });

    const pupilsWithLevels = await pupilsWithLevelVars.map(async (pupil, i) => {
      const levels = pupil.map(async (getLevelVariables, j) => {
        const levelData = await getLevel(getLevelVariables);
        return getCurrentLevel(levelData.data.levels);
      });
      const resolvedLevels = await Promise.all(levels);
      return resolvedLevels;
    });
    const resolvedPupilsWithLevels = await Promise.all(pupilsWithLevels);
    return resolvedPupilsWithLevels;
  }

  const { data: pupilsData } = useSWR([getPupilsByGroup, pupilsByGroupVariables], {
    suspense: true,
  });

  useEffect(() => {
    queryAllData(pupilsData, allSubjects).then((result) => {
      createReport(result);
    });
  }, [pupilsData, allSubjects, queryAllData]);

  function getModuleLabel(level) {
    // Below returns e.g. 1.45, 7.45
    let normalisedModuleNumber = getNormalisedModuleNumber(level.module);
    let label = `${normalisedModuleNumber}.${level.percentComplete}`;
    if (parseInt(level.percentComplete) === 100) {
      label = normalisedModuleNumber + 1; // round up to next level if at 100% complete
    }
    return label;
  }

  function createReport(subjectPositionsByPupil) {
    let csv = 'Pupil';
    csv += allSubjects.map((subject) => `, ${subject.slug}`).join('');
    csv += '\r\n';
    //csv += 'Pupil Name, result 1, result 2'
    csv += subjectPositionsByPupil
      .map((positionList, i) => {
        const pupilName = pupilsData.pupils[i].name;
        const subjectPositionList = positionList
          .map((level, j) => {
            if (!level) return ', ';
            return `, ${getModuleLabel(level)}`;
          })
          .join('');
        return `${pupilName} ${subjectPositionList} \r\n`;
      })
      .join('');
    setReportContent(csv);
    setLoading(false);
  }

  return (
    <>
      {loading && <Loading message="Fetching report data" />}
      {!loading && (
        <Button
          size="large"
          variant="contained"
          color="primary"
          onClick={() => fileDownload(reportContent, 'report.csv')}
        >
          Download {groupName} report
        </Button>
      )}
    </>
  );
}

function DataExport({ user, groupName, activeGroupId, allSubjects }) {
  const { orgId } = useContext(HexagonsContext);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    setGeneratingReport(false);
  }, [activeGroupId]);

  function handleDownload() {
    setGeneratingReport(true);
  }

  return (
    <>
      {!groupName && (
        <Alert data-test-id="please-choose-group">Please choose a group to report on.</Alert>
      )}
      {groupName && (
        <>
          {!generatingReport && (
            <Button size="large" variant="contained" color="secondary" onClick={handleDownload}>
              Generate {groupName} Report
            </Button>
          )}
          {generatingReport && (
            <ErrorBoundary alert="Error generating report">
              <CustomSuspense message="Generating report">
                <GetAllPupilsAndSubjects
                  user={user}
                  allSubjects={allSubjects}
                  groupName={groupName}
                  pupilsByGroupVariables={{ groupId: activeGroupId, orgId: orgId }}
                />
              </CustomSuspense>
            </ErrorBoundary>
          )}
        </>
      )}
    </>
  );
}

DataExport.propTypes = {
  user: PropTypes.object,
  groupName: PropTypes.string,
  activeGroupId: PropTypes.number,
};

export default WithAllSubjects(DataExport);
