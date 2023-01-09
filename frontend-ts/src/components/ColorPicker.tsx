import { useState } from 'react';
import { SketchPicker } from 'react-color';

function ColorPicker(props) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [color, setColor] = useState(props.theme);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (color) => {
    props.setTheme(color.hex);
    setColor(color.hex);
  };

  return (
    <div>
      <div
        style={{
          width: '18px',
          height: '18px',
          borderRadius: '2px',
          background: color,
          cursor: 'pointer',
        }}
        onClick={handleClick}
      />
      {displayColorPicker ? (
        <div style={{ position: 'absolute', zIndex: '2' }}>
          <div
            style={{
              position: 'fixed',
              top: '0px',
              right: '0px',
              bottom: '0px',
              left: '0px',
            }}
            onClick={handleClose}
          />
          <SketchPicker color={color} onChange={handleChange} />
        </div>
      ) : null}
    </div>
  );
}

export default ColorPicker;
