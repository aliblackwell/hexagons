import PropTypes from 'prop-types';
import { Typography, Box, Button, Fade } from '@mui/material';
import createLevel from '../forms/handlers/createLevel';
import updateLevel from '../forms/handlers/updateLevel';
import { useEffect, useState, useCallback, useContext } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import makeStyles from '@mui/styles/makeStyles';
import getPercentComplete from '../../utils/getPercentComplete';
import LevelStatusTitle from './LevelStatusTitle';
import DialogButton from '../ui-globals/DialogButton';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ErrorBoundary from '../data-fetching/ErrorBoundary';
import { HexagonsContext } from '../data-fetching/HexagonsContext';
import CustomSuspense from '../data-fetching/CustomSuspense';

import Alert from '@mui/material/Alert';

const useStyles = makeStyles((theme) => ({
  level: {
    marginTop: 0,
    marginBottom: theme.spacing(2),
  },
  info: {
    border: 'solid 1px',
    padding: '0px 6px 2px',
    borderRadius: '5px',
  },
  complete: {
    background: theme.palette.success.light,
    borderColor: theme.palette.success.dark,
  },
  incomplete: {
    background: theme.palette.secondary.light,
    borderColor: theme.palette.secondary.main,
  },
  notstarted: {
    background: theme.palette.secondary.light,
    borderColor: theme.palette.secondary.main,
  },
  header: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-between',
  },
  emDash: {
    '@media (max-width: 900px)': {},
  },
  titleBox: {
    display: 'flex',
    justifyContent: 'space-between',
  },

  title: {
    fontFamily: theme.typography.secondaryFamily,
    lineHeight: '1.5',
    fontSize: 'clamp(1.5rem, 3vw, 3rem)',
    marginBottom: theme.spacing(1),
  },
  guidanceBox: {
    '@media (max-width: 900px)': {},
  },
  actionsBox: {
    '@media (max-width: 900px)': {},
  },
  endButton: {
    marginLeft: theme.spacing(1),
    '@media (max-width: 600px)': {},
  },
  icon: {
    '@media (max-width: 600px)': {
      display: 'none',
    },
  },
}));

function calculateCompetenciesForThisLevel(allComps, capabilitiesToMatch) {
  if (allComps) {
    const capString = JSON.stringify(capabilitiesToMatch);
    const competencies = allComps.filter((comp, i) => capString.includes(comp.capability_fk));
    return competencies;
  }
  return null;
}

