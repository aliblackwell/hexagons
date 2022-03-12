import CustomSuspense from '../data-fetching/CustomSuspense';

import SetPupilSubjectLevel from '../pupil/SetPupilSubjectLevel'; 

import WithCurrentLevel from '../data-fetching/WithCurrentLevel';
import WithCurrentPosition from '../data-fetching/WithCurrentPosition';

function SubjectMainView(props) {
  
  return (
    <CustomSuspense message="Loading Hexagons">
        <SetPupilSubjectLevel
          {...props}
        /> 
    </CustomSuspense>
  );
}

export default WithCurrentLevel(WithCurrentPosition(SubjectMainView));
