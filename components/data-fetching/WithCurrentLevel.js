import PropTypes from 'prop-types';
import useSWR from 'swr';
import { getLevels, getPosition } from '../../queries/Pupils';
import getCurrentLevel from '../../utils/getCurrentLevel';

export default function WithCurrentLevel(WrappedComponent) {
  function WithCurrentLevel({ levelVariables, positionVariables, ...other }) {
    const { data: levelsData } = useSWR([getLevels, levelVariables], { suspense: true });
    const { data: positionData } = useSWR([getPosition, positionVariables], { suspense: true });
    let startingLevel = getCurrentLevel(levelsData.levels);

    return (
      <WrappedComponent
        {...other}
        startingLevel={startingLevel}
        currentPosition={positionData.positions[0]}
      />
    );
  }

  WithCurrentLevel.propTypes = {
    levelVariables: PropTypes.object,
  };

  return WithCurrentLevel;
}
