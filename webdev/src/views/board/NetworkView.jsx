import { useEffect, useState } from "react"
import { Input } from "../../components"

function NetworkFormItem({ name, value }) {
    return (
        <div className="flex flex-col items-center gap-2 my-4 mx-2">
            {value}
        </div>
    )
}

export function NetworkView() {
    if (document.getElementById("alert"))
        document.getElementById("alert").style.display = "none";
    const [ip1, setIp1] = useState("0");
    const [ip2, setIp2] = useState("0");
    const [ip3, setIp3] = useState("0");
    const [ip4, setIp4] = useState("0");
    const [gw1, setGw1] = useState("0");
    const [gw2, setGw2] = useState("0");
    const [gw3, setGw3] = useState("0");
    const [gw4, setGw4] = useState("0");
    const [sn1, setSn1] = useState("0");
    const [sn2, setSn2] = useState("0");
    const [sn3, setSn3] = useState("0");
    const [sn4, setSn4] = useState("0");
    const [mac1, setMac1] = useState("0");
    const [mac2, setMac2] = useState("0");
    const [mac3, setMac3] = useState("0");
    const [mac4, setMac4] = useState("0");
    const [mac5, setMac5] = useState("0");
    const [mac6, setMac6] = useState("0");

    useEffect(() => {
        reData();
    }, []);

    const reData = async ev => fetch(`http://${import.meta.env.VITE_IP}:${import.meta.env.VITE_PORT}/api/network/settings`)
        .then(r => r.json())
        .then(r => {
            const ipValues = r.ip.split(".");
            const subnetValues = r.mask.split(".");
            const gatewayValues = r.gw.split(".");
            const macValues = r.mac.split(":");
            for (let i = 0; i < 4; i++) {
                setIp1(ipValues[0])
                setIp2(ipValues[1])
                setIp3(ipValues[2])
                setIp4(ipValues[3])
                setGw1(gatewayValues[0])
                setGw2(gatewayValues[1])
                setGw3(gatewayValues[2])
                setGw4(gatewayValues[3])
                setSn1(subnetValues[0])
                setSn1(subnetValues[1])
                setSn1(subnetValues[2])
                setSn1(subnetValues[3])
            }
            for (let i = 0; i < 6; i++) {
                setMac1(macValues[0])
                setMac2(macValues[1])
                setMac3(macValues[2])
                setMac4(macValues[3])
                setMac5(macValues[4])
                setMac6(macValues[5])
            }
        });
    return (
        <div className="flex justify-center items-start mt-3">
            <div className="flex flex-col bg-[#3c3d3c] text-slate-300 max-w-xl rounded border-2 border-gray-500">
                <div className="grid grid-cols-5 -mb-4">
                    <div className="flex mx-2 items-center font-bold uppercase"> ip address: </div>
                    <NetworkFormItem value={<Input className={"rounded-md"} value={ip1} onChange={(e) => setIp1(e.target.value)} />} />
                    <NetworkFormItem value={<Input className={"rounded-md"} value={ip2} onChange={(e) => setIp2(e.target.value)} />} />
                    <NetworkFormItem value={<Input className={"rounded-md"} value={ip3} onChange={(e) => setIp3(e.target.value)} />} />
                    <NetworkFormItem value={<Input className={"rounded-md"} value={ip4} onChange={(e) => setIp4(e.target.value)} />} />
                </div>
                <div className="grid grid-cols-5 -mb-4">
                    <div className="flex mx-2 items-center font-bold uppercase"> subnet:</div>
                    <NetworkFormItem value={<Input className={"rounded-md"} value={sn1} onChange={(e) => setSn1(e.target.value)} />} />
                    <NetworkFormItem value={<Input className={"rounded-md"} value={sn2} onChange={(e) => setSn2(e.target.value)} />} />
                    <NetworkFormItem value={<Input className={"rounded-md"} value={sn3} onChange={(e) => setSn3(e.target.value)} />} />
                    <NetworkFormItem value={<Input className={"rounded-md"} value={sn4} onChange={(e) => setSn4(e.target.value)} />} />
                </div>
                <div className="grid grid-cols-5 -mb-4">
                    <div className="flex mx-2 items-center font-bold uppercase"> gateway: </div>
                    <NetworkFormItem value={<Input className={"rounded-md"} value={gw1} onChange={(e) => setGw1(e.target.value)} />} />
                    <NetworkFormItem value={<Input className={"rounded-md"} value={gw2} onChange={(e) => setGw2(e.target.value)} />} />
                    <NetworkFormItem value={<Input className={"rounded-md"} value={gw3} onChange={(e) => setGw3(e.target.value)} />} />
                    <NetworkFormItem value={<Input className={"rounded-md"} value={gw4} onChange={(e) => setGw4(e.target.value)} />} />
                </div>
                <div className="grid grid-cols-5 -mb-4">
                    <div className="flex mx-2 items-center font-bold uppercase"> mac: </div>
                    <NetworkFormItem value={<Input className={"rounded-md"} value={mac1} onChange={(e) => setMac1(e.target.value)} />} />
                    <NetworkFormItem value={<Input className={"rounded-md"} value={mac2} onChange={(e) => setMac2(e.target.value)} />} />
                    <NetworkFormItem value={<Input className={"rounded-md"} value={mac3} onChange={(e) => setMac3(e.target.value)} />} />
                </div>
                <div className="grid grid-cols-5 gap-2">
                    <NetworkFormItem />
                    <NetworkFormItem value={<Input className={"rounded-md"} value={mac4} onChange={(e) => setMac4(e.target.value)} />} />
                    <NetworkFormItem value={<Input className={"rounded-md"} value={mac5} onChange={(e) => setMac5(e.target.value)} />} />
                    <NetworkFormItem value={<Input className={"rounded-md"} value={mac6} onChange={(e) => setMac6(e.target.value)} />} />
                </div>
            </div>
        </div>
    );
}


