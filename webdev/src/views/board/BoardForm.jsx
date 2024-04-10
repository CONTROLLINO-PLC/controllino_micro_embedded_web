import { useContext, useEffect, useState } from "react"
import { LayoutContext } from "../../layout/layout.context"

function Item({ className, fill, transform }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 0 24 24"
        >
            <path
                fill={fill}
                stroke="#000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="0.25"
                d="M.125.125h13.46v2.27h1.28v-.85l2.55-.99v7.94l-2.55-.99v-.85h-1.28v2.27H.125v-2.35a3.953 3.953 0 000-4.09V.135z"
                transform={transform}
            ></path>
        </svg>
    );
}

export function BoardForm() {
    const { sliders, tmcu } = useContext(LayoutContext)
    const [network0, setNetwork0] = useState(false)

    useEffect(() => {
        setNetwork0(v => !v)
    }, [tmcu]);

    return (
        <div className="relative">
            <img
                className="w-full"
                src="/Board.svg"
                alt="board"
            />
            <div className="absolute inset-0 mt-[93.7%] mb-[51%] mr-[80.6%] ml-[9.9%] flex flex-col justify-between">
                {
                    sliders.map((i, index) => (
                        <div className="w-24 h-[11%]">
                            <Item key={index} className="h-[278%]"
                                fill={`RGB(${128 - i * 0.51}, ${128 + i * 1.27}, ${128 - i * 1.12})`}
                                transform={'rotate(0, 12, 12)'}
                            />
                        </div>

                    ))
                }
            </div>

            <div className="absolute inset-0 mt-[108.95%] mb-[85%] mr-[42.5%] ml-[42.6%] flex justify-between">
                <div id="network0" className={`${network0 ? 'bg-[#fd5608]' : 'bg-[#4DFF10]'} h-full w-[19.5%] rounded-full`} />
                <div id="network0" className={`${!network0 ? 'bg-[#fd5608]' : 'bg-[#4DFF10]'} h-full w-[19.5%] rounded-full`} />
            </div>

            <div className="absolute inset-0 mt-[70.9%] mb-[64.4%] ml-[73.3%] flex flex-col justify-between">
                {
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i, index) => (
                        <div className="w-24 h-[10.8%]">
                            <Item key={index} className="h-[248%]"
                                fill={`grey`}
                                transform={'rotate(180, 12, 12)'}
                            />
                        </div>
                    ))
                }
            </div>
        </div>


    )
}

