import PropTypes from 'prop-types';
import useSWR from 'swr';
import { getPupilById } from '../../queries/Pupils';

export default function WithPupilData(WrappedComponent) {
  function WithPupilData({ pupilVariables, subjectId, ...other }) {
    const { data: pupilsData } = useSWR([getPupilById, pupilVariables], { suspense: true });
    const pupil = pupilsData.pupils[0];
    const pupilId = parseInt(pupil.id);
    return (
      <WrappedComponent
        {...other}
        subjectId={subjectId}
        pupil={pupil}
        positionVariables={{ pupilId: pupilId, subjectId: subjectId }}
        levelVariables={{ pupilId: pupilId, subjectId: subjectId }}
      />
    );
  }

  WithPupilData.propTypes = {
    pupilVariables: PropTypes.object,
    subjectId: PropTypes.number,
  };

  return WithPupilData;
}
