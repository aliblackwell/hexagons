import PropTypes from 'prop-types'
import { getModules } from '../../queries/Subjects'
import useSWR from 'swr';

export default function WithModules(WrappedComponent) {
  function WithModules({ getModulesBySubjectIdVariables, pupil, subjectId, ...other }) {
    const { data: modulesData, mutate: setModulesData } = useSWR([getModules, getModulesBySubjectIdVariables], { suspense: true })
    let modules = []
    if (modulesData) {
      modules = modulesData.modules
    }
    return <WrappedComponent
      modules={modules}
      pupil={pupil}
      subjectId={subjectId}
      setModulesData={setModulesData}
      {...other} />
  }
  
  WithModules.propTypes = {
    getModulesBySubjectIdVariables: PropTypes.object,
    pupil: PropTypes.object,
    subjectId: PropTypes.number
  }
  return WithModules
}
