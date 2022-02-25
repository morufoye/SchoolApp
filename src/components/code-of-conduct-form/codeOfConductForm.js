import CoverPage from "./coverPage";
import TableOfContent from "./tableOfContent";
import Preface from "./preface";
import Introduction from "./introduction";
import Card from "../UI/Card";
import WhoMustComply from "./whoMustComply";
import PrincipleOfBehavior from "./principleOfBehavior";
import Principles from "./principles";
import StaffCodeOfConduct from "./staffCodeOfConduct";
import AuthContext from "../context/auth-context";
import {useContext, useRef} from "react";

const CodeOfConductForm = (props) => {
    const{updateConductDownloadStatus, currentUser} = useContext(AuthContext)
    const inputRef = useRef();

    const handleSubmit = async () => {
        await updateConductDownloadStatus({
            variables: {"userId": currentUser.userId, "status":"submitted", "fullName": inputRef.current.value},
        })
        props.closeModal();
    }

    return (
       <Card>
        <form className="bg-white shadow-md rounded p-1 my-1 mb-4">
            <CoverPage/>
            <TableOfContent/>
                    <Preface/>
                    <Introduction/>
            <WhoMustComply/>
            <PrincipleOfBehavior/>
            <Principles/>
            <StaffCodeOfConduct  ref={inputRef}/>
            <button
                className="bg-green-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleSubmit}
            >
                Submit
            </button>
        </form>
       </Card>
    )
}
export default CodeOfConductForm;