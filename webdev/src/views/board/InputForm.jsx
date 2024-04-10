import { useContext } from "react"
import { Button, Input } from "../../components"
import { LayoutContext } from "../../layout/layout.context"

function Row({ firstInput, secondInput, onChangeFirstInput, onChangeSecondInput, addClassName }) {
    return (
        <div className={"flex justify-between items-center gap-4 " + addClassName}>
            <Input value={firstInput} onChange={e => onChangeFirstInput(+e.target.value)} />
            <Input value={secondInput} onChange={e => onChangeSecondInput(+e.target.value)} />
            <Button className='px-4'>SET</Button>
        </div>
    )
}

export function InputForm() {
    const { inputs, setInput } = useContext(LayoutContext)

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
                        onChangeFirstInput={v => setInput(index, 0, v)}
                        onChangeSecondInput={v => setInput(index, 1, v)}
                    />
                ))
            }

        </div>
    )
}