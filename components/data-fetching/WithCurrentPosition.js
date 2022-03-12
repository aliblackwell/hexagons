import PropTypes from 'prop-types';
import useSWR from 'swr';
import { getPosition } from '../../queries/Pupils';

export default function WithCurrentPosition(WrappedComponent) {
  function WithCurrentPosition({  positionVariables, ...other }) {
    const { data: positionData } = useSWR([getPosition, positionVariables], { suspense: true });
    console.log(positionData.positions[0])

    return <WrappedComponent {...other} currentPosition={positionData.positions[0]} />;
  }

  WithCurrentPosition.propTypes = {
    levelVariables: PropTypes.object,
  };

  return WithCurrentPosition;
}
