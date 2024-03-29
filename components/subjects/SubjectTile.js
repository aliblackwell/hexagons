import PropTypes from 'prop-types';
import { stringStyles, jssStyles } from '../../styles/useHexagonsGrid';
import Link from 'next/link';
import DialogButton from '../ui-globals/DialogButton';
import { Button, ButtonGroup, ButtonBase } from '@mui/material';
import getNameFromCamelCased from '../../utils/getNameFromCamelCased';
function SubjectTile({ subject, onwardHref }) {
  const styles = stringStyles();
  const pseudoStyles = jssStyles();
  const subjectName = !subject.slug ? getNameFromCamelCased(subject.name) : subject.name
  return (
    <div
      className={`${styles.hex} ${styles[`hex_${subject.isCore ? 'core' : 'nonCore'}`]} ${
        pseudoStyles[`hex_${subject.isCore ? 'core' : 'nonCore'}`]
      }`}
    >
      <div className={`${styles.hexIn}`}>
        {subject.slug && (
          <div className={styles.hexContent}>
            <Link href={`${onwardHref}/${subject.slug}`} passHref>
              <ButtonBase
                title={`Choose ${subjectName}`}
                data-test-id={`subject-button-${subject.slug}`}
                className={`${styles.hexLink} ${pseudoStyles.hexLink} hrxLink`}
              >
                {subjectName}
              </ButtonBase>
            </Link>
          </div>
        )}
        {!subject.slug && (
          <DialogButton
            modelname="subject"
            title={`Choose ${subjectName} subject`}
            testId={`parent-subject-button-${subjectName.toLowerCase()}`}
            className={styles.button}
            isHexagon={true}
            label={subjectName}
            content={
              <div className={`${styles.hexLink} ${pseudoStyles.hexLink} hrxLink`}>
                {subjectName}
              </div>
            }
          >
            <ButtonGroup
              orientation="vertical"
              size="large"
              color="primary"
              aria-label="Choose subject"
            >
              {subject.subjects.map((s, i) => (
                <Link href={`${onwardHref}/${s.slug}`} key={`subject-child-${i}`} passHref>
                  <Button
                    data-test-id={`subject-button-${s.slug}`}
                    className={styles.hexButtonLink}
                    variant="contained"
                    color="primary"
                  >
                    {s.name}
                  </Button>
                </Link>
              ))}
            </ButtonGroup>
          </DialogButton>
        )}
      </div>
    </div>
  );
}

SubjectTile.propTypes = {
  subject: PropTypes.object,
  onwardHref: PropTypes.string,
};

export default SubjectTile;
