export function Navbar(props) {
  return (
    <div
      className="bg-primary flex"
      {...props}
    />
  )
}

export function NavbarItem(props) {
  return (
    <div
      className={"py-2 cursor-pointer px-4 uppercase " + (props.selected && 'bg-gray-600/50 text-primary border-b-2 border-b-gray-600')}
      onClick={props.onClick}
    >{props.text}</div>
  )
}