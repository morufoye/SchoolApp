import {useContext, useEffect, useState} from 'react';
import Modal from "../UI/Modal";
import AuthContext from "../context/auth-context";

const CreateUserSelectMOdal = (props) => {


    const labelClass= "block text-gray-700 text-sm font-bold mb-1 mt-2"
    const inputClass= "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"

    const closeCreatUserModal = () => {
        props.closeCreatUserModal();
    }

    const handleChange=(e)=>{
        props.selectUserType(e.target.value)
    }

    return (
        <>
            <Modal onClose = {closeCreatUserModal}>
                <div className="max-w-md mx-auto">
                    <div className="w-full max-w-md">
                        <form className="bg-white shadow-md rounded p-1 my-1 mb-4">
                            <div className="mb-4 px-4">
                                <div className="max-w-7xl mx-auto py-1 align-center">
                                    <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                        <span className="block text-blue-600">User Type</span>
                                    </h2>
                                </div>

                                    <label
                                        className={labelClass}
                                        htmlFor="role"
                                    >
                                        User Type
                                    </label>
                                    <select  className={inputClass}  name = "userType" onChange={(e)=>handleChange(e)}>
                                        <option value="">Select User Type</option>
                                        <option value="parents_students">Parents and Students</option>
                                        <option value="teachers_admins">Teachers and Administrators</option>
                                    </select>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default CreateUserSelectMOdal;