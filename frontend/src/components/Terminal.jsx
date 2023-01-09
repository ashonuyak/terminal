/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types'
import { useContext, useEffect, useState } from 'react'
import Utils from '../common/Utils'
import { TerminalContext } from '../contexts/TerminalContext'
import apiService from '../services/api.service'
import style from '../styles/editor.module.scss'

export default function Terminal(props) {
  const {
    enableInput,
    caret,
    isFocused,
    welcomeMessage,
    id,
    closeWindow,
    theme,
  } = props

  const commands = {
    help: (
      <span>
        <strong>clear</strong> - clears the console. <br />
        <strong>change_prompt &lt;PROMPT&gt;</strong> - Change the prompt of the
        terminal. <br />
        <strong>change_theme &lt;THEME&gt;</strong> - Changes the theme of the
        terminal. Allowed themes - light, dark, material-light, material-dark,
        material-ocean, matrix and dracula. <br />
        <strong>toggle_control_bar</strong> - Hides / Display the top control
        bar. <br />
        <strong>toggle_control_buttons</strong> - Hides / Display the top
        buttons on control bar. <br />
        <strong>evaluate_math_expression &lt;EXPR&gt;</strong> - Evaluates a
        mathematical expression (eg, <strong>4*4</strong>) by hitting a public
        API, api.mathjs.org.
      </span>
    ),
    cd: async (args) => {
      const res = await apiService.user.cd({
        destination: args,
        location: prompt,
      })
      setPrompt(res.data)
    },
    // cat: async (args) => {
    //   const res = await apiService.user.defaultHandler({ command: `type ${args}` })
    //   return <span>{JSON.stringify(res.data)}</span>
    // },
    // gc: async (args) => {
    //   const res = await apiService.user.defaultHandler({ command: `type ${args}` })
    //   return <span>{JSON.stringify(res.data)}</span>
    // },
    clhy: () => clearHistory(),
    gcm: () => <span>{Object.keys(commands)}</span>,
    ghy: () => <span>{getHistory()}</span>,
    h: () => <span>{getHistory()}</span>,
    history: () => <span>{getHistory()}</span>,
    gl: () => <span>{prompt}</span>,
    irm: async (args) => {
      const res = await apiService.user.defaultHandler({
        command: `powershell -command "Invoke-WebRequest -Uri %${args}% -Method POST"`,
      })
      return <span>{res.data}</span>
    },
    // auth: () => <Auth isFocused enableInput theme={theme} caret />,
  }

  const {
    appendCommandToHistory,
    clearHistory,
    getHistory,
    getPreviousCommand,
    getNextCommand,
  } = useContext(TerminalContext)

  const [bufferedContent, setBufferedContent] = useState()
  const [editorInput, setEditorInput] = useState('')
  const [processCurrentLine, setProcessCurrentLine] = useState(false)
  const [caretPosition, setCaretPosition] = useState(0)
  const [beforeCaretText, setBeforeCaretText] = useState('')
  const [afterCaretText, setAfterCaretText] = useState('')
  const [prompt, setPrompt] = useState('')

  useEffect(() => {
    apiService.user
      .cd({ destination: 'C:', location: 'C:' })
      .then((res) => setPrompt(res.data))
  }, [])

  useEffect(() => {
    if (!processCurrentLine) {
      return
    }
    appendCommandToHistory(editorInput)
  }, [processCurrentLine])

  const currentLine = !processCurrentLine && (
    <>
      <span style={{ color: theme.themePromptColor }}>{prompt}</span>
      <div className={style.lineText}>
        <span
          className={style.preWhiteSpace}
          style={{ color: theme.themePromptColor }}
        >
          {beforeCaretText}
        </span>
        {isFocused && caret ? (
          <span className={style.caret}>
            <span
              className={style.caretAfter}
              style={{ background: theme.themeColor }}
            />
          </span>
        ) : null}
        <span
          className={style.preWhiteSpace}
          style={{ color: theme.themePromptColor }}
        >
          {afterCaretText}
        </span>
      </div>
    </>
  )

  const handleKeyDownEvent = (event) => {
    if (!isFocused) {
      return
    }
    if (!enableInput) {
      return
    }
    event.preventDefault()

    const eventKey = event.key

    if (eventKey === 'Enter') {
      setProcessCurrentLine(true)
      return
    }

    let nextInput = null

    if (eventKey === 'Backspace') {
      const [caretTextBefore, caretTextAfter] = Utils.splitStringAtIndex(
        editorInput,
        caretPosition
      )
      nextInput = caretTextBefore.slice(0, -1) + caretTextAfter
      if (editorInput && editorInput.length !== 0)
        setCaretPosition(caretPosition - 1)
    } else if (eventKey === 'ArrowUp') {
      nextInput = getPreviousCommand()
      if (nextInput) setCaretPosition(nextInput.length)
    } else if (eventKey === 'ArrowDown') {
      nextInput = getNextCommand()
      if (nextInput) setCaretPosition(nextInput.length)
      else setCaretPosition(0)
    } else if (eventKey === 'ArrowLeft') {
      if (caretPosition > 0) setCaretPosition(caretPosition - 1)
      nextInput = editorInput
    } else if (eventKey === 'ArrowRight') {
      if (caretPosition < editorInput.length)
        setCaretPosition(caretPosition + 1)
      nextInput = editorInput
    } else if (
      (event.metaKey || event.ctrlKey) &&
      eventKey.toLowerCase() === 'v'
    ) {
      navigator.clipboard.readText().then((pastedText) => {
        const [caretTextBefore, caretTextAfter] = Utils.splitStringAtIndex(
          editorInput || '',
          caretPosition
        )
        nextInput = caretTextBefore + pastedText + caretTextAfter
        setCaretPosition(caretPosition + pastedText.length)
        setEditorInput(nextInput)
      })
    } else if (
      (event.metaKey || event.ctrlKey) &&
      eventKey.toLowerCase() === 'c'
    ) {
      const selectedText = window.getSelection().toString()
      navigator.clipboard.writeText(selectedText).then(() => {
        nextInput = editorInput
        setEditorInput(nextInput)
      })
    } else {
      if (eventKey && eventKey.length === 1) {
        const [caretTextBefore, caretTextAfter] = Utils.splitStringAtIndex(
          editorInput,
          caretPosition
        )
        nextInput = caretTextBefore + eventKey + caretTextAfter
        setCaretPosition(caretPosition + 1)
      } else nextInput = editorInput
    }

    setEditorInput(nextInput)
    setProcessCurrentLine(false)
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDownEvent)
    return () => {
      document.removeEventListener('keydown', handleKeyDownEvent)
    }
  })

  useEffect(() => {
    const [caretTextBefore, caretTextAfter] = Utils.splitStringAtIndex(
      editorInput,
      caretPosition
    )
    setBeforeCaretText(caretTextBefore)
    setAfterCaretText(caretTextAfter)
  }, [editorInput, caretPosition])

  useEffect(() => {
    if (!processCurrentLine) {
      return
    }

    const processCommand = async (text) => {
      const [command, ...rest] = text.trim().split(' ')
      let output = ''

      if (command === 'clear') {
        setBufferedContent('')
        setEditorInput('')
        setProcessCurrentLine(false)
        setCaretPosition(0)
        setBeforeCaretText('')
        setAfterCaretText('')
        return
      }

      if (command === 'auth') {
      }

      const waiting = (
        <>
          {bufferedContent}
          <span style={{ color: theme.themePromptColor }}>{prompt}</span>
          <span
            className={`${style.lineText} ${style.preWhiteSpace}`}
            style={{ color: theme.themePromptColor }}
          >
            {editorInput}
          </span>
          <br />
        </>
      )
      setBufferedContent(waiting)
      setEditorInput('')
      setCaretPosition(0)
      setBeforeCaretText('')
      setAfterCaretText('')

      if (text) {
        const commandArguments = rest.join(' ')

        if (command && commands[command]) {
          const executor = commands[command]

          if (typeof executor === 'function') {
            output = await executor(commandArguments)
          } else {
            output = executor
          }
        } else {
          output = await apiService.user
            .defaultHandler({ command: text, location: prompt })
            .then((res) => <span>{res.data}</span>)
            .catch(() => <span>Unsupported command</span>)
        }
      }

      const nextBufferedContent = (
        <>
          {bufferedContent}
          <span style={{ color: theme.themePromptColor }}>{prompt}</span>
          <span
            className={`${style.lineText} ${style.preWhiteSpace}`}
            style={{ color: theme.themePromptColor }}
          >
            {editorInput}
          </span>
          {output ? (
            <span style={{ color: theme.themePromptColor }}>
              <br />
              {output}
            </span>
          ) : null}
          <br />
        </>
      )

      setBufferedContent(nextBufferedContent)
      setProcessCurrentLine(false)
    }

    processCommand(editorInput)
  }, [processCurrentLine])

  return (
    <div>
      <div
        dkey={id}
        className={`${style.editor} ${id}`}
        style={{ background: theme.themeBGColor }}
      >
        {welcomeMessage}
        {bufferedContent}
        {currentLine}
        <button
          style={{ position: 'absolute', top: 5, right: 5 }}
          onClick={() => closeWindow(id)}
        >
          Close
        </button>
      </div>
    </div>
  )
}

Terminal.propTypes = {
  enableInput: PropTypes.bool,
  caret: PropTypes.bool,
  welcomeMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.node,
  ]),
  errorMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.node,
  ]),
  defaultHandler: PropTypes.func,
}

Terminal.defaultProps = {
  enableInput: true,
  caret: true,
  welcomeMessage: '',
}
