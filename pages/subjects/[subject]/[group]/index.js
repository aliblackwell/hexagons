import { withSession } from '../../../../components/auth/session';
import checkSession from '../../../../components/auth/checkSession';
import GroupRootPage from '../../../../components/shared-pages/GroupRootPage';
import BreadCrumbs from '../../../../components/navigation/Breadcrumbs';
import WithUrlVariables from '../../../../components/data-fetching/WithUrlVariables';
import CustomSuspense from '../../../../components/data-fetching/CustomSuspense';
import SubjectPicker from '../../../../components/navigation/SubjectPicker';
function Index(props) {
  return (
    <GroupRootPage
      shouldShowGroupBySubject={true}
      titleContent={`${props.subjectName} | ${props.groupName} | Subjects`}
      breadcrumbs={
        <BreadCrumbs
          firstLabel="Subjects"
          firstModel="subject"
          firstHref="/subjects"
          secondPicker={
            <CustomSuspense message="Loading subjects" textOnly={true}>
              <SubjectPicker
                isOverviewPage={true}
                isRainbowAwards={false}
                activeGroupSlug={props.activeGroupSlug}
                currentSubjectSlug={props.subjectSlug}
              />
            </CustomSuspense>
          }
          finalTitle={props.groupName}
          {...props}
        />
      }
      {...props}
    />
  );
}

export default WithUrlVariables(Index);

export const getServerSideProps = withSession((ctx) => {
  return checkSession(ctx, 'Teacher');
});
