import * as React from 'react'

export const TerminalContext = React.createContext(null)

export const TerminalContextProvider = (props) => {
  const { children } = props
  const [bufferedContent, setBufferedContent] = React.useState('')
  const [commandsHistory, setCommandsHistory] = React.useState([])
  const [historyPointer, setHistoryPointer] = React.useState(null)

  React.useEffect(() => {
    setHistoryPointer(commandsHistory.length)
  }, [commandsHistory])

  const appendCommandToHistory = (command) => {
    if (!command) {
      return
    }

    setCommandsHistory(commandsHistory.concat(command))
  }

  const clearHistory = () => {
    setCommandsHistory([])
  }

  const getHistory = () => {
    return commandsHistory;
  }

  const getPreviousCommand = () => {
    if (historyPointer === 0) {
      if (commandsHistory.length === 0) {
        return ''
      }

      return commandsHistory[0]
    }

    const command = commandsHistory[historyPointer - 1]
    if (historyPointer > 0) {
      setHistoryPointer(historyPointer - 1)
    }

    return command
  }

  const getNextCommand = () => {
    if (historyPointer + 1 <= commandsHistory.length) {
      const command = commandsHistory[historyPointer + 1]
      setHistoryPointer(historyPointer + 1)
      return command
    }

    return ''
  }

  return (
    <TerminalContext.Provider
      value={{
        bufferedContent,
        setBufferedContent,
        appendCommandToHistory,
        getPreviousCommand,
        getNextCommand,
        clearHistory,
        getHistory,
      }}
    >
      {children}
    </TerminalContext.Provider>
  )
}
