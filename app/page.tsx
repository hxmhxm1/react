'use client'
import { useRouter } from 'next/navigation'
import './globals.css'
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter()
  const data = [
    {
      title: 'useContext、useReducer', 
      url: '/home',
      desc: '等同于vue中的provide、inject'
    },
    {
      title: '组件主题切换', 
      url: '/theme',
      desc: ''
    },
    {
      title: 'React 19 新特性',
      url: '/react19',
      desc: '了解 React 19 中的新特性和改进'
    }
  ]
  const goDetail = (params: {title: string, url: string, desc: string}) => {
    router.push(params.url)
  }
  // 生成随机颜色 
  const randomColor = () => {
    function isLightColor(color: string) {
      // 判断颜色是否为浅色
      const rgb = parseInt(color.substring(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return luma > 170; // 调整阈值以适应你定义的浅色范围
    }
    // 生成浅色系随机颜色
    let color = '#';
    while(!isLightColor(color)){
      color = '#' + Math.floor(Math.random()*16777215).toString(16);
    }
    return color;
  }

  return (
    <div className="content" suppressHydrationWarning>
      {
        data.map((item, index) => {
          return (
          <div 
            key={index} 
            style={{'background': randomColor()}} 
            className="card" 
            onClick={() => goDetail(item)} 
            suppressHydrationWarning
          >
            <div className="title">{item.title}</div>
            <div className="grey">{item.desc}</div>
          </div>
        )})
      }
    </div>
  );
}
