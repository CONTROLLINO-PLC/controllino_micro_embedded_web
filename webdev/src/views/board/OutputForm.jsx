import { useContext, useEffect, useState } from "react";
import { Button, Input, Switch, Slider, Checkbox } from "../../components";
import { LayoutContext } from "../../layout/layout.context";

function Row({ slider, onChangeSlider, checkbox, onChangeCheckbox, switchValue, onChangeSwitch, currentLimit, onChangeCurrentLimit, clickSetCurrentLimit }) {
    const [localCurrentLimit, setLocalCurrentLimit] = useState(currentLimit.toFixed(3));

    const handleInputChange = (e) => {
        const value = e.target.value;
        setLocalCurrentLimit(value);
        if (value === '' || (parseFloat(value) >= 0.5 && parseFloat(value) <= 3)) {
            onChangeCurrentLimit(parseFloat(value));
        }
    };

    const handleInputBlur = () => {
        if (localCurrentLimit !== '') {
            const formattedValue = parseFloat(localCurrentLimit).toFixed(3);
            setLocalCurrentLimit(formattedValue);
            onChangeCurrentLimit(parseFloat(formattedValue));
        }
    };

    useEffect(() => {
        setLocalCurrentLimit(currentLimit.toFixed(3));
    }, [currentLimit]);

    return (
        <div className="grid grid-cols-12 items-center gap-4">
            <div className="col-span-3">
                <Input
                    type='number'
                    min='0.500'
                    max='3.000'
                    step='0.001'
                    value={localCurrentLimit}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className='border outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:_textfield]'
                />
            </div>
            <div className="col-span-9 flex justify-between gap-4 items-center">
                <Button onClick={clickSetCurrentLimit} disabled={localCurrentLimit < 0.5 || localCurrentLimit > 3} className='px-2 col-span-2'>SET</Button>
                <Slider value={slider} onChange={onChangeSlider} />
                <Checkbox checked={checkbox} setChecked={onChangeCheckbox} />
                <Switch onChange={onChangeSwitch} checked={switchValue} />
            </div>
        </div>
    )
}

export function OutputForm() {
    const { sliders, setSlider, checkboxs, setCheckbox, switchs, setSwitch, currentLimits, setCurrentLimit, clickSetCurrentLimit } = useContext(LayoutContext);

    return (
        <div className="px-4 py-2 flex flex-col gap-1 justify-between h-full">
            <div className="text-lg text-center">OUTPUTS</div>

            <div className="flex justify-between">
                <div className="col-span-2">
                    CURRENT LIMIT A
                </div>
                <div className="col-span-4">PWM</div>
                <div>DIGITAL</div>
            </div>

            {
                sliders.map((slider, index) => (
                    <Row
                        key={index}
                        currentLimit={currentLimits[index]}
                        onChangeCurrentLimit={v => setCurrentLimit(index, v)}
                        clickSetCurrentLimit={() => clickSetCurrentLimit(index, currentLimits[index])}
                        slider={sliders[index]}
                        onChangeSlider={(e) => setSlider(index, +e.target.value)}
                        checkbox={checkboxs[index]}
                        onChangeCheckbox={(v) => setCheckbox(index, v)}
                        switchValue={switchs[index]}
                        onChangeSwitch={(v) => setSwitch(index, v)}
                    />
                ))
            }

        </div>
    )
}