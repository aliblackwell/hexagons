import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import Subjects from '../subjects/Subjects';
import GroupsMenu from './GroupsMenu';
import useAdminPage from '../../styles/useAdminPage';
import CustomSuspense from '../data-fetching/CustomSuspense';
import { useContext } from 'react';
import { HexagonsContext } from '../data-fetching/HexagonsContext';

function SubjectsAndGroups({ activeGroupSlug, ...other }) {
  const classes = useAdminPage();
  const { orgId } = useContext(HexagonsContext)

  return (
    <>
      <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3} xl={2}>
            <GroupsMenu orgId={orgId} {...other} />
          </Grid>
          <Grid item xs={12} md={9} xl={10}>
            <Subjects linkTo='/subjects' isNarrow={true} />
          </Grid>
        </Grid>
      </div>
    </>
  );
}

SubjectsAndGroups.propTypes = {
  activeGroupSlug: PropTypes.string,
};

export default SubjectsAndGroups;
