import './index.scss';
import './App.css';
import { useEffect, useState } from 'react';

import { v4 as uuid } from 'uuid';

import MenuBar from './components/MenuBar';
import Terminal from './components/Terminal';
import { TerminalContextProvider } from './contexts/TerminalContext';

const App = () => {
  const [theme, setTheme] = useState({
    themeBGColor: '#fdf6e4',
    themePromptColor: '#a917a8',
  });

  const [terminals, setTerminals] = useState([
    { id: uuid(), isFocused: false },
  ]);

  const [userData, setUserData] = useState({
    customization: { id: '', backgroundColor: '', textColor: '' },
  });

  useEffect(() => {
    if (userData.customization.backgroundColor) {
      setTheme({
        themeBGColor: userData.customization.backgroundColor,
        themePromptColor: userData.customization.textColor,
      });
    }
  }, [userData]);

  const welcomeMessage = (
    <span>
      Type "help" for all available commands. <br />
    </span>
  );

  useEffect(() => {
    window.onclick = (event) => {
      if (event.target.getAttribute('class')) {
        setTerminals(
          terminals.map((el) => {
            if (el.id === event.target.getAttribute('class').split(' ')[1]) {
              return { ...el, isFocused: true };
            }
            return { ...el, isFocused: false };
          }),
        );
      } else {
        setTerminals(terminals.map((el) => ({ ...el, isFocused: false })));
      }
    };
  });

  const addWindow = () => {
    setTerminals([...terminals, { id: uuid(), isFocused: false }]);
  };

  const closeWindow = (id: string) => {
    setTerminals(terminals.filter((el) => el.id !== id));
  };

  return (
    <>
      <MenuBar
        theme={theme}
        setTheme={setTheme}
        addWindow={addWindow}
        customizationId={userData.customization.id}
      />
      <div
        className="App"
        style={{
          display: 'grid',
          gridTemplateColumns: Array(terminals.length).fill('1fr').join(' '),
        }}
      >
        <TerminalContextProvider>
          {terminals.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'grid',
              }}
            >
              <Terminal
                isFocused={item.isFocused}
                theme={theme}
                welcomeMessage={welcomeMessage}
                id={item.id}
                closeWindow={closeWindow}
                userData={userData}
                setUserData={setUserData}
              />
              <div
                style={{
                  borderLeft: '3px solid black',
                  height: '100vh',
                  position: 'absolute',
                }}
              ></div>
            </div>
          ))}
        </TerminalContextProvider>
      </div>
    </>
  );
};

export default App;
