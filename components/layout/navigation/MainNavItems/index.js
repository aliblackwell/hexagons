import List from '@material-ui/core/List';
import PeopleIcon from '@material-ui/icons/People';
import SubjectIcon from '@material-ui/icons/Subject';
import LooksIcon from '@material-ui/icons/Looks';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import NavItem from "../NavItem"


function MainNavItems({session}) {
  const user = session ? session.user ? session.user : false : false
  return (
    <List>
      {user && user.name === 'Super Admin' && <NavItem href="/global-admin" label="Global admin" Icon={DashboardIcon} />}
      <NavItem href="/profile" label="My profile" Icon={AccountCircleIcon} />
      <NavItem href="/subjects" label="Subjects" Icon={SubjectIcon} />
      <NavItem href="/pupils" label="Pupils" Icon={PeopleIcon} />
      <NavItem href="/rainbow-awards" label="Rainbow Awards" Icon={LooksIcon} />
    </List>
  )
}

export default MainNavItems