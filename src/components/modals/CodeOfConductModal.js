import {getCurrentDate} from "./DateUtills";
import {useContext, useState} from "react";
import AuthContext from "../context/auth-context";
import Modal from "../UI/Modal";
import {DownloadFile} from "../downloadFileService/downLoadFile";

const CodeOfConductModal = (props) => {
   const{updateConductDownloadStatus, currentUser} = useContext(AuthContext)
   const codeOfConductUrl = 'ONLINE DARUL ULOOM ISLAMIC SChool teacher code of conduct Edtd.pdf';

    const closeModal = () => {
        props.closeModal();
    }

    const updateDownloadStatus = async () => {
            await updateConductDownloadStatus({
                variables: {"userId": currentUser.userId, "status":"downloaded"},
            })
    }

    return (
        <Modal onClose={closeModal}>
            <div className="max-w-md mx-auto">
            <div className="w-full max-w-md">
                <form className="bg-white shadow-md rounded p-1 my-1 mb-4">
                    <div className="mb-4 px-4">
                        <div className="max-w-7xl mx-auto py-1 align-center">
                            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-1xl">
                                <span className="block text-blue-600">Please download , read and sign the code of conduct form</span>
                            </h2>
                        </div>
                         <DownloadFile fileUrl={codeOfConductUrl} updateDownLoadStatus={updateDownloadStatus}/>
                    </div>
                </form>
            </div>
        </div>

        </Modal>
    )
}
export default CodeOfConductModal;