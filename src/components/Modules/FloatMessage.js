import { makeStyles, Popover } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
    opacity: '0.95',
  },
  paper: {
    overflow: 'hidden',
    boxShadow: `0px 5px 5px -3px rgb(38 111 239 / 10%), 
      0px 8px 10px 1px rgb(38 111 239 / 8%), 
      0px 3px 14px 2px rgb(38 111 239 / 60%)`,
    '&>div': {
      backgroundColor: 'white',
      color: '#495EB6',
      padding: '10px',
      width: 'auto',
    },
  },
}))

export default function FloatMessage({ anchorEl, info }) {
  const classes = useStyles()
  return (
    <Popover
      className={classes.popover}
      classes={{
        paper: classes.paper,
      }}
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <div style={{ fontsize: 'Helvetica', whiteSpace: 'pre-line' }}>{info}</div>
    </Popover>
  )
}
