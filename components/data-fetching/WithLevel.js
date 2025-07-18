import PropTypes from 'prop-types';
import { Suspense, useContext } from 'react';
import useSWR from 'swr';
import { getLevel, deleteLevelQuery } from '../../queries/Pupils';
import getLatestTarget from '../../utils/getLatestTarget';

import { HexagonsContext } from './HexagonsContext';

export default function WithLevel(WrappedComponent) {
  function WithLevel({ getLevelVars, ...other }) {
    const { gqlClient } = useContext(HexagonsContext);
    const { data: visibleLevelData } = useSWR([getLevel, getLevelVars], { suspense: true });
    let correctLevel = visibleLevelData ? visibleLevelData.levels[0] : null;
    let latestTarget = getLatestTarget(visibleLevelData?.targets)
    if (visibleLevelData && visibleLevelData.levels.length > 1) {
      // Got duplicates - get all competencies out of levels
      // combine them into the first item
      // then delete all but the first
      // N.B. In production there shouldn't be duplicates due to defensive coding elsewhere
      // So the below is just in case!
      const competencies = [];
      visibleLevelData.levels.map((level, i) => {
        competencies.push(...level.competencies);
      });
      correctLevel.competencies = [...new Set([...competencies])];
      const levelNoCompetencies = visibleLevelData.levels.filter((level, i) => i !== 0);
      levelNoCompetencies.map(async (level, i) => {
        // safely delete levels
        try {
          await gqlClient.request(deleteLevelQuery, { id: parseInt(level.id) });
        } catch (e) {
          console.error(e);
        }
      });
    }
    return <WrappedComponent initialVisibleLevel={correctLevel} latestTargetCurrentScore={latestTarget?.currentScore} {...other} />;
  }

  WithLevel.propTypes = {
    getLevelVars: PropTypes.object,
  };

  return WithLevel;
}
