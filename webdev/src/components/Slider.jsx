import { useState, useEffect } from "react";

export function Slider({ value, onChange }) {
    const [selected, setSelected] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleSliderChange = (e) => {
        setLocalValue(e.target.value);
    };

    const handleSliderChangeEnd = () => {
        setSelected(false);
        onChange({ target: { value: localValue } });
    };

    return (
        <div className="relative w-full flex items-center">
            <div className="absolute inset-x-0 h-1 bg-primary/40 rounded-full" />
            <div
                id="sliderTrack"
                className={`absolute h-1.5 rounded-full bg-primary ${localValue > 0 ? 'w-full' : 'w-0'}`}
                style={{ width: `${localValue}%` }}
            />

            <div
                id="sliderThumb"
                className={"absolute my-auto -m-2.5 w-5 h-5 rounded-full bg-primary"}
                style={{ left: `${localValue}%` }}
            >
                {selected && <div className="w-full h-full bg-primary rounded-full animate-ping" />}
            </div>

            <input
                id="sliderInput"
                type="range"
                min="0"
                max="100"
                onMouseDown={() => setSelected(true)}
                onMouseUp={handleSliderChangeEnd}
                onTouchEnd={handleSliderChangeEnd}
                value={localValue}
                onChange={handleSliderChange}
                className="absolute w-full h-1 opacity-0 cursor-pointer"
                style={{ top: '50%', transform: 'translateY(-50%)' }}
            />
        </div>
    );
}