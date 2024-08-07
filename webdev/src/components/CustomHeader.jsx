import { useContext } from "react";
import { Button } from "./Button";
import { LayoutContext } from "../layout/layout.context";
import { SVG } from "./SVG";

export function CustomHeader(props) {
  const { setLogin } = useContext(LayoutContext)
  return (
    <header
      className="bg-[#111111] py-1 px-4 flex justify-between items-center gap-10"
      {...props}
    >
      <div className="flex gap-10">
        {props.children}
      </div>

      <div className="flex gap-4">
        <Button onClick={() => window.location.reload()} className='bg-transparent  hover:bg-transparent' title='reload'>
          <SVG select='reload' />
        </Button>
        <Button onClick={() => setLogin(false)} className='bg-transparent hover:bg-transparent' title='logout'>
          <SVG select='logout' />
        </Button>
      </div>
    </header>
  )
}
export function InfoHeader(props) {
  return (
    <div
      className="py-1 h-fit my-auto px-4 hidden lg:block bg-primary rounded-full font-bold"
    >{props.text}</div>
  )
}