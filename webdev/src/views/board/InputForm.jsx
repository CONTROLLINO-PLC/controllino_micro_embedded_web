import { useContext } from "react";
import { Button, Input } from "../../components";
import { LayoutContext } from "../../layout/layout.context";

function Row({ firstInput, secondInput, onChangeSecondInput, addClassName, clickSetInput }) {
    return (
        <div className={"grid grid-cols-5 items-center gap-4 " + addClassName}>
            <div className="col-span-2">
                <Input value={+firstInput} readOnly className='cursor-default' />
            </div>
            <div className="col-span-2">
                <Input type='number' min={0} max={30}  value={+secondInput} onChange={e => onChangeSecondInput(+e.target.value)} />
            </div>
            <Button onClick={clickSetInput} disabled={secondInput < 0 || secondInput > 30} className='px-auto'>SET</Button>
        </div>
    )
}

export function InputForm() {
    const { inputs, setInput, clickSetInput } = useContext(LayoutContext)

    return (
        <div className="px-4 py-2 flex flex-col gap-1 justify-between h-full">
            <div className="text-lg text-center">INPUTS</div>

            <div className="flex justify-between">
                <div className="col-span-2">
                    READINGS
                </div>
                <div>DIGITAL THRESHOLD V</div>
            </div>

            {
                inputs.map((i, index) => (
                    <Row
                        key={index}
                        addClassName={index === 6 ? 'mt-4' : ''}
                        firstInput={i[0]}
                        secondInput={i[1]}
                        clickSetInput={() => clickSetInput(index, i[1])}
                        onChangeSecondInput={v => setInput(index, 1, +v)}
                    />
                ))
            }

        </div>
    )
}