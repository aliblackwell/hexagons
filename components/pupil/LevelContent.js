import PropTypes from 'prop-types'
import WithCompetencies from '../data-fetching/WithCompetencies'
import CustomSuspense from '../data-fetching/CustomSuspense'
import LevelStatus from './LevelStatus'
import CapabilityTiles from '../subjects/CapabilityTiles'
import { useState, useEffect } from 'react'

function LevelContent({
  pupil,
  initialCompetencies,
  edSubjectId,
  subjectId,
  levelId,
  setLevelId,
  currentModule,
  setGuidanceActive,
  guidanceActive,
  user,
  currentPosition,
  levelTitle
}) {

  const [competencies, setCompetencies] = useState(initialCompetencies)

  useEffect(() => { // Set the overlays to appear once loaded
    if (initialCompetencies) {
      setCompetencies(initialCompetencies)
    }
  }, [initialCompetencies])

  return (
    <>
      <CustomSuspense message="Loading status">
        <LevelStatus
          setGlobalGuidanceActive={setGuidanceActive}
          levelId={levelId}
          levelTitle={levelTitle}
          setLevelId={setLevelId}
          currentModule={currentModule}
          pupil={pupil}
          competencies={competencies}
          subjectId={subjectId}
          edSubjectId={edSubjectId}
          getLevelVars={{ pupilId: parseInt(pupil.id), subjectId: currentModule.isEd ? edSubjectId : subjectId, moduleId: parseInt(currentModule.id) }}
          setGuidanceActive={setGuidanceActive}
          currentPosition={currentPosition}
        />
      </CustomSuspense>
      <CustomSuspense message="Loading tiles">
        <CapabilityTiles
          userId={user.id}
          guidanceActive={guidanceActive}
          pupil={pupil}
          capabilities={currentModule.capabilities}
          competencies={competencies}
          setCompetencies={setCompetencies}
          currentModule={currentModule} 
          levelId={levelId}
          setLevelId={setLevelId}
          subjectId={subjectId}
          edSubjectId={edSubjectId}
        />
      </CustomSuspense>
    </>
  )
}

LevelContent.propTypes = {
  isEd: PropTypes.bool,
  pupil: PropTypes.object,
  initialCompetencies: PropTypes.array,
  subjectId: PropTypes.number,
  module: PropTypes.object,
  setGuidanceActive: PropTypes.func,
  guidanceActive: PropTypes.bool,
  levelId: PropTypes.number,
  levelTitle: PropTypes.string,
  setLevelId: PropTypes.func,
}

export default WithCompetencies(LevelContent)