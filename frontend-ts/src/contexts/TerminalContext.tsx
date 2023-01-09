import { createContext, useEffect, useState } from 'react';

export const TerminalContext = createContext(null);

export const TerminalContextProvider = (props) => {
  const { children } = props;
  const [bufferedContent, setBufferedContent] = useState('');
  const [commandsHistory, setCommandsHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(null);

  useEffect(() => {
    setHistoryPointer(commandsHistory.length);
  }, [commandsHistory]);

  const appendCommandToHistory = (command) => {
    if (!command) {
      return;
    }

    setCommandsHistory(commandsHistory.concat(command));
  };

  const clearHistory = () => {
    setCommandsHistory([]);
  };

  const getHistory = () => {
    return commandsHistory;
  };

  const getPreviousCommand = () => {
    if (historyPointer === 0) {
      if (commandsHistory.length === 0) {
        return '';
      }

      return commandsHistory[0];
    }

    const command = commandsHistory[historyPointer - 1];
    if (historyPointer > 0) {
      setHistoryPointer(historyPointer - 1);
    }

    return command;
  };

  const getNextCommand = () => {
    if (historyPointer + 1 <= commandsHistory.length) {
      const command = commandsHistory[historyPointer + 1];
      setHistoryPointer(historyPointer + 1);
      return command;
    }

    return '';
  };

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
  );
};
