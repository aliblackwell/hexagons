import PropTypes from 'prop-types'
import useStateOnce from '../data-fetching/useStateOnce';
import { getPupilsByGroup } from '../../queries/Pupils';
import handleNonResponses from '../data-fetching/handleNonResponses';

export default function WithPupilsByGroup(WrappedComponent) {
  function WithPupilsByGroup({ pupilsByGroupVariables, ...other }) {

    const [pupilsData, error] = useStateOnce([getPupilsByGroup, pupilsByGroupVariables])
    const gotNonResponse = handleNonResponses(pupilsData, error)
    if (gotNonResponse) return gotNonResponse
    return (
      <>
        {pupilsData.pupils && <WrappedComponent pupils={pupilsData.pupils} {...other} />}
      </>
    )
  }

  WithPupilsByGroup.propTypes = {
    pupilsByGroupVariables: PropTypes.object
  }

  return WithPupilsByGroup
}
