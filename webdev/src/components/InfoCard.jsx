export function InfoCard(props) {
  return (
    <div
      className="flex py-6 min-w-80 rounded-sm bg-[#404038] gap-1 text-primary justify-center"
    >
      {props.icon}
      <p className="text-white">{props.text}</p>
    </div>
  )
}
