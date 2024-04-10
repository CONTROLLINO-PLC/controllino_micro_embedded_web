export function Button({className, onClick, bgClassName, ...props}) {
  return (
    <button
      className={`py-1 px-auto rounded-full font-bold ${ bgClassName ? bgClassName : 'bg-primary hover:bg-primary/70 text-black' } transition-transform duration-500 ease-in-out transform active:scale-95 ` + className}
      onClick={onClick}
      {...props}
    />
  )
}