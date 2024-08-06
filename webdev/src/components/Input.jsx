export function Input({ suffix, className, alignLeft, ...props }) {
  return (
    <div className="relative">
      <input
        className={"bg-white/0 border-2 py-1 text-lg w-full border-primary invalid:border-red-700 rounded-lg " + (alignLeft ? 'text-left' : 'text-center') + " focus:outline-none focus:ring-1 focus:ring-primary/40 invalid:focus:ring-red-700  " + className}
        {...props}
      />
      <div className="absolute top-0 bottom-0 flex items-center text-gray-400 right-2">{suffix}</div>
    </div>

  )
}

