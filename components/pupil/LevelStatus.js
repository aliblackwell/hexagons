import PropTypes from 'prop-types';
import { Typography, Box, Button, Fade, Snackbar, Alert } from '@mui/material';
import createLevel from '../forms/handlers/createLevel';
import updateLevel from '../forms/handlers/updateLevel';
import { useEffect, useState, useCallback, useContext } from 'react';
import Popover from '@mui/material/Popover';
import LinearProgress from '@mui/material/LinearProgress';
import makeStyles from '@mui/styles/makeStyles';
import { getPercentComplete, getPercentFromStatus } from '../../utils/getPercentComplete';

import LevelStatusTitle from './LevelStatusTitle';
import DialogButton from '../ui-globals/DialogButton';
import ErrorBoundary from '../data-fetching/ErrorBoundary';
import { HexagonsContext } from '../data-fetching/HexagonsContext';
import CustomSuspense from '../data-fetching/CustomSuspense';
import calculateCompetenciesForThisLevel from '../../utils/calculateCompetenciesForThisLevel';
import { deleteCompetencies } from '../forms/handlers/deleteCompetencies';
import { deleteLevel } from '../forms/handlers/deleteLevel';

const useStyles = makeStyles((theme) => ({
  level: {
    marginTop: 0,
    marginBottom: 0,
  },
  info: {
    textTransform: 'capitalize',
    marginLeft: theme.spacing(1),
  },
  meta: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(3),
    display: 'flex',
    width: '100%',
    justifyContent: 'end',
    '@media (max-width: 600px)': {
      width: '100%',
      justifyContent: 'end',
    },
  },
  emDash: {
    '@media (max-width: 900px)': {},
  },
  titleBox: {
    display: 'flex',
    justifyContent: 'space-between',
    '@media (max-width: 600px)': {
      display: 'block',
      textAlign: 'right',
    },
  },
  status: {
    display: 'flex',
    width: '100%',
    '@media (max-width: 600px)': {
      justifyContent: 'end',
    },
  },
  title: {
    fontFamily: theme.typography.secondaryFamily,
    lineHeight: '1.5',
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    marginBottom: theme.spacing(1),
    '@media (max-width: 600px)': {
      display: 'inline',
      textAlign: 'right',
    },
  },
  percentage: {
    width: '5rem',
    textAlign: 'right',
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

function LevelStatus({
  isAssessing,
  setIsAssessing,
  currentModule,
  subjectId,
  edSubjectId,
  pupil,
  competencies,
  levelId,
  levelWasQuickAssessed,
  setCurrentScore,
  levelTitle,
  setLevelId,
  setCurrentScoreForTargetPanel,
  ...other
}) {
  const { gqlClient } = useContext(HexagonsContext);

  const classes = useStyles();
  const [visiblePercentComplete, setVisiblePercentComplete] = useState(0); // what is displaying currently?
  const [actualPercentComplete, setActualPercentComplete] = useState(0); // what is the percentage based on competencies/capabilities?
  const [hasBeenQuickAssessed, setHasBeenQuickAssessed] = useState(levelWasQuickAssessed); // current level wasQuickAssessed
  const [status, setStatus] = useState('notstarted'); // current level status
  const [readyToShow, setReadyToShow] = useState(false);
  const [gotPercent, setGotPercent] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [thisLevelCompetencies, setThisLevelCompetencies] = useState(null);

  useEffect(() => {
    // Keep state var in sync with level
    setHasBeenQuickAssessed(levelWasQuickAssessed);
  }, [levelWasQuickAssessed]);

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
    // When pupil changes, reset the percentages
    setVisiblePercentComplete(0);
    setActualPercentComplete(0);
  }, [pupil]);

  const gotLevel = useCallback(
    (level, targetCurrentScore) => {
      if (level) {
        setLevelId(parseInt(level.id));
        setStatus(level.status ? level.status : 'notstarted');
        setHasBeenQuickAssessed(level.wasQuickAssessed ? level.wasQuickAssessed : false);
      }
      if(targetCurrentScore) {
        console.log('CURRENT SCORE1', targetCurrentScore)
        setCurrentScoreForTargetPanel(targetCurrentScore);
      }
    },
    [setLevelId, setStatus, levelId, status, setCurrentScore]
  );

  const bubbleGotLevel = useCallback(
    // whenever the level updates, but only when it's changed
    (level, targetCurrentScore) => {
      if (level) {
        gotLevel(level, targetCurrentScore);
      }
      setReadyToShow(true);
    },
    [setLevelId, setStatus, levelId]
  );



  useEffect(() => {
    if (readyToShow && levelId !== 0) {
      // calculate percentages whenever competencies change
      let visiblePercentComplete;
      let actualPercentComplete = getPercentComplete(
        thisLevelCompetencies,
        currentModule.capabilities
      );

      if (hasBeenQuickAssessed) {
        visiblePercentComplete = getPercentFromStatus(status);
      } else {
        visiblePercentComplete = actualPercentComplete;
      }
      setActualPercentComplete(actualPercentComplete);
      setVisiblePercentComplete(visiblePercentComplete);

      if (isAssessing && hasBeenQuickAssessed) {
        setHasBeenQuickAssessed(false);
      }

      if (actualPercentComplete === 100) {
        completeStep({ wasQuickAssessed: false });
      }
      setGotPercent(true);
    } else {
      setGotPercent(false);
    }
  }, [thisLevelCompetencies, readyToShow]);

  const triggerCreateLevel = useCallback(
    async ({ status, wasQuickAssessed }) => {
      if (status && subjectId && pupil && pupil.id && currentModule && currentModule.id) {
        const variables = {
          status: status,
          wasQuickAssessed: wasQuickAssessed,
          subjectId: currentModule.isTransition ? edSubjectId : subjectId,
          pupilId: parseInt(pupil.id),
          moduleId: parseInt(currentModule.id),
        };
        const level = await createLevel(gqlClient, variables);
        gotLevel(level);
      } else {
        console.log(status, subjectId, pupil, currentModule);
        throw new Error('Something has gone wrong. Please refresh and try again.');
      }
    },
    [gotLevel, pupil, currentModule, gqlClient, subjectId, edSubjectId]
  );

  const triggerUpdateLevel = useCallback(
    async ({ status, wasQuickAssessed }) => {
      const variables = {
        status: status,
        subjectId: subjectId,
        levelId: levelId,
        wasQuickAssessed: wasQuickAssessed,
      };
      const level = await updateLevel(gqlClient, variables);
      setHasBeenQuickAssessed(level && level.wasQuickAssessed);

      gotLevel(level);
    },
    [gotLevel, gqlClient, levelId, subjectId]
  );

  function completeStepHandler(e) {
    e.preventDefault();
    setIsAssessing(false);
    completeStep({ wasQuickAssessed: true });
  }

  function markActiveHandler(e, manualStatus) {
    e.preventDefault();
    setIsAssessing(false);
    markActive(manualStatus);
  }

  const completeStep = useCallback(
    ({ wasQuickAssessed }) => {
      if (status && status !== 'complete') {
        setVisiblePercentComplete(100);
        const args = {
          status: 'complete',
          wasQuickAssessed: wasQuickAssessed,
        };
        if (levelId) {
          triggerUpdateLevel(args);
        } else {
          //create level and mark as complete
          triggerCreateLevel(args);
        }
      }
    },
    [status, levelId, triggerUpdateLevel, triggerCreateLevel]
  );

  const gotHiddenComps = () => {
    const targetCompetencies = !!thisLevelCompetencies.filter((c) => c.status === 'target').length;
    const completeCompetencies = !!thisLevelCompetencies.filter((c) => c.status === 'complete')
      .length;
    return {targetCompetencies, completeCompetencies}
  }

  async function markActive(manualStatus) {
    const {targetCompetencies, completeCompetencies} = gotHiddenComps()
    if (actualPercentComplete === 100) {
      setAlertMessage(
        `Please remove some individual competencies and then mark this ${currentModule.level} as ${manualStatus}.`
      );
      setAlertOpen(true);
      return;
    }

    if (actualPercentComplete > 75 && manualStatus === 'secure') {
      setAlertMessage(
        `Please remove some individual competencies reducing the percentage below 75 and then mark this ${currentModule.level} as ${manualStatus}.`
      );
      setAlertOpen(true);
      return;
    }

    if (actualPercentComplete > 60 && manualStatus === 'developing') {
      setAlertMessage(
        `Please remove some individual competencies reducing the percentage below 60 and then mark this ${currentModule.level} as ${manualStatus}.`
      );
      setAlertOpen(true);
      return;
    }

    if (actualPercentComplete > 25 && manualStatus === 'emerging') {
      setAlertMessage(
        `Please remove some individual competencies reducing the percentage below 25 and then mark this ${currentModule.level} as ${manualStatus}.`
      );
      setAlertOpen(true);
      return;
    }

    if (actualPercentComplete >= 0 && manualStatus === 'not started' && (targetCompetencies || completeCompetencies) ) {
      setAlertMessage(
        `Please remove all individual competencies (including targets) to delete this level`
      );
      setAlertOpen(true);
      return;
    }

    if (actualPercentComplete === 0 && manualStatus === 'not started' && (!targetCompetencies && !completeCompetencies)) {
      void deleteCompetenciesAndLevels()
      return;
    }

    const visiblePercent = getPercentFromStatus(manualStatus);
    setVisiblePercentComplete(visiblePercent);
    const args = {
      status: manualStatus,
      wasQuickAssessed: true,
    };
    if (levelId) {
      // Mark current level as manual status
      triggerUpdateLevel(args);
    } else {
      // create level and mark as manual status
      triggerCreateLevel(args);
    }
    setHasBeenQuickAssessed(true);
  }

  // Popover
  const statuses = ['not started', 'emerging', 'developing', 'secure'];
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const popoverOpen = Boolean(popoverAnchorEl);
  const popoverId = popoverOpen ? 'simple-popover' : undefined;
  function quickAssessHandler(event) {
    setPopoverAnchorEl(event.currentTarget);
  }
  function handleQuickAssessClose() {
    setPopoverAnchorEl(null);
  }

  useEffect(() => {
    if (!hasBeenQuickAssessed && readyToShow) {
      let args = {
        wasQuickAssessed: false,
      };

      if (actualPercentComplete === 100) {
        if (status !== 'complete') {
          args.status = 'complete';
          setStatus('complete')
          triggerUpdateLevel(args);
          setVisiblePercentComplete(actualPercentComplete);
          setHasBeenQuickAssessed(false);
          return;
        }
        return;
      }

      if (actualPercentComplete > 75) {
        setVisiblePercentComplete(actualPercentComplete);
        setHasBeenQuickAssessed(false);
        return;
      }

      if (actualPercentComplete > 60) {
        if (status !== 'secure') {
          args.status = 'secure';
          setStatus('secure')
          triggerUpdateLevel(args);
          setVisiblePercentComplete(actualPercentComplete);
          setHasBeenQuickAssessed(false);
          return;
        }
        return;
      }

      if (actualPercentComplete > 25) {
        if (status !== 'developing') {
          args.status = 'developing';
          setStatus('developing')
          triggerUpdateLevel(args);
          setVisiblePercentComplete(actualPercentComplete);
          setHasBeenQuickAssessed(false);
          return;
        }
        return;
      }

      if (actualPercentComplete >= 0) {
        if (status !== 'emerging') {
          args.status = 'emerging';
          setStatus('emerging')
          triggerUpdateLevel(args);
          setVisiblePercentComplete(actualPercentComplete);
          setHasBeenQuickAssessed(false);
          return;
        }
        return;
      }
    }
  }, [actualPercentComplete, hasBeenQuickAssessed]);



  const deleteCompetenciesAndLevels = useCallback(async () => {
    const {targetCompetencies, completeCompetencies} = gotHiddenComps()
    if (!targetCompetencies && !completeCompetencies && levelId !== 0) {
      await deleteCompetencies(gqlClient, thisLevelCompetencies);
      await deleteLevel(gqlClient, { id: levelId });
      setStatus('notstarted');
      setVisiblePercentComplete(actualPercentComplete);
      setLevelId(0);
      setGotPercent(false);
    }
  }, [actualPercentComplete, gqlClient, levelId, setLevelId, thisLevelCompetencies]);

  useEffect(() => {
    // delete ghost levels
    async function checkAndDeleteGhostLevels() {
      if (visiblePercentComplete === 0) {
        if (thisLevelCompetencies === null) return;
        if (thisLevelCompetencies.length === 0) return;
        await deleteCompetenciesAndLevels();
        return;
      }
    }
    void checkAndDeleteGhostLevels();
  }, [
    visiblePercentComplete,
    hasBeenQuickAssessed,
    thisLevelCompetencies,
    levelId,
    actualPercentComplete,
    gqlClient,
    setLevelId,
    deleteCompetenciesAndLevels
  ]);

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const displayValue = Math.round(visiblePercentComplete);

  return (
    <Box className={classes.level} role="region" aria-live="polite">
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert
          severity="error"
          data-test-id="level-status-alert"
          sx={{ width: '100%' }}
          onClose={handleAlertClose}
        >
          {alertMessage}
        </Alert>
      </Snackbar>

      <Box display="flex" alignItems="center">
        <Box width="100%">
          <LinearProgress color="secondary" variant="determinate" value={displayValue} />
        </Box>
      </Box>
      <Box className={classes.titleBox}>
        <Fade in={gotPercent}>
          <Box className={classes.status}>
            <Typography
              className={`${classes.title} ${classes.percentage}`}
              data-test-id="percent-complete-label"
              variant="h2"
              color="textPrimary"
            >
              {`${displayValue}%`}
            </Typography>
            <Typography data-test-id="level-status-title" className={classes.title} variant="h2">
              {status !== 'notstarted' && (
                <span>
                  <span
                    data-test-id="level-status-status"
                    className={`${classes.info} ${
                      classes[status !== 'complete' ? 'incomplete' : 'complete']
                    }`}
                  >
                    – {status === 'incomplete' ? 'emerging' : status}
                  </span>
                </span>
              )}
            </Typography>
            <CustomSuspense message="" textOnly={true}>
              <ErrorBoundary alert="Failed to load levels">
                <LevelStatusTitle bubbleGotLevel={bubbleGotLevel} {...other} />
              </ErrorBoundary>
            </CustomSuspense>
          </Box>
        </Fade>

        <Box className={classes.meta}>
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

            <Button
              aria-describedby={popoverId}
              title={`Quick assess ${levelTitle}`}
              data-test-id="quick-assess"
              className={classes.endButton}
              variant="contained"
              color="secondary"
              onClick={quickAssessHandler}
            >
              Quick assess
            </Button>
            <Popover
              PaperProps={{ sx: { padding: '1rem' } }}
              id={popoverId}
              open={popoverOpen}
              anchorEl={popoverAnchorEl}
              onClose={handleQuickAssessClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              {statuses.map((manualStatus, i) => (
                <Button
                  key={`status-button-${i}`}
                  title={`Mark ${levelTitle} ${manualStatus}`}
                  data-test-id={`mark-${manualStatus}`}
                  className={classes.endButton}
                  variant="contained"
                  color="secondary"
                  onClick={(e) => markActiveHandler(e, manualStatus)}
                >
                  {manualStatus}
                </Button>
              ))}

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
            </Popover>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

LevelStatus.propTypes = {
  currentModule: PropTypes.object,
  subjectId: PropTypes.number,
  pupil: PropTypes.object,
  competencies: PropTypes.array,
  levelId: PropTypes.number,
  levelWasQuickAssessed: PropTypes.bool,
  levelTitle: PropTypes.string,
  setLevelId: PropTypes.func,
};

export default LevelStatus;
