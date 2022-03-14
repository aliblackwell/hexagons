import PropTypes from 'prop-types';
import NativeSelect from '@mui/material/NativeSelect';
import makeStyles from '@mui/styles/makeStyles';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useRouter } from 'next/router';
import { useState } from 'react';
import WithAllSubjects from '../data-fetching/WithAllSubjects';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120,
    marginTop: '-0.95rem',
  },
  label: {
    width: '150px',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function SubjectPicker({
  currentSubjectSlug,
  subjects,
  activeGroupSlug,
  currentPupilId,
  isRainbowAwards,
  isGroupOverviewReport,
}) {
  const classes = useStyles();
  const [subjectSlug, setSubjectSlug] = useState(currentSubjectSlug);
  const router = useRouter();
  const handleChange = (event) => {
    const newSubjectSlug = event.target.value;
    const isSubjectsListing = router.asPath.includes('subjects');
    let navigateTo;
    if (isSubjectsListing || isRainbowAwards) {
      const basePath = isSubjectsListing ? 'subjects' : 'rainbow-awards';
      navigateTo = `/${basePath}/${newSubjectSlug}/${activeGroupSlug}/${currentPupilId}`;
    } else if (isGroupOverviewReport) {
      navigateTo = `/reports/group-overview/${activeGroupSlug}/${newSubjectSlug}`;
    } else {
      navigateTo = `/pupils/${activeGroupSlug}/${currentPupilId}/${newSubjectSlug}`;
    }
    router.push(navigateTo, undefined, {
      shallow: true,
    });
    setSubjectSlug(newSubjectSlug);
  };

  const subjectsWithSlug = subjects.filter((subject) => subject.slug);
  const subjectsWithoutSlug = subjects.filter((subject) => !subject.slug);

  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="subject-picker" className={classes.label}>
        Select {isRainbowAwards ? 'award' : 'subject'}
      </InputLabel>
      <NativeSelect
        id="subject-picker"
        data-test-id="select-subject"
        value={subjectSlug}
        onChange={handleChange}
      >
        <optgroup label="Subjects">
          {subjectsWithSlug.map((subject, i) => (
            <option key={`subject-${i}`} value={subject.slug}>
              {subject.name}
            </option>
          ))}
        </optgroup>
        {subjectsWithoutSlug.map((subject, i) => (
          <optgroup key={`optgroup-${i}`} label={subject.name}>
            {subject.subjects.map((childSubject, j) => {
              return (
                <option key={`child-subject-${j}`} value={childSubject.slug}>
                  {childSubject.name}
                </option>
              );
            })}
          </optgroup>
        ))}
      </NativeSelect>
    </FormControl>
  );
}

SubjectPicker.propTypes = {
  currentSubjectSlug: PropTypes.string,
  subjects: PropTypes.array,
  activeGroupSlug: PropTypes.string,
  isGroupOverviewReport: PropTypes.bool,
  currentPupilId: PropTypes.number,
};

export default WithAllSubjects(SubjectPicker);
