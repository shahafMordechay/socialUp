import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

const TooltipButton = ({
  children,
  tip,
  placement,
  tipClassName,
  btnClassName,
  onClick,
  style
}) => (
  <Tooltip
    title={tip}
    placement={placement}
    className={tipClassName}
    style={style}
  >
    <IconButton onClick={onClick} className={btnClassName}>
      {children}
    </IconButton>
  </Tooltip>
);

export default TooltipButton;
