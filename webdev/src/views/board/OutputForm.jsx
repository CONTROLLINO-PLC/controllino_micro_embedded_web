import { useContext } from "react";
import { Button, Input, Switch, Slider, Checkbox } from "../../components";
import { LayoutContext } from "../../layout/layout.context";

function Row({slider, onChangeSlider, checkbox, onChangeCheckbox, switchValue, onChangeSwitch, currentLimit, onChangeCurrentLimit}) {
    return (
        <div className="flex justify-between items-center gap-4">
            <Input type='number' min={500} max={3000} className='w-16' value={currentLimit} onChange={onChangeCurrentLimit} />
            <Button className='px-4'>SET</Button>
            <Slider value={slider} onChange={onChangeSlider} />
            <Checkbox checked={checkbox} setChecked={onChangeCheckbox} />
            <Switch onChange={onChangeSwitch} checked={switchValue} />
        </div>
        
    )
}

export function OuputForm() {
    const {sliders, setSlider, checkboxs, setCheckbox, switchs, setSwitch, currentLimits, setCurrentLimit} = useContext(LayoutContext)

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
                    [0, 1, 2, 3, 4, 5, 6, 7].map((i, index) => (
                        <Row
                            key={index}
                            currentLimit={currentLimits[index]}
                            onChangeCurrentLimit={(e) => setCurrentLimit(index, +e.target.value)}
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