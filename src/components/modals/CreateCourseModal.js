import {getCurrentDate} from "./DateUtills";
import {useContext, useState} from "react";
import AuthContext from "../context/auth-context";
import Modal from "../UI/Modal";

const CreateCourseModal = (props) => {

    let initData = {"title":"", "code":"", "description":""}
    const[userInput, setUserInput] = useState(initData);
    const{createCourseCommit} = useContext(AuthContext)
    const labelClass= "block text-gray-700 text-sm font-bold mb-1 mt-2"
    const inputClass= "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"

    const formData = [
        {name: "title", label: "Course Title", id:"title", type:"text", value: userInput.title , tag:"input"},
        {name: "code", label: "Course Code", id:"code", type:"text", value: userInput.code, tag:"input"},
        {name: "description", label: "Description", id:"description", type:"textarea", value: userInput.description, tag:"input"}
    ]

    const handleChange=(e)=>{
        const name = e.target.name;
        setUserInput({...userInput,
            [name]: e.target.value
        });
    }

    const createCourse = async () => {
     const res = await createCourseCommit({
         variables: {userInput},
     })
        closeModal();
    }

    const closeModal = () => {
         props.closeModal();
    }

    return (
        <Modal onClose={closeModal}>
            <div className="max-w-md mx-auto">
                <div className="w-full max-w-md">
                    <form className="bg-white shadow-md rounded p-1 my-1 mb-4">
                        <div className="mb-4 px-4">
                            <div className="max-w-7xl mx-auto py-1 align-center">
                                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-1xl">
                                    <span className="block text-blue-600">Create Course</span>
                               </h2>
                            </div>
                            {formData.map(data =>
                                <div key={data.name}>
                                    <label
                                        className={labelClass}
                                        htmlFor={data.id}
                                    >
                                        {data.label}<span className="text-red-600">*</span>
                                    </label>
                                    <data.tag
                                        name={data.name}
                                        onChange={(e)=>handleChange(e)}
                                        className={inputClass}
                                        id={data.id}
                                        type={data.type}
                                        placeholder={data.placeholder}
                                        value={data.value}
                                    />
                                </div>
                            )}

                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={createCourse}
                            >
                                Submit
                            </button>

                        </div>
                        </form>
                </div>
            </div>

        </Modal>
    )
}
export default CreateCourseModal;