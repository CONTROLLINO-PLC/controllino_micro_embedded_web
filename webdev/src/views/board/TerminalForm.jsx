import { useEffect, useRef, useState } from "react";
import { Button, Input, SVG, Select } from "../../components";

const VALUES = ['New Line', 'Carriage Return', 'Both NL & CR']

export function TerminalForm() {
  const terminalRef = useRef(null)
  const parentRef = useRef(null)
  const [selectVisible, setSelectVisible] = useState(false)
  const [selected, setSelected] = useState(0)
  const [scroll, setScroll] = useState(0)
  const [terminalHeight, setTerminalHeight] = useState(0)
  const [parentHeight, setParentHeight] = useState(0)
  const [grabbing, setGrabbing] = useState(false)
  const [initalGrabbed, setInitialGrabbed] = useState(0)
  const [initalGrabbedScroll, setInitialGrabbedScroll] = useState(0)

  const calculateHeight = () => {
    if (parentRef.current) setParentHeight(parentRef.current.clientHeight)
    if (terminalRef.current) setTerminalHeight(terminalRef.current.clientHeight)
  }

  useEffect(() => {
    calculateHeight()
  }, [])

  return (
    <div className="px-4 py-2 flex flex-col gap-2 justify-between h-full">
      <div className="text-lg text-center">CAN (500kbit/s) / RS485 (8N1-115.2kbit/s)</div>

      <div className="flex justify-between gap-4">
        <div className="grow">
          <Input className='px-3' alignLeft />
        </div>

        <Button className='px-4'>SEND</Button>
      </div>

      <div className="flex justify-between gap-4">
        <div className="grow">
          <Select options={VALUES} selected={selected} setSelected={setSelected} />
        </div>

        <Button className='px-3 ' bgClassName='bg-black hover:bg-black/50 text-primary'>CLEAR</Button>
      </div>

      <div className="grow border border-primary rounded-lg min-h-52 bg-[#251C1C] flex">
        <div className="relative grow h-full">
          <div
            ref={parentRef}
            className="absolute inset-0 z-0 overflow-hidden flex flex-col justify-end"
            onWheel={(e) => {
              e.stopPropagation()
              if (e.deltaY > 0)
                setScroll(i => i - 15 < 0 ? 0 : i - 15)
              else
                setScroll(i => (i + 15 > terminalHeight - parentHeight) ? i : i + 15)
            }}
          >
            <div
              ref={terminalRef}
              className="p-2 flex flex-col gap-1"
              style={{
                marginBottom: -scroll
              }}>
              {
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((i, index) => (
                  <p key={index}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. In adipisci quos porro fuga quam deserunt beatae alias, quas reprehenderit id corrupti voluptatibus doloremque eligendi iure, ea perspiciatis! Laborum, eos nam.</p>
                ))
              }
            </div>
          </div>

        </div>

        <div
              onMouseDown={(e) => {
                setGrabbing(true)
                setInitialGrabbedScroll(scroll)
                setInitialGrabbed(e.pageY)
              }}
              onMouseMove={(e) => {
                if (!grabbing) return;
                setScroll((i) => initalGrabbed > e.pageY ? i + 15 : i - 15)
                setInitialGrabbed(e.pageY)
              }}
          className="w-4 h-full bg-[#201818] rounded mr-1 flex flex-col justify-between items-center"
        >
          <button
            className="h-8"
            onClick={() => setScroll(i => i + 15)}
          >
            <SVG select={'triangle'} />
          </button>
          <div className="grow flex flex-col justify-end px-1">
            <button
              onMouseUp={() => setGrabbing(false)}
              onMouseDown={() => {
                setGrabbing(true)
              }}
              className="w-2 bg-primary rounded-full cursor-grab active:cursor-grabbing"
              style={{
                height: `${(terminalHeight > parentHeight ? parentHeight/terminalHeight : 1)*100}%`,
              }}
            ></button>
            <div style={{
              height: `${(scroll/terminalHeight)*100}%`
            }}></div>

          </div>
          <button
            className="h-8"
            onClick={() => setScroll(i => (i - 15 < 0 ? 0 : i - 15))}
          >
            <SVG select={'triangle'} />
          </button>
        </div>
      </div>
    </div>
  )
}