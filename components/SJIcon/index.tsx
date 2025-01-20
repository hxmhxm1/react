import { ImgHTMLAttributes } from "react"
import icons, { Icons } from "@/assets/icons"
import Image from 'next/image'
import classNames from "classnames"
import './index.scss'

export type SJIconProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  name: keyof Icons
}
const SJIcon: React.FC<SJIconProps> = ({name, className, ...props}) => {
  return (
    <Image 
      className={classNames('sj-icon', className)}
      src={icons[name]}
      alt="name"
    ></Image>
  )
}

export default SJIcon