import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import StagesTabsWithEarlyDevelopment from '../navigation/StagesTabsWithEarlyDevelopment';
import StagesTabsSingleSubject from '../navigation/StagesTabsSingleSubject';
import { useRouter } from 'next/router';
const styles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
    clear: 'both',
  },
  title: {
    clear: 'both',
    marginBottom: theme.spacing(3),
    textAlign: 'center',
  },
}));

function SetPupilSubjectLevel({ subjectName, subjectSlug, subjectId, excludeED, pupil, ...other }) {
  const classes = styles();

  let isRa = false;

  const { pathname } = useRouter();
 
  let includeEarlyDevelopment = !excludeED;

  if (pathname.includes('rainbow-awards')) {
    includeEarlyDevelopment = false;
    isRa = true;
  }

  return (
    <Box className={classes.root}>
      {includeEarlyDevelopment && (
        <StagesTabsWithEarlyDevelopment
          {...other}
          isRa={isRa}
          pupil={pupil}
          subjectId={subjectId}
          subjectName={subjectName}
          subjectSlug={subjectSlug}
          isBaseline={true}
          getEarlyDevelopmentBySlugVariables={{ slug: 'early-development' }}
          getSubjectBySlugVariables={{ slug: subjectSlug }}
        />
      )}

      {!includeEarlyDevelopment && (
        <StagesTabsSingleSubject
          {...other}
          isRa={isRa}
          pupil={pupil}
          subjectId={subjectId}
          subjectName={subjectName}
          subjectSlug={subjectSlug}
          isBaseline={true}
          getSubjectBySlugVariables={{ slug: subjectSlug }}
        />
      )}
    </Box>
  );
}

SetPupilSubjectLevel.propTypes = {
  subjectName: PropTypes.string,
  subjectSlug: PropTypes.string,
  pupil: PropTypes.object,
};

export default SetPupilSubjectLevel;
