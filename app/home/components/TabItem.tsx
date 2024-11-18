const TabItem = (props: {title: string, desc?: string}) => {
  const { title, desc } = props
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-lg font-bold">{title}</div>
      <div className="">{desc}</div>
    </div>
  )
}

export default TabItem