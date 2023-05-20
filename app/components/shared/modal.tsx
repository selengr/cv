import { Dialog } from '@headlessui/react'
import { Dispatch, SetStateAction } from 'react'

interface Props {
    children : React.ReactElement,
    show? : boolean,
    setShow : (() => void) | Dispatch<SetStateAction<boolean>>
}

export default function Modal({ children , setShow , show = true } : Props) {

    return (
        <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            open={show}
            onClose={setShow}
        >
            <div className="text-center">
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-[.4]" />
                <span className="inline-block h-screen align-middle">&#8203;</span>

                <div className={`inline`}>
                    {children}
                </div>
            </div>
        </Dialog>
    )
}