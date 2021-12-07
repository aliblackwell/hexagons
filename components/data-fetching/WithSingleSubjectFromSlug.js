import PropTypes from 'prop-types'
import useSWR from 'swr'
import { getSingleSubjectBySlug } from "../../queries/Subjects"
export default function WithSingleSubjectFromSlug(WrappedComponent) {
  function WithSingleSubjectFromSlug({ getSubjectBySlugVariables, ...other }) {
    const { data: subjectData } = useSWR([getSingleSubjectBySlug, getSubjectBySlugVariables], { suspense: true })

    const subject = subjectData.subjects[0]
    const subjectId = parseInt(subject.id)
    const subjectName = subject.name
    const subjectSlug = subject.slug
    return (
      <>
        <WrappedComponent
          {...other}
          subjectId={subjectId}
          subjectName={subjectName}
          subjectSlug={subjectSlug}
          getModulesBySubjectIdVariables={{ subjectId: subjectId }} />
      </>
    )
  }

  WithSingleSubjectFromSlug.propTypes = {
    getSubjectBySlugVariables: PropTypes.object
  }

  return WithSingleSubjectFromSlug
}

