import { useState } from "react";
import { Button, Input, SVG, Select } from "../../components";

const VALUES = ['New Line', 'Carriage Return', 'Both NL & CR']

export function TerminalForm() {
  const [selectVisible, setSelectVisible] = useState(false)
  const [selected, setSelected] = useState(0)

  return (
    <div className="px-4 py-2 flex flex-col gap-2 justify-between h-full">
      <div className="text-lg text-center">CAN ( 500kbit/s ) / RS485 ( 8N1-115.2kbit/s )</div>

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

      <div className="grow border border-primary rounded-lg p-2 min-h-52 bg-[#251C1C]">
        {'>_'}
      </div>
    </div>
  )
}