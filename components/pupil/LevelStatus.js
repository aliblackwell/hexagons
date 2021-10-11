import PropTypes from 'prop-types'
import { Typography, Box, Button, Fade } from "@material-ui/core"
import createLevel from '../forms/handlers/createLevel'
import updateLevel from '../forms/handlers/updateLevel'
import { useEffect, useState, useCallback, useContext } from "react"
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from "@material-ui/core"
import getPercentComplete from "../../utils/getPercentComplete"
import LevelStatusTitle from './LevelStatusTitle'
import DialogButton from '../ui-globals/DialogButton'
import LightbulbIcon from '../ui-globals/LightbulbIcon'
import ErrorBoundary from '../data-fetching/ErrorBoundary'
import { HexagonsContext } from '../data-fetching/HexagonsContext'
import CustomSuspense from '../data-fetching/CustomSuspense'

const useStyles = makeStyles((theme) => ({
  level: {
    marginTop: 0,
    marginBottom: theme.spacing(2)
  },
  info: {
    border: 'solid 1px',
    padding: '0px 6px 2px',
    borderRadius: '5px'
  },
  complete: {
    background: theme.palette.success.light,
    borderColor: theme.palette.success.dark
  },
  incomplete: {
    background: theme.palette.secondary.light,
    borderColor: theme.palette.secondary.main
  },
  notstarted: {
    background: theme.palette.secondary.light,
    borderColor: theme.palette.secondary.main
  },
  header: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-between',
  },
  emDash: {
    '@media (max-width: 900px)': { 
    }
  },
  titleBox: {

    display: 'flex',
    justifyContent: 'space-between'

  },

  title: {
    fontFamily: theme.typography.secondaryFamily,
    lineHeight: '1.5',
    fontSize: 'clamp(1.5rem, 3vw, 3rem)',
    marginBottom: theme.spacing(1)
  },
  guidanceBox: {
    '@media (max-width: 900px)': {

    }
  },
  actionsBox: {
    '@media (max-width: 900px)': {

    }
  },
  endButton: {
    marginLeft: theme.spacing(1),
    '@media (max-width: 600px)': {
      
    }
  },
  icon: {
    '@media (max-width: 600px)': {
      display: 'none'
    }
  }
}));


function calculateCompetenciesForThisLevel(allComps, capabilitiesToMatch) {
  if (allComps) {
    const capString = JSON.stringify(capabilitiesToMatch)
    const competencies = allComps.filter((comp, i) => capString.includes(comp.capability_fk))
    return competencies
  }
  return null
}

