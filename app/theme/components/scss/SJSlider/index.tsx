'use client'
import { useRef, useState } from 'react'
import './index.scss'

type SliderProps = {
  max?: number,
  min?: number,
  curVal?: number,
  onSliderChange?: (step: number) => void
}

const SJSlider = ({
  max=10, 
  min=0,
  curVal=0,
  onSliderChange
}: SliderProps) => {
  const slider = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState<number>(curVal)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const step = Number.parseInt(e.target.value)
    onSliderChange?.(step)
    setValue(step)
  }

  return (
    <div className="scss-slider-bar">
      <input
        ref={slider}
        type="range"
        min={min}
        max={max}
        value={value}
        style={
          { '--min': `${min}`, '--max': `${max}`, '--value': `${value || 0}` } as React.CSSProperties
        }
        className="slider"
        id="myRange"
        onChange={handleChange}
      />
    </div>
  )
}

export default SJSlider
