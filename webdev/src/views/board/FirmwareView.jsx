import { useEffect, useState, useRef, useContext } from "react";
import { Button, SVG } from "../../components";
import { LayoutContext } from "../../layout/layout.context";

function Current(props) {
    const input = useRef(null);
    const [upload, setUpload] = useState(null); // Upload promise
    const [statusUploading, setStatusUploading] = useState("Upload firmware information status:");   // Current upload status
    const btn = useRef(null);
    const { setNotification } = useContext(LayoutContext)

    const onclick = function (ev) {
        let fn; setUpload(x => fn = x);
        if (!fn) input.current.click();  // No upload in progress, show file dialog
        return fn;
    };

    const onupload = function (ok, name, size) {
        if (!ok) return false;
        setNotification(true)
        setTimeout(() => {
            setNotification(false)
        }, 1000);
    };

    // Send a large file chunk by chunk
    const sendFileData = function (url, fileName, fileData, chunkSize) {
        return new Promise(function (resolve, reject) {
            const finish = ok => {
                setUpload(null);
                const res = onupload ? onupload(ok, fileName, fileData.length) : null;
                if (res && typeof (res.catch) === "function") {
                    res.catch(() => false).then(() => ok ? resolve() : reject());
                } else {
                    ok ? resolve() : reject();
                }
            };
            const sendChunk = function (offset) {
                var chunk = fileData.subarray(offset, offset + chunkSize) || "";
                var opts = { method: "POST", body: chunk };
                var fullUrl = url + "?offset=" + offset +
                    "&total=" + fileData.length +
                    "&name=" + encodeURIComponent(fileName);
                var ok;
                setStatusUploading("Uploading " + fileName + ", bytes " + offset + ".." +
                    (offset + chunk.length) + " of " + fileData.length);
                fetch(fullUrl, opts)
                    .then(function (res) {
                        if (res.ok && chunk.length > 0) sendChunk(offset + chunk.length);
                        ok = res.ok;
                        return res.text();
                    })
                    .then(function (text) {
                        if (!ok) setStatusUploading("Error: " + text), finish(ok); // Fail
                        if (chunk.length > 0) return; // More chunks to send
                        setStatusUploading(x => x + ". Done !!!");
                        finish(ok); // All chunks sent
                    });
            };
            sendChunk(0);
        });
    };

    const onchange = function (ev) {
        if (!ev.target.files[0]) return;
        let r = new FileReader(), f = ev.target.files[0];
        r.readAsArrayBuffer(f);
        r.onload = function () {
            setUpload(sendFileData(`http://${import.meta.env.VITE_IP}:${import.meta.env.VITE_PORT}/api/firmware/upload`, f.name, new Uint8Array(r.result), 2048));
            ev.target.value = "";
            ev.preventDefault();
            if (btn.current) btn.current.click();
        };
    };
    return (
        <div className="flex flex-col h-full bg-[#3c3d3c] text-slate-300 rounded border-2 border-gray-500 gap-4">
            <div className="border-b border-gray-500 uppercase mx-1 font-extrabold text-lg" >
                current firmware image
            </div>
            <div className="flex flex-col justify-center gap-1 font-semibold text-slate-200 mx-2">
                <p> {`Status: ${props.status}`} </p>
                <p> {`CRC32: ${props.crc32}`} </p>
                <p> {`Size: ${props.size}`} </p>
                <p> {`Flached at: ${props.flached}`} </p>
            </div>
            <div className="flex flex-col justify-start gap-4 mx-1 my-4 upercase">
                <div className="grid grid-cols-2 gap-4">
                    <Button onClick={props.oncommit} className="rounded-md text-xs">
                        <div className="flex justify-center items-center gap-4 mx-2">
                            <p>COMMIT THIS FIRMWARE</p>
                            <SVG select={"commit"} />
                        </div>
                    </Button>
                    <Button onClick={props.reboot} className="rounded-md text-xs">
                        <div className="flex justify-center items-center gap-4 mx-2">
                            <p>REBOOT DEVICE</p>
                            <SVG select={"reboot"} />
                        </div>
                    </Button>
                </div>

                <div className="inline-flex flex-col gap-2 text-slate-200">
                    <input className="hidden" type="file" ref={input} onChange={onchange} accept="*" />
                    <Button onClick={() => onclick()} className="rounded-md text-xs">
                        <div className="flex justify-center items-center gap-4 mx-2">
                            <p>UPLOAD NEW FIRMWARE CHOOSE .bin FILE</p>
                            <SVG select={"upload"} />
                        </div>
                    </Button>
                    <p className="mx-2">
                        {statusUploading}
                    </p>
                </div>
            </div>
        </div>
    )
}
function Previous(props) {
    return (
        <div className="flex flex-col h-full bg-[#3c3d3c] text-slate-300 rounded border-2 border-gray-500 gap-5">
            <div className="border-b border-gray-500 uppercase mx-1 font-extrabold text-lg" >
                PREVIOUS firmware image
            </div>
            <div className="flex flex-col justify-start gap-1 mx-2 font-semibold text-slate-200">
                <p> {`Status: ${props.status}`} </p>
                <p> {`CRC32: ${props.crc32}`} </p>
                <p> {`Size: ${props.size}`} </p>
                <p> {`Flached at: ${props.flached}`} </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mx-1 my-12" >
                <Button onClick={props.rollback} className="rounded-md text-xs mt-4">
                    <div className="flex justify-center items-center gap-4 mx-2">
                        <p>ROLLBACK TO THIS FIRMWARE</p>
                        <SVG select={"rollback"} />
                    </div>
                </Button>
            </div>
        </div>
    )
}
export function FirmwareView() {
    if (document.getElementById("alert"))
        document.getElementById("alert").style.display = "none";
    const [status, setStatus] = useState("");
    const [crc32, setCrc32] = useState("");
    const [size, setSize] = useState("");
    const [flached, setFlached] = useState("");
    const [status_2, setStatus_2] = useState("");
    const [crc32_2, setCrc32_2] = useState("");
    const [size_2, setSize_2] = useState("");
    const [flached_2, setFlached_2] = useState("");
    const status_array = ["MG_OTA_UNAVAILABLE", "MG_OTA_FIRST_BOOT", "MG_OTA_UNCOMMITTED", "MG_OTA_COMMITTED"];
    const { setNotification } = useContext(LayoutContext)

    const onstatus = ev => fetch(`http://${import.meta.env.VITE_IP}:${import.meta.env.VITE_PORT}/api/firmware/status`)
        .then(r => r.json())
        .then(r => {
            r.forEach((item, index) => {
                if (index === 0) {
                    setStatus(status_array[item.status]);
                    setCrc32(item.crc32);
                    setSize(item.size);
                    setFlached(item.timestamp);
                } else {
                    setStatus_2(status_array[item.status]);
                    setCrc32_2(item.crc32);
                    setSize_2(item.size);
                    setFlached_2(item.timestamp);
                }
            });
        });

    const oncommit = ev => fetch(`http://${import.meta.env.VITE_IP}:${import.meta.env.VITE_PORT}/api/firmware/commit`)
        .then(r => r.json())
        .then(() => {
            setNotification(true)
            setTimeout(() => {
                setNotification(false)
            }, 1000);
        })
        .then(onstatus)

    const onreboot = ev => fetch(`http://${import.meta.env.VITE_IP}:${import.meta.env.VITE_PORT}/api/device/reset`)
        .then(r => r.json())
        .then(() => {
            setTimeout(() => {
                onstatus()
                window.location.reload();
            }, 1000);
        })
        .catch(error => console.error("Error:", error));

    const onrollback = ev => fetch(`http://${import.meta.env.VITE_IP}:${import.meta.env.VITE_PORT}/api/firmware/rollback`)
        .then(r => r.json())
        .then(() => {
            setNotification(true)
            setTimeout(() => {
                setNotification(false)
            }, 1000);
        })
        .then(onreboot)

    useEffect(() => {
        onstatus();
    }, []);

    return (
        <div className="grid grid-cols-2 mt-5 gap-8 container mx-auto">
            <div className="h-full col-span-2 md:col-span-1">
                <Current
                    status={status}
                    crc32={crc32}
                    size={size}
                    flached={flached}
                    oncommit={() => oncommit()}
                    reboot={() => onreboot()}
                />
            </div>

            <div className="h-full col-span-2 md:col-span-1">
                <Previous
                    status={status_2}
                    crc32={crc32_2}
                    size={size_2}
                    flached={flached_2}
                    rollback={() => onrollback()}
                />
            </div>

        </div>
    );
}


