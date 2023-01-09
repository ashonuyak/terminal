/* eslint-disable react-hooks/exhaustive-deps */
import { TerminalContext } from '../contexts/TerminalContext'
import style from '../styles/editor.module.scss'

import Utils from '../common/Utils'
import { useContext, useEffect } from 'react'

export const useEditorInput = (
  consoleFocused,
  editorInput,
  setEditorInput,
  setProcessCurrentLine,
  caretPosition,
  setCaretPosition,
  setBeforeCaretText,
  setAfterCaretText,
  enableInput
) => {
  const { getPreviousCommand, getNextCommand } = useContext(TerminalContext)

  const handleKeyDownEvent = (event) => {
    if (!consoleFocused) {
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
}

export const useBufferedContent = (
  processCurrentLine,
  setProcessCurrentLine,
  prompt,
  currentText,
  setCurrentText,
  setCaretPosition,
  setBeforeCaretText,
  setAfterCaretText,
  commands,
  errorMessage,
  defaultHandler,
  themeStyles
) => {
  const { bufferedContent, setBufferedContent } = useContext(TerminalContext)

  useEffect(() => {
    if (!processCurrentLine) {
      return
    }

    const processCommand = async (text) => {
      const [command, ...rest] = text.trim().split(' ')
      let output = ''

      if (command === 'clear') {
        setBufferedContent('')
        setCurrentText('')
        setProcessCurrentLine(false)
        setCaretPosition(0)
        setBeforeCaretText('')
        setAfterCaretText('')
        return
      }

      const waiting = (
        <>
          {bufferedContent}
          <span style={{ color: themeStyles.themePromptColor }}>{prompt}</span>
          <span
            className={`${style.lineText} ${style.preWhiteSpace}`}
            style={{ color: themeStyles.themePromptColor }}
          >
            {currentText}
          </span>
          <br />
        </>
      )
      setBufferedContent(waiting)
      setCurrentText('')
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
        } else if (typeof defaultHandler === 'function') {
          output = await defaultHandler(command, commandArguments)
        } else if (typeof errorMessage === 'function') {
          output = await errorMessage(command, commandArguments)
        } else {
          output = errorMessage
        }
      }

      const nextBufferedContent = (
        <>
          {bufferedContent}
          <span style={{ color: themeStyles.themePromptColor }}>{prompt}</span>
          <span
            className={`${style.lineText} ${style.preWhiteSpace}`}
            style={{ color: themeStyles.themePromptColor }}
          >
            {currentText}
          </span>
          {output ? (
            <span style={{ color: themeStyles.themePromptColor }}>
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

    processCommand(currentText)
  }, [processCurrentLine])
}

export const useCurrentLine = (
  caret,
  consoleFocused,
  prompt,
  commands,
  errorMessage,
  enableInput,
  defaultHandler,
  themeStyles,
  editorInput,
  setEditorInput,
  processCurrentLine,
  setProcessCurrentLine,
  caretPosition,
  setCaretPosition,
  beforeCaretText,
  setBeforeCaretText,
  afterCaretText,
  setAfterCaretText,
) => {
  const { appendCommandToHistory } = useContext(TerminalContext)

  useEffect(() => {
    if (!processCurrentLine) {
      return
    }
    appendCommandToHistory(editorInput)
  }, [processCurrentLine])

  const currentLine = !processCurrentLine && (
    <>
      <span style={{ color: themeStyles.themePromptColor }}>{prompt}</span>
      <div className={style.lineText}>
        <span
          className={style.preWhiteSpace}
          style={{ color: themeStyles.themePromptColor }}
        >
          {beforeCaretText}
        </span>
        {consoleFocused && caret ? (
          <span className={style.caret}>
            <span
              className={style.caretAfter}
              style={{ background: themeStyles.themeColor }}
            />
          </span>
        ) : null}
        <span
          className={style.preWhiteSpace}
          style={{ color: themeStyles.themePromptColor }}
        >
          {afterCaretText}
        </span>
      </div>
    </>
  )

  useEditorInput(
    consoleFocused,
    editorInput,
    setEditorInput,
    setProcessCurrentLine,
    caretPosition,
    setCaretPosition,
    setBeforeCaretText,
    setAfterCaretText,
    enableInput
  )

  useBufferedContent(
    processCurrentLine,
    setProcessCurrentLine,
    prompt,
    editorInput,
    setEditorInput,
    setCaretPosition,
    setBeforeCaretText,
    setAfterCaretText,
    commands,
    errorMessage,
    defaultHandler,
    themeStyles
  )

  return currentLine
}

// export const useScrollToBottom = (changesToWatch, wrapperRef) => {
//   useEffect(() => {
//     if (!wrapperRef.current) return
//     // eslint-disable-next-line no-param-reassign
//     wrapperRef.current.scrollTop = wrapperRef.current.scrollHeight
//   }, [changesToWatch])
// }
