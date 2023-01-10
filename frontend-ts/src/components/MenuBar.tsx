import style from '../styles/menu.module.scss';
import ColorPicker from './ColorPicker';

function MenuBar(props) {
  return (
    <div
      className={style.dropdown}
      style={{
        backgroundColor: props.theme.themeBGColor,
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
          backgroundColor: props.theme.themeBGColor,
        }}
      >
        Customize
        <div
          className={style.dropdownContent}
          style={{ backgroundColor: props.theme.themeBGColor }}
        >
          <div className={style.dropdownContentItem}>
            <div style={{ marginRight: '20px' }}>Text color</div>{' '}
            <ColorPicker
              customizationId={props.customizationId}
              theme={props.theme}
              type={'textColor'}
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
              customizationId={props.customizationId}
              theme={props.theme}
              type={'backgroundColor'}
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
          backgroundColor: props.theme.themeBGColor,
        }}
      >
        Add window
      </button>
    </div>
  );
}

export default MenuBar;