function LevelStatus({ setGotCurrentLevel,
  setGlobalGuidanceActive,
  setCurrentLevelId,
  currentModule,
  subjectId,
  edSubjectId,
  pupil,
  competencies,
  ...other }) {

  const { gqlClient } = useContext(HexagonsContext)

  const classes = useStyles()
  const [visiblePercentComplete, setVisiblePercentComplete] = useState(0)

  const [visibleLevel, setVisibleLevel] = useState(null)
  const [status, setStatus] = useState('notstarted')
  const [readyToShow, setReadyToShow] = useState(false)

  const moduleLabel = currentModule.level === 'step' ? 'Step' : 'Stage'

  const thisLevelCompetencies = calculateCompetenciesForThisLevel(competencies, currentModule.capabilities)

  const bubbleGotLevel = useCallback((level) => {
    if (level && level.id) {
      setVisibleLevel(level)
      setGotCurrentLevel(true)
      setCurrentLevelId(parseInt(level.id))
      setStatus(level.status ? level.status : 'notstarted')
    }
  }, [setCurrentLevelId, setVisibleLevel, setGotCurrentLevel])


  useEffect(() => {
    const percentComplete = getPercentComplete(thisLevelCompetencies, currentModule.capabilities)
    const percentCompleteWithShortcuts = status === 'complete' ? 100 : percentComplete
    setVisiblePercentComplete(percentCompleteWithShortcuts)
  }, [thisLevelCompetencies, currentModule.capabilities, status])



  useEffect(() => {
    setReadyToShow(true)
    const percentComplete = getPercentComplete(thisLevelCompetencies, currentModule.capabilities)
    if (percentComplete === 100) {
      completeStep()
    }
  }, [visibleLevel, bubbleGotLevel, completeStep, currentModule, thisLevelCompetencies])

  const triggerCreateLevel = useCallback(async (status) => {
    if (status && subjectId && pupil && pupil.id && currentModule && currentModule.id) {
      const variables = {
        status: status,
        subjectId: currentModule.isEd ? edSubjectId : subjectId,
        pupilId: pupil.id,
        moduleId: currentModule.id
      }
      const level = await createLevel(gqlClient, variables)
      bubbleGotLevel(level)
    } else {
      console.log(status, subjectId, pupil, currentModule)
      throw new Error('Something has gone wrong. Please refresh and try again.')
    }
  }, [bubbleGotLevel, pupil, currentModule, gqlClient, subjectId])

  const triggerUpdateLevel = useCallback(async (status) => {
    const variables = {
      status: status,
      subjectId: subjectId,
      levelId: visibleLevel.id
    }
    const level = await updateLevel(gqlClient, variables)

    bubbleGotLevel(level)
  }, [bubbleGotLevel, gqlClient, visibleLevel, subjectId])



  function completeStepHandler(e) {
    e.preventDefault()
    completeStep()
  }

  function markActiveHandler(e) {
    e.preventDefault()
    markActive()
  }

  const completeStep = useCallback(() => {
    if (status && status !== 'complete') {
      if (visibleLevel) {
        triggerUpdateLevel('complete')
      } else {
        //create level and mark as complete
        triggerCreateLevel('complete')
      }
    }
  }, [status, visibleLevel, triggerUpdateLevel, triggerCreateLevel])

  async function markActive() {
    if (status === 'complete') {
      if (visibleLevel) {
        // Mark current level as incomplete
        triggerUpdateLevel('incomplete')

      } else {
        // create level and mark as incomplete
        triggerCreateLevel('incomplete')
      }
    }
  }

  // Guidance feature

  const [guidanceActive, setGuidanceActive] = useState(false)

  useEffect(() => {
    setGlobalGuidanceActive(guidanceActive)
  }, [guidanceActive, setGlobalGuidanceActive])


  return (
    <Fade in={readyToShow}>

      <Box className={classes.level}>



        <Box className={classes.titleBox}>
          <CustomSuspense message="Loading level" textOnly={true}>
            <ErrorBoundary alert="Failed to load levels">
              <LevelStatusTitle
                bubbleGotLevel={bubbleGotLevel}
                classes={classes}
                moduleLabel={moduleLabel}
                status={status}
                moduleOrder={currentModule.order}
                {...other}
              />

            </ErrorBoundary>
          </CustomSuspense>
          <Typography className={classes.title} data-test-id="percent-complete-label" variant="h2" color="textPrimary">{`${Math.round(
            visiblePercentComplete,
          )}%`}</Typography>

        </Box>
        <Box display="flex" alignItems="center">
          <Box width="100%">
            <LinearProgress
              color="secondary"
              variant="determinate"
              value={status === 'complete' ? 100 : visiblePercentComplete} />
          </Box>
        </Box>
        <Box className={classes.header}>




          <Box className={classes.guidanceBox}>
            <DialogButton
              modelname="guidance"
              startIcon={<LightbulbIcon className={classes.icon} viewBox="0 0 100 125" />}
              label={guidanceActive ? 'Go back' : 'Guidance'}
              testId="view-guidance-button"
              color={guidanceActive ? 'secondary' : 'primary'}
              onClose={() => {
                setTimeout(() => {
                  setGuidanceActive(!guidanceActive)
                }, 100)

              }}
              variant="contained"
              boxTitle={`${moduleLabel} ${currentModule.order} summary`}>
              {guidanceActive && (
                <>
                  <p>You are back in assessment mode for {pupil.name}</p>
                </>
              )}
              {!guidanceActive && (
                <>
                  <p>You can now view guidance from colleagues and add your own by tapping the Hexagons</p>
                </>
              )}

            </DialogButton>
          </Box>

          <Box className={classes.actionsBox}>
            <DialogButton
              label="Summary"
              testId="view-summary-button"
              color="primary"
              variant="contained"
              boxTitle={`${moduleLabel} ${currentModule.order} summary`}>
              {currentModule.summary}
            </DialogButton>

            {status !== 'complete' && <Button
              data-test-id="mark-complete"
              className={classes.endButton}
              variant="contained"
              color="secondary"
              onClick={completeStepHandler}>Complete</Button>}
            {status === 'complete' && <Button
              data-test-id="mark-incomplete"
              className={classes.endButton}
              variant="outlined"
              color="secondary"
              onClick={markActiveHandler}>Incomplete</Button>}

          </Box>
        </Box>

      </Box>

    </Fade>
  )
}

LevelStatus.propTypes = {
  setGotCurrentLevel: PropTypes.func,
  setGlobalGuidanceActive: PropTypes.func,
  setCurrentLevelId: PropTypes.func,
  currentModule: PropTypes.object,
  subjectId: PropTypes.number,
  pupil: PropTypes.object,
  competencies: PropTypes.array
}

export default LevelStatus