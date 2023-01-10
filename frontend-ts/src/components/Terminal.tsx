import { useContext, useEffect, useState } from 'react';

import Utils from '../common/Utils';
import { TerminalContext } from '../contexts/TerminalContext';
import apiService from '../services/api.service';
import style from '../styles/editor.module.scss';
import Auth from './Auth';

export default function Terminal(props) {
  const {
    isFocused,
    welcomeMessage,
    id,
    closeWindow,
    theme,
    userData,
    setUserData,
  } = props;

  const [authInProgress, setAuthInProgress] = useState(false);

  const commands = {
    help: (
      <span>
        <strong>auth</strong> - Launches the authentication process.
        <br />
        <strong>cd</strong> - Sets the current working location to a specified
        location.
        <br />
        <strong>ls(dir, gci)</strong> - Gets the files and folders in a file
        system drive.
        <br />
        <strong>mkdir(md)</strong> - Creates a new item.
        <br />
        <strong>rm(rmdir, rd, ri)</strong> - Deletes files and folders.
        <br />
        <strong>clear</strong> - Clears the display in the host program.
        <br />
        <strong>help(gcm)</strong> - Gets all commands.
        <br />
        <strong>cat(gc)</strong> - Gets the contents of a file.
        <br />
        <strong>clhy</strong> - Deletes entries from the command history.
        <br />
        <strong>copy(cp, cpi)</strong> - Copies an item from one location to
        another.
        <br />
        <strong>curl(iwr)</strong> - Gets content from a webpage on the
        Internet.
        <br />
        <strong>del(erase)</strong> - Deletes files and folders.
        <br />
        <strong>echo</strong> - Sends the specified objects to the next command
        in the pipeline. If the command is the last command in the pipeline, the
        objects are displayed in the console.
        <br />
        <strong>ghy(h, history)</strong> - Gets a list of the commands entered
        during the current session.
        <br />
        <strong>gl</strong> - Gets information about the current working
        location or a location stack.
        <br />
        <strong>gsv</strong> - Gets the services on a local or remote computer.
        <br />
        <strong>move(mi, mv)</strong> - Moves an item from one location to
        another.
        <br />
        <strong>gps(ps)</strong> - Gets the processes that are running on the
        local computer or a remote computer.
        <br />
      </span>
    ),
    cd: async (args: string) => {
      const res = await apiService.user.cd({
        destination: args,
        location: prompt,
      });
      setPrompt(res.data);
    },
    cat: (args) =>
      apiService.user
        .defaultHandler({
          command: `type ${args}`,
          location: prompt,
          role: userData ? userData.role : 'user',
        })
        .then((res) => <span>{JSON.stringify(res.data)}</span>)
        .catch((err) => <span>{err.response.data.message}</span>),
    gc: (args) =>
      apiService.user
        .defaultHandler({
          command: `type ${args}`,
          location: prompt,
          role: userData ? userData.role : 'user',
        })
        .then((res) => <span>{JSON.stringify(res.data)}</span>)
        .catch((err) => <span>{err.response.data.message}</span>),
    clhy: () => clearHistory(),
    gcm: () => <span>{Object.keys(commands)}</span>,
    ghy: () => <span>{getHistory()}</span>,
    h: () => <span>{getHistory()}</span>,
    history: () => <span>{getHistory()}</span>,
    gl: () => <span>{prompt}</span>,
    irm: async (args) => {
      const res = await apiService.user.defaultHandler({
        command: `powershell -command "Invoke-WebRequest -Uri %${args}% -Method POST"`,
        location: prompt,
        role: userData ? userData.role : 'user',
      });
      return <span>{res.data}</span>;
    },
    auth: () => {
      setAuthInProgress(true);
    },
  };

  const {
    appendCommandToHistory,
    clearHistory,
    getHistory,
    getPreviousCommand,
    getNextCommand,
  } = useContext(TerminalContext);

  const [bufferedContent, setBufferedContent] = useState<
    JSX.Element | string
  >();
  const [editorInput, setEditorInput] = useState('');
  const [processCurrentLine, setProcessCurrentLine] = useState(false);
  const [caretPosition, setCaretPosition] = useState(0);
  const [beforeCaretText, setBeforeCaretText] = useState('');
  const [afterCaretText, setAfterCaretText] = useState('');
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    apiService.user
      .cd({ destination: 'C:', location: 'C:' })
      .then((res) => setPrompt(res.data));
  }, []);

  useEffect(() => {
    if (!processCurrentLine) {
      return;
    }
    appendCommandToHistory(editorInput);
  }, [processCurrentLine]);

  const currentLine = !processCurrentLine && !authInProgress && (
    <>
      <span style={{ color: theme.themePromptColor }}>{prompt}</span>
      <div className={style.lineText}>
        <span
          className={style.preWhiteSpace}
          style={{ color: theme.themePromptColor }}
        >
          {beforeCaretText}
        </span>
        {isFocused ? (
          <span className={style.caret}>
            <span
              className={style.caretAfter}
              style={{ background: theme.themePromptColor }}
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
  );

  const handleKeyDownEvent = (event) => {
    if (!isFocused || authInProgress) {
      return;
    }
    event.preventDefault();

    const eventKey = event.key;

    if (eventKey === 'Enter') {
      setProcessCurrentLine(true);
      return;
    }

    let nextInput = null;

    if (eventKey === 'Backspace') {
      const [caretTextBefore, caretTextAfter] = Utils.splitStringAtIndex(
        editorInput,
        caretPosition,
      );
      nextInput = caretTextBefore.slice(0, -1) + caretTextAfter;
      if (editorInput && editorInput.length !== 0)
        setCaretPosition(caretPosition - 1);
    } else if (eventKey === 'ArrowUp') {
      nextInput = getPreviousCommand();
      if (nextInput) setCaretPosition(nextInput.length);
    } else if (eventKey === 'ArrowDown') {
      nextInput = getNextCommand();
      if (nextInput) setCaretPosition(nextInput.length);
      else setCaretPosition(0);
    } else if (eventKey === 'ArrowLeft') {
      if (caretPosition > 0) setCaretPosition(caretPosition - 1);
      nextInput = editorInput;
    } else if (eventKey === 'ArrowRight') {
      if (caretPosition < editorInput.length)
        setCaretPosition(caretPosition + 1);
      nextInput = editorInput;
    } else if (
      (event.metaKey || event.ctrlKey) &&
      eventKey.toLowerCase() === 'v'
    ) {
      navigator.clipboard.readText().then((pastedText) => {
        const [caretTextBefore, caretTextAfter] = Utils.splitStringAtIndex(
          editorInput || '',
          caretPosition,
        );
        nextInput = caretTextBefore + pastedText + caretTextAfter;
        setCaretPosition(caretPosition + pastedText.length);
        setEditorInput(nextInput);
      });
    } else if (
      (event.metaKey || event.ctrlKey) &&
      eventKey.toLowerCase() === 'c'
    ) {
      const selectedText = window.getSelection().toString();
      navigator.clipboard.writeText(selectedText).then(() => {
        nextInput = editorInput;
        setEditorInput(nextInput);
      });
    } else {
      if (eventKey && eventKey.length === 1) {
        const [caretTextBefore, caretTextAfter] = Utils.splitStringAtIndex(
          editorInput,
          caretPosition,
        );
        nextInput = caretTextBefore + eventKey + caretTextAfter;
        setCaretPosition(caretPosition + 1);
      } else nextInput = editorInput;
    }

    setEditorInput(nextInput);
    setProcessCurrentLine(false);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDownEvent);
    return () => {
      document.removeEventListener('keydown', handleKeyDownEvent);
    };
  });

  useEffect(() => {
    const [caretTextBefore, caretTextAfter] = Utils.splitStringAtIndex(
      editorInput,
      caretPosition,
    );
    setBeforeCaretText(caretTextBefore);
    setAfterCaretText(caretTextAfter);
  }, [editorInput, caretPosition]);

  useEffect(() => {
    if (!processCurrentLine) {
      return;
    }

    const processCommand = async (text) => {
      const [command, ...rest] = text.trim().split(' ');
      let output: JSX.Element | string = '';

      if (command === 'clear') {
        setBufferedContent('');
        setEditorInput('');
        setProcessCurrentLine(false);
        setCaretPosition(0);
        setBeforeCaretText('');
        setAfterCaretText('');
        return;
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
      );
      setBufferedContent(waiting);
      setEditorInput('');
      setCaretPosition(0);
      setBeforeCaretText('');
      setAfterCaretText('');

      if (text) {
        const commandArguments = rest.join(' ');

        if (command && commands[command]) {
          const executor = commands[command];

          if (typeof executor === 'function') {
            output = await executor(commandArguments);
          } else {
            output = executor;
          }
        } else {
          output = await apiService.user
            .defaultHandler({
              command: text,
              location: prompt,
              role: userData ? userData.role : 'user',
            })
            .then((res) => <span>{res.data}</span>)
            .catch((err) => <span>{err.response.data.message}</span>);
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
      );

      setBufferedContent(nextBufferedContent);
      setProcessCurrentLine(false);
    };

    processCommand(editorInput);
  }, [processCurrentLine]);

  return (
    <div>
      <div
        className={`${style.editor} ${id}`}
        style={{ background: theme.themeBGColor }}
      >
        {welcomeMessage}
        {bufferedContent}
        {authInProgress ? (
          <Auth
            isFocused={isFocused}
            enableInput
            theme={theme}
            caret
            propmt={prompt}
            setAuthInProgress={setAuthInProgress}
            setUserData={setUserData}
            buffered={bufferedContent}
            setBuffered={setBufferedContent}
          />
        ) : null}
        {currentLine}
        <button className={style.closeBtn} onClick={() => closeWindow(id)}>
          Close
        </button>
      </div>
    </div>
  );
}
