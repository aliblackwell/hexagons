import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import * as PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import theme from '../../styles/theme';

const useStyles = makeStyles({
  loading: {
    textAlign: 'center',
  },
  loadingBig: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: '13px',
    marginRight: theme.spacing(1),
  },
  textContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    width: '100%',
    height: '100px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapperBig: {
    margin: '2rem 0',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  div: {
    position: 'absolute',
    width: '90px',
    height: '51px',
    '&:nth-of-type(2)': {
      transform: 'rotate(60deg)',
    },
    '&:nth-of-type(3)': {
      transform: 'rotate(-60deg)',
    },
  },
  nestedDiv: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  span: {
    position: 'absolute',
    width: '2px',
    height: '0%',
    background: '#053146',
    zIndex: '9999999',
  },
  h1: {
    left: '0',
    animation: '$load1 1.8s ease 0.6s infinite',
  },
  h2: {
    right: '0',
    animation: '$load2 1.8s ease 0.3s infinite',
  },
  h3: {
    right: '0',
    animation: '$load3 1.8s ease 0.6s infinite',
  },
  h4: {
    right: '0',
    animation: '$load4 1.8s ease 0.6s infinite',
  },
  h5: {
    left: '0',
    animation: '$load5 1.8s ease 0.3s infinite',
  },
  h6: {
    left: '0',
    animation: '$load6 1.8s ease 0.3s infinite',
  },
  '@keyframes load1': {
    '0%': {
      bottom: '0',
      height: '0',
    },
    '6.944444444%': {
      bottom: '0',
      height: '100%',
    },
    '50%': {
      top: '0',
      height: '100%',
    },
    '59.944444433%': {
      top: '0',
      height: '0',
    },
  },
  '@keyframes load2': {
    '0%': {
      top: '0',
      height: '0',
    },
    '6.944444444%': {
      top: '0',
      height: '100%',
    },
    '50%': {
      bottom: '0',
      height: '100%',
    },
    '59.944444433%': {
      bottom: '0',
      height: '0',
    },
  },
  '@keyframes load3': {
    '0%': {
      top: '0',
      height: '0',
    },
    '6.944444444%': {
      top: '0',
      height: '100%',
    },
    '50%': {
      bottom: '0',
      height: '100%',
    },
    '59.94444443%': {
      bottom: '0',
      height: '0',
    },
  },
  '@keyframes load4': {
    '0%': {
      top: '0',
      height: '0',
    },
    '6.944444444%': {
      top: '0',
      height: '100%',
    },
    '50%': {
      bottom: '0',
      height: '100%',
    },
    '59.94444443%': {
      bottom: '0',
      height: '0',
    },
  },

  '@keyframes load5': {
    '0%': {
      bottom: '0',
      height: '0',
    },
    '6.944444444%': {
      bottom: '0',
      height: '100%',
    },
    '50%': {
      top: '0',
      height: '100%',
    },
    '59.94444443%': {
      top: '0',
      height: '0',
    },
  },

  '@keyframes load6': {
    '0%': {
      bottom: '0',
      height: '0',
    },
    '6.944444444%': {
      bottom: '0',
      height: '100%',
    },
    '50%': {
      top: '0',
      height: '100%',
    },
    '59.94444443%': {
      top: '0',
      height: '0',
    },
  },
});

function Loading({
  message,
  testId,
  textOnly,
}: {
  message: string;
  testId?: string;
  textOnly?: boolean;
}) {
  const classes = useStyles();
  return (
    <div
      role="alert"
      aria-busy="true"
      data-test-id={testId ? testId : 'loading'}
      className={`${classes.loading} loading-spinner ${!textOnly && classes.loadingBig}`}
    >
      {!textOnly && (
        <>
          <div
            className={`${classes.wrapper} ${!textOnly && classes.wrapperBig}`}
            aria-label={message}
          >
            <section className={classes.container}>
              <div className={classes.div}>
                <div className={`${classes.div} ${classes.nestedDiv}`}>
                  <span className={`${classes.span} ${classes.h6}`}></span>
                  <span className={`${classes.span} ${classes.h3}`}></span>
                </div>
              </div>

              <div className={classes.div}>
                <div className={`${classes.div} ${classes.nestedDiv}`}>
                  <span className={`${classes.span} ${classes.h1}`}></span>
                  <span className={`${classes.span} ${classes.h4}`}></span>
                </div>
              </div>

              <div className={classes.div}>
                <div className={`${classes.div} ${classes.nestedDiv}`}>
                  <span className={`${classes.span} ${classes.h5}`}></span>
                  <span className={`${classes.span} ${classes.h2}`}></span>
                </div>
              </div>
            </section>
          </div>
        </>
      )}
      {textOnly && (
        <div className={classes.textContainer}>
          <Typography className={classes.text}>{message} </Typography>
          <CircularProgress size="1em" color="inherit" />
        </div>
      )}
    </div>
  );
}

Loading.propTypes = {
  testId: PropTypes.string,
  message: PropTypes.string, // message to display below loading animation
};

export default Loading;
