import {useContext, useEffect, useState} from 'react';
import Modal from "../UI/Modal";
import AuthContext from "../context/auth-context";
import Card from "../UI/Card";
import {getCurrentDate} from "./DateUtills";

const CreateAssignment = (props) => {
    const {allStudentList, allCourses, currentUser, createAssignmentCommit} = useContext(AuthContext);
    const[courseCodes, setCourseCodes] = useState([]);
    const[toStudent, setToStudent] = useState(false);
    const[toClass, setToClass] = useState(false);
    const labelClass= "block text-gray-700 text-sm font-bold mb-1 mt-2"
    const inputClass= "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    const initData = {assessment_id: props.assessmentId,
        assignedBy:currentUser.name,
        dateDue:"",
        assignedTo:"",
        duration:"",
        courseCode:""
    }
    const[userInput, setUserInput] = useState(initData);
    const handleChange=(e)=>{
        const name = e.target.name;
        setUserInput({...userInput,
            [name]: e.target.value
        });
    }

    useEffect(()=>{
        let holder = [];
        for (let i in allCourses) {
            if (allCourses[i].title === props.title.toUpperCase().trim()) {
                holder.push(allCourses[i].code)
            }
        }
        setCourseCodes(holder);
    }, [])

    const createAssignment = async () => {
       const res = await createAssignmentCommit({
           variables: {userInput},
       })
        closeModal();
    }

    const handleCheckBoxChange=(e)=>{
        let name = e.target.name;
        if (name === 'toStudent') {
            setToStudent(true)
            setToClass(false)
            document.getElementById('toStudent').checked = true;
            document.getElementById('toClass').checked = false;
        }
        if (name === 'toClass') {
            setToStudent(false)
            setToClass(true)
            document.getElementById('toStudent').checked = false;
            document.getElementById('toClass').checked = true;
        }
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
                                  <span className="block text-blue-600">Create Assignment</span>
                                </h2>
                            </div>

                            <table className="min-w-full divide-y divide-gray-200">
                                <tbody className="bg-white divide-y divide-gray-200">
                                <tr><td>Assessment Id:</td><td><span className="font-bold">{props.assessmentId}</span></td></tr>
                                <tr><td>Title:</td><td><span className="font-bold"> {props.title}</span></td></tr>
                                <tr><td>Question By: </td><td><span className="font-bold"> {props.owner}</span></td></tr>
                                </tbody>
                            </table>


                            <label className={labelClass}>Course Code</label>
                            <select  className={inputClass} value={userInput.courseCode} name='courseCode'  onChange={handleChange}>
                                <option value="">select Course code</option>
                                {courseCodes.map(item => <option value={item}>{item}</option>)}
                            </select>


                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>

                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-bold text-gray-500  tracking-wider"
                                    >
                                        Assign to Class
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-bold text-gray-500  tracking-wider"
                                    >
                                       Assign to a Student
                                    </th>

                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">

                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input type="checkbox" id="toClass" name="toClass" value="toClass" onClick={(event) => {handleCheckBoxChange(event)}}/>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input type="checkbox" id="toStudent" name="toStudent" value="toStudent" onClick={(event) => {handleCheckBoxChange(event)}}/>
                                    </td>
                                </tr>
                                </tbody>
                            </table>

                            { toClass &&
                                    <>
                                    <label className={labelClass}>Assign to Class</label>
                                    <select  className={inputClass} value={userInput.assignedTo}  name='assignedTo' onChange={handleChange}>
                                        <option value=""></option>
                                        <option value="class 1">class 1</option>
                                        <option value="class 2">class 2</option>
                                        <option value="class 3">class 3</option>
                                        <option value="class 4">class 4</option>
                                    </select>
                                    </>
                            }

                            { toStudent &&
                            <>
                            <label className={labelClass}>Assign to student</label>
                            <select  className={inputClass} value={userInput.assignedTo} name='assignedTo'  onChange={handleChange}>
                                <option value="">select student name</option>
                                {allStudentList.map(item => <option value={item}>{item}</option>)}
                            </select>
                            </>
                            }

                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dob">
                                Due Date<span className="text-red-600">*</span>
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="dateDue"
                                name="dateDue"
                                type="date"
                                onChange={(e)=>handleChange(e)}
                                value={userInput.dateDue}
                            />

                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dob">
                                Duration<span className="text-red-600">*</span>
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="duration"
                                name="duration"
                                type="text"
                                onChange={(e)=>handleChange(e)}
                                value={userInput.duration}
                                placeholder="HH : MM"
                            />


                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        type="button"
                                        onClick={createAssignment}
                                    >
                                        Submit
                                    </button>
                              </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default CreateAssignment;