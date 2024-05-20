import { useState } from "react";
import { Input } from "./Input";
import { SVG } from "./SVG";

export function Select({ selected, options, setSelected }) {
  const [selectVisible, setSelectVisible] = useState(false)

  return (
    <>
      {
        selectVisible && (
          <div className="fixed inset-0" onClick={() => setSelectVisible(false)}></div>
        )
      }
      <div className="relative cursor-pointer" onClick={() => setSelectVisible(i => !i)}>
        <Input
          alignLeft
          readOnly
          value={options[selected]}
          className='px-3 cursor-pointer'
          suffix={(
            <div className={`${selectVisible ? 'rotate-180' : ''}`}>
              <SVG select={'triangle'} />
            </div>
          )}
        />
        {
          selectVisible && (
            <div className={"absolute bg-[#3d3c3d] py-2 rounded border border-gray-500 inset-x-0 mt-1"}>
              {
                options.map((i, index) => (
                  <div
                    key={index}
                    onClick={() => setSelected(index)}
                    className={"p-3 hover:bg-[#4d4c4d] " + (selected === index ? 'text-primary bg-[#414040]' : '') + " cursor-pointer"}
                  >{i}</div>
                ))
              }

            </div>
          )
        }
      </div>
    </>

  )
}