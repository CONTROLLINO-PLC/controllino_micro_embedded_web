import { useEffect } from "react";
import notificationSound from "../audio/notification.mp3";
import { SVG } from "./SVG";
const audio = new Audio(notificationSound);

export function Notification({ notification }) {
    useEffect(() => {
        if (notification)
            audio.play();
    }, [notification])

    if (notification)
        return (
            <div id="alert" className="bg-green-500 ring ring-green-900 py-5 px-4 mt-4 text-xl text-[#052708] font-bold rounded flex gap-10 items-center">
                <SVG select={'notify'} />
                <ul className={'list-disc'}>
                    <li>
                        The action was executed successfully
                    </li>
                </ul>
            </div>
        )
}