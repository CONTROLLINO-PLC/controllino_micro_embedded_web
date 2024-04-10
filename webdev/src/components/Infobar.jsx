export function Infobar(props) {
  return (
    <div
    className="overflow-y-auto"
    >
      <div
        className="flex flex-col w-full lg:flex-row gap-2 pt-3 pb-1 lg:w-max "
        {...props}
      />
    </div>

  )
}