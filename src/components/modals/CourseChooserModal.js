import {useContext, useEffect, useState} from "react";
import AuthContext from "../context/auth-context";
import Modal from "../UI/Modal";


const CourseChooserModal = (props) => {
    const{allCourses} = useContext(AuthContext)
    const[title, setTitle] = useState('');
    const[distTitles, setDistTitles] = useState([]);

    useEffect(()=>{
        let holder = [];
        for (let i in allCourses) {
            if ( holder.indexOf(allCourses[i].title) === -1) {
                holder.push(allCourses[i].title);
            }
        }
        setDistTitles(holder);
    }, [])

    const closeModal = () => {
        props.closeModal();
    }

    const handleChange = (e) => {
        setTitle(e.target.value)
    }

    const chooseTitle = () => {
        props.handleTitleChoose(title)
    }

    return (
        <Modal>
            <div className="max-w-md mx-auto">
                <div className="w-full max-w-md">
                    <form className="bg-white shadow-md rounded p-1 my-1 mb-4">
                        <div className="mb-4 px-4">
                            <div className="max-w-7xl mx-auto py-1 align-center">
                                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-1xl">
                                 <span className="block text-blue-600">Choose Course Title</span>
                                </h2>
                            </div>
                            <select name="title" value={title} onChange={(event) => {handleChange(event)}}>
                                <option value="">Select title</option>
                                {distTitles.map((item, index) => <option key={index} value={item}>{item}</option>)}
                            </select>
                        </div>

                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={chooseTitle}
                        >
                            Submit
                        </button>
                        </form>
                </div>
            </div>

        </Modal>
    )
}
export default CourseChooserModal;