import { SVG } from "./SVG";

export function Alert({ alerts }) {
  const filteredAlerts = Object.values(alerts).filter(value => typeof value === 'string' && value.trim() !== '');

  if (filteredAlerts.length > 0)
    return (
      // <div
      //   className="absolute top-12 left-0 right-12 flex justify-end"
      // >
      // {
      <div id="alert" className="bg-[#ed6c02] ring ring-orange-700 py-4 px-16 text-xl text-[#fff] font-bold rounded flex gap-12 items-center">
        <SVG select={'alert'} />
        <ul className={'list-disc'}>
          {
            Object.values(alerts)
              .filter(value => typeof value === 'string' && value.trim() !== '')
              .map((alert, index) => (
                <li key={index}>
                  {alert}
                </li>
              ))
          }
        </ul>
      </div>
      // }
      // </div>
    )
}