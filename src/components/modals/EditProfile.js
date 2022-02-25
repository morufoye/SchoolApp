import {useContext, useEffect, useState} from 'react';
//import classes from './ErrorModal.module.css';
import Modal from "../UI/Modal";
import ChangePassword from "./ChangePassword";
import AuthContext from "../context/auth-context";
import Draggable from 'react-draggable';
import Card from "../UI/Card";

const CreateUser = (props) => {
    const {currentUser, roles} = useContext(AuthContext)

    const  submitChanges = (event) => {
        event.preventDefault();
        props.closeEditUserModal();
    }

    const labelClass= "block text-gray-700 text-sm font-bold mb-1 mt-2"
    const inputClass= "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"


    const handleChange=(e)=>{
        // const name = e.target.name;
        //         // setParent({...parent,
        //         //     [name]: e.target.value
        //         // });
    }


    const formData = [
        {name: "name", label: "Name", id:"name", type:"text", value: currentUser.name, tag:"input"},
        {name: "mobileNumber", label: "Phone number",  id:"mobileNumber", type:"text", value: currentUser.mobileNumber, tag:"input"},
        {name: "email", label: "Email",  type:"email", id:"email", value: currentUser.email, tag:"input"},
        {name: "address", label: "Address",  id:"address", type:"textarea", value: currentUser.address, tag:"textarea"},
    ]

    return (

           <Card>
               <div className="max-w-md mx-auto">
               <div className="w-full max-w-md">
            <form className="bg-white shadow-md rounded p-1 my-1 mb-4">
                <div className="mb-4 px-4">
                    <div className="max-w-7xl mx-auto py-1 align-center">
                        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            <span className="block text-blue-600">Edit Profile </span>
                        </h2>
                    </div>

                    <label  className={labelClass}>User Id</label>
                    <input type="text" value={currentUser.userId}  className={inputClass} readOnly={true}/>

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
                    <label className={labelClass}> Roles</label>
                    {roles.map((item)=><li key={item}>{item}</li>)}
                    {
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={submitChanges}
                        >
                            Submit
                        </button>
                    }

                </div>
            </form>
               </div>
               </div>
           </Card>
    );
};

export default CreateUser;