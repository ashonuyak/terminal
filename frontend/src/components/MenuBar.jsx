import React from 'react'
import ColorPicker from './ColorPicker'
import style from '../styles/menu.module.scss'

class MenuBar extends React.Component {
  render() {
    return (
      <div
        className={style.dropdown}
        style={{
          backgroundColor: this.props.theme.themeToolbarColor,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <button
          className={style.dropbtn}
          style={{
            color: this.props.theme.themePromptColor,
            backgroundColor: this.props.theme.themeToolbarColor,
          }}
        >
          Customize
          <div
            className={style.dropdownContent}
            style={{ backgroundColor: this.props.theme.themeToolbarColor }}
          >
            <div className={style.dropdownContentItem}>
              <div style={{ marginRight: '20px' }}>Text color</div>{' '}
              <ColorPicker
                theme={this.props.theme.themePromptColor}
                setTheme={(color) =>
                  this.props.setTheme({
                    ...this.props.theme,
                    themePromptColor: color,
                  })
                }
              />
            </div>
            <div className={style.dropdownContentItem}>
              <div style={{ marginRight: '20px' }}>Background color</div>{' '}
              <ColorPicker
                theme={this.props.theme.themeBGColor}
                setTheme={(color) => {
                  this.props.setTheme({
                    ...this.props.theme,
                    themeBGColor: color,
                  })
                }}
              />
            </div>
          </div>
        </button>
        <button
          onClick={this.props.addWindow}
          style={{
            color: this.props.theme.themePromptColor,
            backgroundColor: this.props.theme.themeToolbarColor,
          }}
        >
          Add window
        </button>
      </div>
    )
  }
}

export default MenuBar
