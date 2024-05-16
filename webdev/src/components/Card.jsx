export function Card({ className, ...props }) {
  return (
    <div
      className={"p-2 border-2 border-gray-400 bg-[#3d3c3d] text-white " + className}
      {...props}
    />
  )
}