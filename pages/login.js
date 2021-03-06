import LoginForm from '../components/forms/Login';
import { Paper, Typography } from '@mui/material';
import Link from 'next/link';
import useLoginLogoutPages from '../styles/useLoginLogoutPages';
import CustomHead from '../components/ui-globals/CustomHead';
import { withSession } from '../components/auth/session';
import redirectLoggedInSession from '../components/auth/redirectLoggedInSession';

export default function LoginPage(props) {
  const classes = useLoginLogoutPages();
  return (
    <>
      <CustomHead titleContent="Login" />
      <Paper elevation={1} square className={classes.paper}>
        <h1 className={classes.title}>Login to Hexagons</h1>
        <LoginForm {...props} />
      </Paper>
      <Typography className={classes.secondaryAction} data-test-id="reset-password-link">
        Forgotten password? <Link href="/reset-password">Reset password</Link>
      </Typography>
      <Typography className={classes.secondaryAction} data-test-id="register-link">
        Need an account? <Link href="/register">Register</Link>
      </Typography>
    </>
  );
}

export const getServerSideProps = withSession((ctx) => {
  return redirectLoggedInSession(ctx);
});