function LevelStatus({
  currentModule,
  subjectId,
  edSubjectId,
  pupil,
  competencies,
  levelId,
  levelTitle,
  setLevelId,
  ...other
}) {
  const { gqlClient } = useContext(HexagonsContext);

  const classes = useStyles();
  const [visiblePercentComplete, setVisiblePercentComplete] = useState(0);
  const [actualPercentComplete, setActualPercentComplete] = useState(0);

  const [status, setStatus] = useState('notstarted');
  const [readyToShow, setReadyToShow] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);
  const [thisLevelCompetencies, setThisLevelCompetencies] = useState(null);

  useEffect(() => {
    const thisLevelComps = calculateCompetenciesForThisLevel(
      competencies,
      currentModule.capabilities
    );
    setThisLevelCompetencies(thisLevelComps);
  }, [competencies]);

  useEffect(() => {
    if (levelId === 0) {
      setStatus('notstarted');
    }
  }, [levelId, pupil]);

  useEffect(() => {
    setVisiblePercentComplete(0);
    setActualPercentComplete(0);
  }, [pupil]);

  const bubbleGotLevel = useCallback(
    (level) => {
      setLevelId(parseInt(level.id));
      setStatus(level && level.status ? level.status : 'notstarted');
    },
    [setLevelId, setStatus, levelId]
  );

  useEffect(() => {
    setReadyToShow(true);
    const percentComplete = getPercentComplete(thisLevelCompetencies, currentModule.capabilities);
    setActualPercentComplete(percentComplete);
    const percentCompleteWithShortcuts = status === 'complete' ? 100 : percentComplete;
    setVisiblePercentComplete(percentCompleteWithShortcuts);
    if (percentComplete === 100) {
      completeStep();
    }
  }, [thisLevelCompetencies, currentModule, completeStep, status]);

  const triggerCreateLevel = useCallback(
    async (status) => {
      if (status && subjectId && pupil && pupil.id && currentModule && currentModule.id) {
        const variables = {
          status: status,
          subjectId: currentModule.isEd ? edSubjectId : subjectId,
          pupilId: parseInt(pupil.id),
          moduleId: parseInt(currentModule.id),
        };
        const level = await createLevel(gqlClient, variables);
        bubbleGotLevel(level);
      } else {
        console.log(status, subjectId, pupil, currentModule);
        throw new Error('Something has gone wrong. Please refresh and try again.');
      }
    },
    [bubbleGotLevel, pupil, currentModule, gqlClient, subjectId, edSubjectId]
  );

  const triggerUpdateLevel = useCallback(
    async (status) => {
      const variables = {
        status: status,
        subjectId: subjectId,
        levelId: levelId,
      };
      const level = await updateLevel(gqlClient, variables);
      bubbleGotLevel(level);
    },
    [bubbleGotLevel, gqlClient, levelId, subjectId]
  );

  function completeStepHandler(e) {
    e.preventDefault();
    completeStep();
  }

  function markActiveHandler(e) {
    e.preventDefault();
    markActive();
  }

  const completeStep = useCallback(() => {
    if (status && status !== 'complete') {
      if (levelId) {
        triggerUpdateLevel('complete');
      } else {
        //create level and mark as complete
        triggerCreateLevel('complete');
      }
    }
  }, [status, levelId, triggerUpdateLevel, triggerCreateLevel]);

  async function markActive() {
    if (actualPercentComplete === 100) {
      setAlertMessage(
        `Please remove some individual competencies and then mark this ${currentModule.level} as incomplete.`
      );
      return;
    }

    if (status === 'complete') {
      if (levelId) {
        // Mark current level as incomplete
        triggerUpdateLevel('incomplete');
      } else {
        // create level and mark as incomplete
        triggerCreateLevel('incomplete');
      }
    }
  }

  const barValue = parseInt(status === 'complete' ? 100 : visiblePercentComplete);

  return (
    <Fade in={readyToShow}>
      <Box className={classes.level} role="region" aria-live="polite">
        <Box className={classes.titleBox}>
          <CustomSuspense message="Loading level" textOnly={true}>
            <ErrorBoundary alert="Failed to load levels">
              <LevelStatusTitle
                levelTitle={levelTitle}
                bubbleGotLevel={bubbleGotLevel}
                classes={classes}
                status={status}
                {...other}
              />
            </ErrorBoundary>
          </CustomSuspense>
          <Typography
            className={classes.title}
            data-test-id="percent-complete-label"
            variant="h2"
            color="textPrimary"
          >{`${Math.round(visiblePercentComplete)}%`}</Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Box width="100%">
            <LinearProgress color="secondary" variant="determinate" value={barValue} />
          </Box>
        </Box>
        <Box className={classes.header}>
          <Box className={classes.guidanceBox}>

          </Box>

          <Box className={classes.actionsBox}>
            <DialogButton
              modelname="summary"
              title={`View ${levelTitle} summary`}
              label="Summary"
              testId="view-summary-button"
              color="primary"
              variant="contained"
              boxTitle={`${levelTitle} summary`}
            >
              <div style={{ whiteSpace: 'pre' }}>{currentModule.summary}</div>
            </DialogButton>

            {status !== 'complete' && (
              <Button
                title={`Mark ${levelTitle} complete`}
                data-test-id="mark-complete"
                className={classes.endButton}
                variant="contained"
                color="secondary"
                onClick={completeStepHandler}
              >
                Complete
              </Button>
            )}

            {status === 'complete' && (
              <Button
                title={`Mark ${levelTitle} incomplete`}
                data-test-id="mark-incomplete"
                className={classes.endButton}
                variant="outlined"
                color="secondary"
                onClick={markActiveHandler}
              >
                Incomplete
              </Button>
            )}
          </Box>
        </Box>

        {alertMessage && (
          <Alert
            data-test-id="level-status-alert"
            onClose={() => {
              setAlertMessage(false);
            }}
          >
            {alertMessage}
          </Alert>
        )}
      </Box>
    </Fade>
  );
}

LevelStatus.propTypes = {
  currentModule: PropTypes.object,
  subjectId: PropTypes.number,
  pupil: PropTypes.object,
  competencies: PropTypes.array,
  levelId: PropTypes.number,
  levelTitle: PropTypes.string,
  setLevelId: PropTypes.func,
};

export default LevelStatus;
