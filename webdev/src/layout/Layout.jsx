import { useContext, useState } from "react";
import { Alert, CustomHeader, InfoCard, InfoHeader, Infobar, Login, Navbar, NavbarItem, Notification } from "../components";
import { BoardView, FirmwareView, NetworkView } from "../views";
import { LayoutContext } from "./layout.context";
import { SVG } from "../components";

const views = {
  board: <BoardView />,
  network: <NetworkView />,
  firmware: <FirmwareView />,
}

export function Layout() {
  const [view, setView] = useState("board")
  const { alerts, tmcu, vsupply, notification, login } = useContext(LayoutContext)

  if (!login) return <Login />

  return (
    <div className="bg-[#1f1f1f] flex flex-col min-h-svh select-none">
      <CustomHeader>
        <img src="/controllino.png" className="h-[40px]" />
        <InfoHeader text="MICRO Embedded Web" />
      </CustomHeader>
      <Infobar>
        <InfoCard
          icon={<SVG select={"vsupply"} />}
          text={`Vsupply: ${vsupply.toFixed(3)} V`}
        />
        <InfoCard
          icon={<SVG select={"tmcu"} />}
          text={`Tsensor: ${tmcu.toFixed(3)} °C`}
        />
        <InfoCard
          icon={<SVG select={"tmcu"} />}
          text={`Tmcu: ${tmcu.toFixed(3)} °C`}
        />
      </Infobar>
      <Navbar>
        <NavbarItem onClick={() => setView("board")} selected={view === "board"} text="board" />
        <NavbarItem onClick={() => setView("network")} selected={view === "network"} text="network" />
        <NavbarItem onClick={() => setView("firmware")} selected={view === "firmware"} text="firmware" />
      </Navbar>

      <div className="grow">
        <div className="relative">
          <div className='absolute flex justify-end w-full pr-8'>
            <div className="">
              <Alert alerts={alerts} />
              <Notification notification={notification} />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center w-full mt-8">
          {views[view]}
        </div>
      </div>

    </div>
  )
}