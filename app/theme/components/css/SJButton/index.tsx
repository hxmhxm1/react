import { HTMLAttributes, useImperativeHandle, useState } from 'react'
import './index.scss'
import classNames from 'classnames'

export type CssButtonProps = HTMLAttributes<HTMLDivElement> &  {
  type?: 'default' | 'primary' | 'plain' | 'danger'
  size?: 'mini' | 'small' | 'normal' | 'large'
  disabled?: boolean
  onClick?: (e: any) => void
  children: React.ReactNode
  htmlType?: 'submit' | 'button' | 'reset',
  ref?: React.Ref<{
    handleTouchStart: () => void
  }> | null
}

const CssButton = ({
  className,
  type = 'primary',
  size = 'normal',
  disabled = false,
  children,
  onClick,
  htmlType,
  ref
}: CssButtonProps) => {
  const [active, setActive] = useState(false)
  const handleTouchStart = () => {
    setActive(true)
    setTimeout(() => {
      setActive(false)
    }, 150)
  }

  useImperativeHandle(ref, () => {
    return {
      handleTouchStart
    }
  })

  return (
    <div
      className={classNames(
        className,
        'css-button',
        `css-button-${type}`,
        `css-button-${size}`,
        disabled ? 'css-button-disabled' : '',
        active && type === 'primary' ? 'css-button-active' : '',
      )}
      onClick={disabled ? undefined : onClick}
      onTouchStart={handleTouchStart}
    >
      <button type={htmlType}>{children}</button>
    </div>
  )
}

export default CssButton