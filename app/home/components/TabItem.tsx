const TabItem = (props: {title: string, desc?: string}) => {
  const { title, desc } = props
  return (
    <div className="w-[15rem] h-[15rem] bg-[yellow] mr-[2rem] flex flex-col justify-center items-center">
      <div className="text-lg font-bold">{title}</div>
      <div className="">{desc}</div>
    </div>
  )
}

export default TabItem