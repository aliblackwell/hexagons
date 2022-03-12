import PropTypes from 'prop-types';
import useSWR from 'swr';
import { getLevels } from '../../queries/Pupils';
import getCurrentLevel from '../../utils/getCurrentLevel';

export default function WithCurrentLevel(WrappedComponent) {
  function WithCurrentLevel({ levelVariables, ...other }) {
    const { data: levelsData } = useSWR([getLevels, levelVariables], { suspense: true });
    let startingLevel = getCurrentLevel(levelsData.levels);

    return (
      <WrappedComponent
        {...other}
        startingLevel={startingLevel}
      />
    );
  }

  WithCurrentLevel.propTypes = {
    levelVariables: PropTypes.object,
  };

  return WithCurrentLevel;
}
