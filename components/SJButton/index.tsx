import { HTMLAttributes, useImperativeHandle, useState } from 'react'
import './index.scss'
import classNames from 'classnames'

export type SJButtonProps = HTMLAttributes<HTMLDivElement> &  {
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

const SJButton = ({
  className,
  type = 'primary',
  size = 'normal',
  disabled = false,
  children,
  onClick,
  htmlType,
  ref
}: SJButtonProps) => {
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
        'sj-button',
        `sj-button-${type}`,
        `sj-button-${size}`,
        disabled ? 'sj-button-disabled' : '',
        active && type === 'primary' ? 'sj-button-active' : '',
      )}
      onClick={disabled ? undefined : onClick}
      onTouchStart={handleTouchStart}
    >
      <button type={htmlType}>{children}</button>
    </div>
  )
}

export default SJButton