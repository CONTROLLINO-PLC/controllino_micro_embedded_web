import { useContext, useEffect, useState } from "react";
import { Button, Input } from "../../components";
import { LayoutContext } from "../../layout/layout.context";

function Row({ addClassName, reading, threshold, onChangeThreshold, clickSetThreshold }) {
    const [localThreshold, setLocalThreshold] = useState(threshold);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setLocalThreshold(value);
        if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 30)) {
            onChangeThreshold(parseFloat(value));
        }
    };

    const handleInputBlur = () => {
        if (localThreshold !== '') {
            const formattedValue = parseFloat(localThreshold).toFixed(5);
            setLocalThreshold(formattedValue);
            onChangeThreshold(parseFloat(formattedValue));
        }
    };

    useEffect(() => {
        setLocalThreshold(threshold);
    }, [threshold]);

    return (
        <div className={"grid grid-cols-5 items-center gap-4 " + addClassName}>
            <div className="col-span-2">
                <Input value={reading.toFixed(5)} readOnly className='cursor-default' />
            </div>
            <div className="col-span-2">
                <Input
                    type='number'
                    min='0.00000'
                    max='30.00000'
                    step='0.00001'
                    value={localThreshold}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className='border outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:_textfield]'
                />
            </div>
            <Button onClick={clickSetThreshold} disabled={localThreshold < 0 || localThreshold > 30} className='px-auto'>SET</Button>
        </div>
    )
}

export function InputForm() {
    const { readings, thresholds, setThreshold, clickSetThreshold } = useContext(LayoutContext);

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
                readings.map((reading, index) => (
                    <Row
                        key={index}
                        addClassName={index === 6 ? 'mt-4' : ''}
                        reading={reading}
                        threshold={thresholds[index]}
                        clickSetThreshold={() => clickSetThreshold(index, thresholds[index])}
                        onChangeThreshold={v => setThreshold(index, v)}
                    />
                ))
            }

        </div>
    )
}