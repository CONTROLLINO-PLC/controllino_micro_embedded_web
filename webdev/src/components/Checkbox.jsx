import { SVG } from './SVG';

export function Checkbox({checked, setChecked}) {

    const handleCheckboxChange = (e) => {
        setChecked(e.target.checked);
    };

    return (
        <label className="flex items-center justify-center cursor-pointer">
            <input
                type="checkbox"
                className="hidden"
                checked={checked}
                onChange={handleCheckboxChange}
            />
            <div
                className={`w-5 h-5 cursor-pointer rounded ${checked ? 'bg-primary' : 'border-primary border-[3px]'
                    }`}
            >
                {checked && (
                    <SVG select={'checkbox'} />
                )}
            </div>
        </label>
    );
};
