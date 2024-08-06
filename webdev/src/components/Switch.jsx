export function Switch({ onChange, checked }) {
    return (
        <label className="flex justify-center mt-4 items-center cursor-pointer relative mb-4">
            <input type="checkbox" id="toggle-example" className="sr-only"
                onChange={(e) => onChange(e.target.checked)} checked={checked} />
            <div className="relative flex items-center h-6 w-11">
                <div className={`absolute toggle-bg h-4 w-11 rounded-full 
                ${checked ? 'bg-primary/50' : 'bg-gray-400/50'}`} />
                <div className={`absolute toggle-bg h-6 w-6 rounded-full 
                transition-transform duration-200 ease-in-out 
                ${checked ? 'right-0 bg-primary' : 'left-0 bg-primary'}`} />
            </div>
        </label>
    )
}
