import { withSession } from '../../../components/auth/session';
import checkSession from '../../../components/auth/checkSession';
import SubjectPupilChooserView from '../../../components/shared-pages/SubjectPupilChooserView';

const Subject = (props) => (
  <SubjectPupilChooserView
    {...props}
    isEarlyDevelopment={true}
    firstLabel="Early development"
    firstModel="Early development"
    firstSlug="early-development"
  />
);

export default Subject;

export const getServerSideProps = withSession((ctx) => {
  return checkSession(ctx, 'Teacher');
});
