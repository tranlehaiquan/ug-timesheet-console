import * as React from 'react'

import { PopOut, IPopOutState } from '../../popout/PopOut'
import { IconButton, IIconButton } from '../icon-button/IconButton'
import { IButtonDropdownCommon } from '../interfaces'

export type IconButtonDropdown = IIconButton & IButtonDropdownCommon

export const IconButtonDropdown: React.FC<IconButtonDropdown> = ({
  placement,
  popOutContainer,
  children,
  className,
  ...otherProps
}) => {
  const button = (isOpen: IPopOutState['isOpen']) => (
    <IconButton className={className} active={isOpen} {...otherProps} />
  )
  const renderContent = () => children

  return (
    <PopOut placement={placement} popOutContainer={popOutContainer} trigger={button} closeOnFirstClick>
      {renderContent}
    </PopOut>
  )
}
