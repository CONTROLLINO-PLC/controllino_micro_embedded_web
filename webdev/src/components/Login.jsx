import { useContext } from "react";
import { LayoutContext } from "../layout/layout.context";
import { Button } from "./Button";

export function Login() {
    const { setLogin } = useContext(LayoutContext)

    const handleOnSubmit = (e) => {
        e.preventDefault()
        const user = e.target[0].value
        const password = e.target[1].value
        setLogin((user === password) && (user === 'admin'))
    }

    return (
        <div className="flex justify-center h-screen items-start pt-12 bg-[#1f1f1f]">
            <div className="flex flex-col justify-center bg-[#2f2f2f] p-8 rounded shadow-md w-96 ring-2 ring-primary">
                <div className="flex justify-center mt-5">
                    <img className="w-10 rounded-full" alt='Logo' src='/favicon.ico' />
                </div>

                <form className="mt-8" onSubmit={handleOnSubmit}>
                    <div className="mb-4">
                        <div className="relative">
                            <input type="text" name="username" className="bg-white/0 peer border-2 py-2 text-lg w-full border-primary text-center text-gray-300 placeholder-transparent focus:outline-none focus:ring-1 focus:ring-primary/40 rounded" placeholder="user*" required />
                            <label className="absolute left-2 -top-5 text-primary text-sm peer-placeholder-shown:text-xs peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-5 transition-all">user*</label>
                        </div>
                    </div>
                    <div className="mt-6">
                        <div className="relative">
                            <input type="password" name="password" className="bg-white/0 peer border-2 py-2 text-lg w-full border-primary text-center text-gray-300 placeholder-transparent focus:outline-none focus:ring-1 focus:ring-primary/40 rounded" placeholder="password*" required />
                            <label className="absolute left-2 -top-5 text-primary text-sm peer-placeholder-shown:text-xs peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-5 transition-all">password*</label>
                        </div>
                    </div>
                    <Button className={'w-full py-1 mt-10'}> Login </Button>
                </form>
            </div>
        </div>

    )
}

