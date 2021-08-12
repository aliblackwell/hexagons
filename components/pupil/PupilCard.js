import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Link from "next/link"


import { Typography } from "@material-ui/core"
import CoreSubjectsProgress from "./CoreSubjectsProgress"


const useStyles = makeStyles({
  groupUl: {
    listStyle: 'none',
    padding: '0',
    margin: '0'
  },
  groupLi: {
    listStyle: 'none',
    display: 'inline',
    marginRight: '0.5em',
    '&:last-child::after': {
      content: "''"
    },
    '&::after': {
      content: "'|'",
      paddingLeft: '0.5em',
    }
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});



export default function PupilCard(props) {
  const { pupil } = props
  const [onwardHref, setOnwardHref] = useState(props.onwardHref)
  const styles = useStyles();

  useEffect(() => {
    setOnwardHref(props.onwardHref)
  }, [props.onwardHref])


  return (
    <Card>
      <CardContent>
        <Typography component='h2' variant='h4'>
          {/* <Link href="/pupils/[id]-RANDOM" as={`/pupils/${pupil.id}`}>
            <a>{pupil.name}</a>
          </Link> */}
          {onwardHref && <Link href={onwardHref} >
            <a>{pupil.name}</a>
          </Link>}
        </Typography>
        <ul className={styles.groupUl}>
          {pupil.groups && pupil.groups.map((group, i) => (
            <li key={`pupil-group-${i}`} className={styles.groupLi}>{group.name}</li>
          ))}
        </ul>
        <CoreSubjectsProgress  {...props} />
      </CardContent>

    </Card >
  )
}
