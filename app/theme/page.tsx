'use client'
import React from 'react';
import './page.scss'
import { CssSlider, CssButton } from './components/css/index'
import { ScssSlider, ScssButton } from './components/scss/index'

const Demo = () => {
  const toggleTheme = (type: string) => {
    const curTheme = document.documentElement.getAttribute(type);
    if(type === 'css-theme'){
      if (!curTheme || curTheme === 'dark') {
        document.documentElement.setAttribute(type, "light");
      } else {
        document.documentElement.setAttribute(type, "dark");
      }
    }else{
      if (!curTheme || curTheme === 'yellow') {
        document.documentElement.setAttribute(type, "red");
      } else {
        document.documentElement.setAttribute(type, "yellow");
      }
    }
    console.log('切换主题色')
  }

  return <div className="test">
    <section>
      <ShowItem component={<div className='text'>css变量+类名切换</div>} />
      <ShowItem component={<CssButton onClick={() => toggleTheme('css-theme')}>切换主题</CssButton>} />
      <ShowItem component={<CssSlider min={2} max={10} curVal={5}></CssSlider>} />
      <ShowResult 
        good={['简单易于理解', '颜色单独分开好管理','切换时流畅不卡顿']} 
        bad={['实际开发时效率不高，写每个颜色时，需要到全局去找变量', '需要同时引入对主题文件，影响首屏加载', '不兼容ie浏览器']}
      ></ShowResult>
    </section>
    <section>
      <ShowItem component={<div>scss中mixin+类名切换</div>} />
      <ShowItem component={<ScssButton onClick={() => toggleTheme('scss-theme')}>切换主题</ScssButton>} />
      <ShowItem component={<ScssSlider min={2} max={10} curVal={5}></ScssSlider>} />
      <ShowResult 
        good={['提高开发效率','易于维护', '切换流畅不卡顿','兼容性好']} 
        bad={['需要同时引入对主题文件，影响首屏加载']}
      ></ShowResult>
    </section>
    <section>
    <ShowItem component={<div>css in js</div>} />
    </section>
    <section><ShowItem component={<div>通过link标签动态引入(Js)</div>} /></section>
  </div>
}

const ShowItem = ({title, component} : {
  title?: string,
  component: JSX.Element,
}) => (
  <div className="showItem">
    {
      title && (
      <span className="label">
        {title}
      </span>
      )
    }
    {component}
  </div>
)

const ShowResult = ({good, bad}: {good: string[], bad: string[]}) => {
  return <div className="result">
  <div className="result-item">
    <div className='result-item-title'>优点</div>
    <ul>
      {
        good.map((item, index) => <li key={index}>({index+1}) {item}</li>)
      }
    </ul>
  </div>
  <div className='result-item'>
  <div className='result-item-title'>缺点</div>
    <ul>
      {
        bad.map((item, index) => <li key={index}>({index+1}) {item}</li>)
      }
    </ul>
  </div>
</div>
}

export default Demo;
