import { useState } from "react";

export function Slider({ value, onChange }) {
    const [selected, setSelected] = useState(false)

    return (
        <div className="relative w-full flex items-center">
            <div className="absolute inset-x-0 h-1 bg-primary/40 rounded-full" />
            <div
                id="sliderTrack"
                className={`absolute h-1.5 rounded-full bg-primary ${value > 0 ? 'w-full' : 'w-0'}`}
                style={{ width: `${value}%` }}
            />

            <div
                id="sliderThumb"
                className={"absolute my-auto -m-2.5 w-5 h-5  rounded-full bg-primary  "}
                style={{ left: `${value}%` }}
            >
                {selected && <div className="w-full h-full bg-primary rounded-full animate-ping" />}
            </div>

            <input
                id="sliderInput"
                type="range"
                min="0"
                max="100"
                onMouseDown={() => setSelected(true)}
                onMouseUp={() => setSelected(false)}
                value={value}
                onChange={onChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
            />
        </div>

    );
};
