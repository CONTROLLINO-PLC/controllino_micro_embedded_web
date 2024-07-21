import { useContext, useEffect, useRef, useState } from "react";
import { Button, Input, SVG, Select } from "../../components";
import { LayoutContext } from "../../layout/layout.context";

const VALUES = ['New Line', 'Carriage Return', 'Both NL & CR']

export function TerminalForm() {
  const [selected, setSelected] = useState(0)
  const ref = useRef()
  const [scrolled, setScrolled] = useState(true)
  const { serials, setSerials, setSerial } = useContext(LayoutContext)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (serials.length > 50) setSerials(i => i.slice(serials.length - 50))
    setTimeout(() => {
      if (scrolled) scroll()
    }, 0);
  }, [serials, scrolled])

  const clear = () => {
    setSerials([])
    setScrolled(true)
  }

  const scroll = () => {
    if (!ref.current) return;
    ref.current.scroll({
      top: ref.current.scrollHeight,
      behavior: 'smooth'
    });
  }

  return (
    <div className="px-4 py-2 flex flex-col gap-2 justify-between h-full">
      <div className="text-lg text-center">CAN (500kbit/s) / RS485 (8N1-115.2kbit/s)</div>

      <div className="flex justify-between gap-4">
        <div className="grow">
          <Input
            className='px-3'
            alignLeft 
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
        </div>

        <Button className='px-4' onClick={() => {
          setSerial(message)
          setMessage('')
        }}>SEND</Button>
      </div>

      <div className="flex justify-between gap-4">
        <div className="grow">
          <Select options={VALUES} selected={selected} setSelected={setSelected} />
        </div>

        <Button className='px-3 ' bgClassName='bg-black hover:bg-black/50 text-primary' onClick={clear}>CLEAR</Button>
      </div>

      <div className="grow border border-primary rounded-lg min-h-52 bg-[#251C1C] flex">
        <div className="relative grow h-full">
          <button
            className={`absolute bottom-4 right-4 text-white z-30 ${scrolled && 'hidden'}`}
            onClick={scroll}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </button>
          <div
            className="absolute inset-0 overflow-y-auto bg-[#251C1C]  rounded-lg"
            ref={ref}
            onScroll={(e) => {
              const size = e.currentTarget.scrollHeight - e.currentTarget.clientHeight
              const scrollDown = size - e.currentTarget.scrollTop
              setScrolled(scrollDown < 60)
            }}
          >
            <div
              className={[
                // "overflow-auto",
                "bg-[#251C1C]  shadow-inner p-1 gap-1 flex flex-col justify-end",
              ].join(' ')}
            >
              {serials.map((serial, key) => <p key={key} style={{ marginBlockStart: 0, marginBlockEnd: 2, color: serial.split("<:::>")[0] === "send" ? "yellow" : "white" }}>
                {'>_ ' + serial.split("<:::>")[1].replace('\\n', `\n`)}</p>)}
              <p style={{ marginBlockStart: 0, marginBlockEnd: 2 }}>{'>_'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}