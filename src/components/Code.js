import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import Snackbar from '@material-ui/core/Snackbar'

const useStyles = makeStyles(() => ({
  copyBlock: {
    top: '.3rem',
    right: '.3rem',
    width: '1.4rem',
    height: '1.4rem',
    borderRadius: '.1rem',
    fontSize: '.6rem',
    cursor: 'pointer',
    zIndex: 1,
    margin: 0,
    padding: 0,
    background: 'transparent',
    position: 'absolute',
    border: 0,
  },
  copyButton: {
    backgroundColor: 'transparent',
    color: 'white',
    opacity: 0.2,
    '&:hover': {
      opacity: 1,
    },
  },
  lineWrapper: { display: 'flex' },
  lineNumber: {
    /* background: rgba(255, 255, 255, 0.1); */
    width: '1.5rem',
    opacity: 0.6,
    'text-align': 'right',
    'user-select': 'none',
  },
  lineContents: {
    flex: '1 0 auto',
    'white-space': 'pre',
  },
}))

/*
 * @source https://github.com/gatsbyjs/gatsby/blob/561d33e2e491d3971cb2a404eec9705a5a493602/www/src/utils/copy-to-clipboard.js
 */
const copyToClipboard = (str) => {
  const clipboard = window.navigator.clipboard
  /*
   * fallback to older browsers (including Safari)
   * if clipboard API not supported
   */
  if (!clipboard || typeof clipboard.writeText !== 'function') {
    const textarea = document.createElement('textarea')
    textarea.value = str
    textarea.setAttribute('readonly', true)
    textarea.setAttribute('contenteditable', true)
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    const range = document.createRange()
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
    textarea.setSelectionRange(0, textarea.value.length)
    document.execCommand('copy')
    document.body.removeChild(textarea)

    return Promise.resolve(true)
  }

  return clipboard.writeText(str)
}

export default function Code (codeBlocks) {
  const classes = useStyles()
  return function codeRender (props) {
    const index = Number(props['data-index'])
    const codeBlock = codeBlocks[index]
    const CopySnackbar = () => {
      const [open, setOpen] = React.useState(false)

      const handleClick = () => {
        copyToClipboard(codeBlock.text)
        setOpen(true)
      }

      const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return
        }
        setOpen(false)
      }

      return (
        <div className={classes.copyBlock}>
          <IconButton className={classes.copyButton}
            size='small'
            aria-label='copy'
            onClick={handleClick}
          >
            <FileCopyOutlinedIcon fontSize='small' />
          </IconButton>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            open={open}
            autoHideDuration={1000}
            onClose={handleClose}
            message='源代码已复制'
          />
        </div>
      )
    }
    if (codeBlock && codeBlock.tokenizedLines) {
      return (
        <pre
          className={codeBlock.preClassName}
          style={{ position: 'relative' }}
        >
          <CopySnackbar/>
          <code className={codeBlock.codeClassName}>
            {codeBlock.tokenizedLines.map(({ html }, i) => (
              <div className={classes.lineWrapper} key={i}>
                <div className={classes.lineNumber}>{i + 1}</div>
                <div
                  className={classes.lineContents}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            ))}
          </code>
        </pre>
      )
    }
    return <pre {...props}/>
  }
}