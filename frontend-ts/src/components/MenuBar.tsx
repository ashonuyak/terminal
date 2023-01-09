import style from '../styles/menu.module.scss';
import ColorPicker from './ColorPicker';

function MenuBar(props) {
  return (
    <div
      className={style.dropdown}
      style={{
        backgroundColor: props.theme.themeToolbarColor,
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          borderLeft: '3px solid black',
          height: '100vh',
          position: 'absolute',
        }}
      ></div>
      <button
        className={style.dropbtn}
        style={{
          color: props.theme.themePromptColor,
          backgroundColor: props.theme.themeToolbarColor,
        }}
      >
        Customize
        <div
          className={style.dropdownContent}
          style={{ backgroundColor: props.theme.themeToolbarColor }}
        >
          <div className={style.dropdownContentItem}>
            <div style={{ marginRight: '20px' }}>Text color</div>{' '}
            <ColorPicker
              theme={props.theme.themePromptColor}
              setTheme={(color) =>
                props.setTheme({
                  ...props.theme,
                  themePromptColor: color,
                })
              }
            />
          </div>
          <div className={style.dropdownContentItem}>
            <div style={{ marginRight: '20px' }}>Background color</div>{' '}
            <ColorPicker
              theme={props.theme.themeBGColor}
              setTheme={(color) => {
                props.setTheme({
                  ...props.theme,
                  themeBGColor: color,
                });
              }}
            />
          </div>
        </div>
      </button>
      <button
        onClick={props.addWindow}
        className={style.addBtn}
        style={{
          color: props.theme.themePromptColor,
          backgroundColor: props.theme.themeToolbarColor,
        }}
      >
        Add window
      </button>
    </div>
  );
}

export default MenuBar;
