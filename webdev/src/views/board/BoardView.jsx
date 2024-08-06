import { Card } from "../../components";
import { BoardForm } from "./BoardForm";
import { InputForm } from "./InputForm";
import { OuputForm } from "./OutputForm";
import { TerminalForm } from "./TerminalForm";

export function BoardView() {
  return (
    <div className="grid grid-cols-4 mx-auto gap-14 my-8 grid-flow-row">
      <div className="col-span-4 md:col-span-2 2xl:col-span-1 row-start-1 md:row-start-2">
        <Card className="mx-auto max-w-md h-full">
          <OuputForm />
        </Card>
      </div>
      <div className="col-span-4 md:col-span-2 2xl:col-span-1 row-start-2  md:row-start-1 md:row-end-4">
        <div className="mx-auto max-w-md h-full">
          <BoardForm />
        </div>
      </div>

      <div className="col-span-4 md:col-span-2 2xl:col-span-1 row-start-3 md:row-start-4 2xl:row-start-2">
        <Card className='mx-auto max-w-md h-full'>
          <InputForm />
        </Card>
      </div>

      <div className="col-span-4 md:col-span-2 2xl:col-span-1 row-start-4 md:row-start-4 2xl:row-start-2">
        <Card className="mx-auto max-w-md h-full">
          <TerminalForm />
        </Card>
      </div>
    </div>
  )
}