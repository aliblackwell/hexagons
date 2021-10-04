import PropTypes from 'prop-types'
import { stringStyles, jssStyles } from '../../styles/useHexagonsGrid'
import Link from 'next/link'
import DialogButton from '../ui-globals/DialogButton'
import { Button, ButtonGroup, ButtonBase } from '@material-ui/core'
function SubjectTile({ subject, onwardHref }) {
  const styles = stringStyles()
  const pseudoStyles = jssStyles()
  return (
    <div className={`${styles.hex} ${styles[`hex_${subject.isCore ? 'core' : 'nonCore'}`]} ${pseudoStyles[`hex_${subject.isCore ? 'core' : 'nonCore'}`]}`}>
      <div className={`${styles.hexIn}`}>
        {subject.slug && (<div className={styles.hexContent}>
          <Link href={`${onwardHref}/${subject.slug}`} passHref>
            <ButtonBase data-test-id={`subject-button-${subject.slug}`} className={`${styles.hexLink} ${pseudoStyles.hexLink} hrxLink`}>
              {subject.name}
            </ButtonBase>
          </Link>
        </div>
        )}
        {!subject.slug && (<DialogButton
          testId={`parent-subject-button-${subject.name.toLowerCase()}`}
          className={styles.button}
          isHexagon={true}
          label={subject.name}
          content={<div className={`${styles.hexLink} ${pseudoStyles.hexLink} hrxLink`}>{subject.name}</div>}
        >
          <ButtonGroup orientation="vertical" size="large" color="primary" aria-label="large outlined primary button group">
            {subject.subjects.map((s, i) => (
              <Link href={`${onwardHref}/${s.slug}`} key={`subject-child-${i}`} passHref>
                <Button data-test-id={`subject-button-${s.slug}`} className={styles.hexButtonLink} variant="contained" color="primary">{s.name}</Button>
              </Link>
            ))}
          </ButtonGroup>

        </DialogButton>)}
      </div>
    </div >
  )
}

SubjectTile.propTypes = {
  subject: PropTypes.object,
  onwardHref: PropTypes.string
}

export default SubjectTile