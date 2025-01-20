import './index.scss'
import { HTMLAttributes, useEffect, useState } from 'react';
import classNames from 'classnames';
import SJIcon from '../SJIcon';

export type SJRadioProps = HTMLAttributes<HTMLDivElement> & {
  checked: boolean;
  title?: string;
  onClick?: () => void
}
const SJRadio: React.FC<SJRadioProps> = ({
  className,
  title,
  children,
  checked=false,
  onClick,
  ...props
}) => {
  return <div className={classNames('sj-radio', className)} onClick={onClick} {...props}>
    <SJIcon
      className='sj-radio-icon'
      name={checked? 'IconRadioChecked' : 'IconRadioDefault'}
    ></SJIcon>
    {title && <span className="sj-radio-title">{title}</span>}
    {children}
  </div>
}

export default SJRadio