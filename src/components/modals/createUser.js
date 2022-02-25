import React, {useContext, useState} from 'react';
//import classes from './ErrorModal.module.css';
import Modal from "../UI/Modal";
import ChangePassword from "./ChangePassword";
import AuthContext from "../context/auth-context";

const CreateUser = (props) => {
   const{registerParent} = useContext(AuthContext);
    const initData = {name:props.userData.name,  mobileNumber:props.userData.phone, email:props.userData.email, address:props.userData.address, role: "", "gender":""}
    const roles = ["student", "parent", "teacher", "admin"]
    const [user, setUser]=useState(initData)
    const[summary, setSummary] = useState([]);
    let regSummary = [];
    let createResponse = {};
    const[showResponse, setShowResponse] = useState(false);

    const  createNewUser =  async(event) => {

             event.preventDefault();
        console.log('......... user ....' + JSON.stringify(user))
             const userInput = user;
        console.log('........ userInput..... ' + JSON.stringify(userInput))
             createResponse =     await registerParent({
             variables: {userInput},
        });
        regSummary.push({ "name" : createResponse.data.registerParent.user.name, "id" : createResponse.data.registerParent.user.userId, "role":createResponse.data.registerParent.user.role});
        setShowResponse(true);
        setSummary(regSummary);
        //
    }

    const closeModal = () => {
        props.closeCreatUserModal();
    }

    const labelClass= "block text-gray-700 text-sm font-bold mb-1 mt-2"
    const inputClass= "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"


    const handleChange=(e)=>{
        const name = e.target.name;
        setUser({...user,
            [name]: e.target.value
        });
    }

    const formData = [
        {name: "name", label: "Name", placeholder: "Enter fullname", id:"parentFullname", value:user.name,  type:"text",  tag:"input"},
        {name: "mobileNumber", label: "Phone number", placeholder: "Enter mobile number", id:"parentFullname", value:user.mobileNumber, type:"text",  tag:"input"},
        {name: "email", label: "Email", placeholder: "Enter email", type:"email",  value:user.email, id:"email",  tag:"input"},
        {name: "address", label: "Address", placeholder: "Enter address", id:"address", type:"textarea", value:user.address, tag:"textarea"},

    ]

    const handleCheckBoxChange=(e)=>{
        let name = e.target.name;
        let value = e.target.value;
        setUser({...user,
            [name]: e.target.value
        });
        if (value === 'male') {
            document.getElementById('female').checked = false;
            document.getElementById('male').checked = true;
        }
        if (value === 'female') {
            document.getElementById('male').checked = false;
            document.getElementById('female').checked = true;
        }
    }

return (
    <div className="max-w-md mx-auto">
     <div className="w-full max-w-md">
         { !showResponse ?
        <form className="bg-white shadow-md rounded p-1 my-1 mb-4" onSubmit={createNewUser}>
            <div className="mb-4 px-4">
                <div className="max-w-7xl mx-auto py-1 align-center">
                    <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        <span className="block text-blue-600">New User </span>
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
                <label
                    className={labelClass}
                    htmlFor="role"
                >
                    Select Role<span className="text-red-600">*</span>
                </label>
                <select  className={inputClass}  value={user.role}  name = "role" onChange={(e)=>handleChange(e)}>
                    <option value=""></option>
                    <option value="teacher">TEACHER</option>
                    <option value="admin">ADMIN</option>
                </select>


                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500  tracking-wider" >
                                Male
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500  tracking-wider" >
                               Female
                            </th>

                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <input type="checkbox" id="male" name="gender" value="male" onClick={(event) => {handleCheckBoxChange(event)}}/>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                            <input type="checkbox" id="female" name="gender" value="female" onClick={(event) => {handleCheckBoxChange(event)}}/>
                        </td>
                        </tr>
                    </tbody>
                </table>

                {/*<label*/}
                {/*    className={labelClass}*/}
                {/*    htmlFor="role"*/}
                {/*>*/}
                {/*    Select Gender<span className="text-red-600">*</span>*/}
                {/*</label>*/}
                {/*<select  className={inputClass}  value={user.gender}  name = "gender" onChange={(e)=>handleChange(e)}>*/}
                {/*    <option value=""></option>*/}
                {/*    <option value="M">MALE</option>*/}
                {/*    <option value="F">FEMALE</option>*/}
                {/*</select>*/}
                {
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Create User
                    </button>
                }
            </div>
        </form>
          :
             <Modal onClose={closeModal}>
        <div className=" p-4 w-full items-center bg-white shadow-md border border-gray-200 rounded-lg mb-2">
            <p>Below is the registration summary</p>
            <span onClick={() => {props.closeModal()}}>Close</span>
            <table>
                <thead className="font-extrabold tracking-tight text-gray-900 mb-3" >
                <tr><th>Name</th><th>User Id</th><th>Role</th></tr>
                </thead>
                <tbody>
                {summary.map((summary) =>(<tr key={summary.id}>
                    <td>{summary.name}</td><td className="font-extrabold">{summary.id}</td><td>{summary.role}</td>
                </tr>))
                }
                </tbody>
            </table>
        </div>
             </Modal>
         }
        </div>
    </div>
    );
    };

export default CreateUser;