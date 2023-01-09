import { useEffect, useState } from 'react'
import Utils from '../common/Utils'
import { useCurrentLine } from '../hooks/editor'
import style from '../styles/editor.module.scss'

export default function Auth(props) {
  const {
    isFocused,
    enableInput,
    theme,
    caret,
    prompt,
    commands,
    defaultHandler,
  } = props

  const [step, setStep] = useState('name')
  const [editorInput, setEditorInput] = useState('')
  const [processCurrentLine, setProcessCurrentLine] = useState(false)
  const [caretPosition, setCaretPosition] = useState(0)
  const [beforeCaretText, setBeforeCaretText] = useState('')
  const [afterCaretText, setAfterCaretText] = useState('')

  const currentLine = useCurrentLine(
    caret,
    isFocused,
    prompt,
    commands,
    'not found',
    enableInput,
    defaultHandler,
    theme,
    editorInput,
    setEditorInput,
    processCurrentLine,
    setProcessCurrentLine,
    caretPosition,
    setCaretPosition,
    beforeCaretText,
    setBeforeCaretText,
    afterCaretText,
    setAfterCaretText
  )

  // const currentLine = !processCurrentLine && (
  //   <>
  //     <span style={{ color: theme.themePromptColor }}>{prompt}</span>
  //     <div className={style.lineText}>
  //       <span
  //         className={style.preWhiteSpace}
  //         style={{ color: theme.themePromptColor }}
  //       >
  //         {beforeCaretText}
  //       </span>
  //       {isFocused && caret ? (
  //         <span className={style.caret}>
  //           <span
  //             className={style.caretAfter}
  //             style={{ background: theme.themeColor }}
  //           />
  //         </span>
  //       ) : null}
  //       <span
  //         className={style.preWhiteSpace}
  //         style={{ color: theme.themePromptColor }}
  //       >
  //         {afterCaretText}
  //       </span>
  //     </div>
  //   </>
  // )

  // const handleKeyDownEvent = (event) => {
  //   if (!isFocused) {
  //     return
  //   }
  //   if (!enableInput) {
  //     return
  //   }
  //   event.preventDefault()

  //   const eventKey = event.key

  //   if (eventKey === 'Enter') {
  //     setProcessCurrentLine(true)
  //     return
  //   }

  //   let nextInput = null

  //   if (eventKey === 'Backspace') {
  //     const [caretTextBefore, caretTextAfter] = Utils.splitStringAtIndex(
  //       editorInput,
  //       caretPosition
  //     )
  //     nextInput = caretTextBefore.slice(0, -1) + caretTextAfter
  //     if (editorInput && editorInput.length !== 0)
  //       setCaretPosition(caretPosition - 1)
  //   } else if (eventKey === 'ArrowLeft') {
  //     if (caretPosition > 0) setCaretPosition(caretPosition - 1)
  //     nextInput = editorInput
  //   } else if (eventKey === 'ArrowRight') {
  //     if (caretPosition < editorInput.length)
  //       setCaretPosition(caretPosition + 1)
  //     nextInput = editorInput
  //   } else if (
  //     (event.metaKey || event.ctrlKey) &&
  //     eventKey.toLowerCase() === 'v'
  //   ) {
  //     navigator.clipboard.readText().then((pastedText) => {
  //       const [caretTextBefore, caretTextAfter] = Utils.splitStringAtIndex(
  //         editorInput || '',
  //         caretPosition
  //       )
  //       nextInput = caretTextBefore + pastedText + caretTextAfter
  //       setCaretPosition(caretPosition + pastedText.length)
  //       setEditorInput(nextInput)
  //     })
  //   } else if (
  //     (event.metaKey || event.ctrlKey) &&
  //     eventKey.toLowerCase() === 'c'
  //   ) {
  //     const selectedText = window.getSelection().toString()
  //     navigator.clipboard.writeText(selectedText).then(() => {
  //       nextInput = editorInput
  //       setEditorInput(nextInput)
  //     })
  //   } else {
  //     if (eventKey && eventKey.length === 1) {
  //       const [caretTextBefore, caretTextAfter] = Utils.splitStringAtIndex(
  //         editorInput,
  //         caretPosition
  //       )
  //       nextInput = caretTextBefore + eventKey + caretTextAfter
  //       setCaretPosition(caretPosition + 1)
  //     } else nextInput = editorInput
  //   }

  //   setEditorInput(nextInput)
  //   setProcessCurrentLine(false)
  // }

  // useEffect(() => {
  //   document.addEventListener('keydown', handleKeyDownEvent)
  //   return () => {
  //     document.removeEventListener('keydown', handleKeyDownEvent)
  //   }
  // })

  // useEffect(() => {
  //   const [caretTextBefore, caretTextAfter] = Utils.splitStringAtIndex(
  //     editorInput,
  //     caretPosition
  //   )
  //   setBeforeCaretText(caretTextBefore)
  //   setAfterCaretText(caretTextAfter)
  // }, [editorInput, caretPosition])

  // useEffect(() => {
  //   if (!processCurrentLine) {
  //     return
  //   }
  // }, [processCurrentLine])

  return (
    <>
      <span>Enter name:</span>
      <span>{currentLine}</span>
    </>
  )
}
