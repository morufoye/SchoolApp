import {useContext, useEffect, useState} from 'react';
//import classes from './ErrorModal.module.css';
import Modal from "../UI/Modal";
import ChangePassword from "./ChangePassword";
import AuthContext from "../context/auth-context";
import {gql, useQuery} from "@apollo/client";
import * as resolvers from "../service/api";

const SearchUser = (props) => {

    const {getAllUsers, getAllRoles} = useContext(AuthContext);
    let allUsers = [];
    let allRoles = []
    const[allUsersList, setAllUsersList] = useState([{}])
    const[allRolesList, setAllRolesList] = useState([{}])
    const labelClass= "block text-gray-700 text-sm font-bold mb-1 mt-2"
    const inputClass= "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"

     const closeSearchUserModal = () => {
        props.closeSerchUserModal();
     }

     useEffect(async () => {
       const  usersId = await getAllUsers({
             variables: {"username" : "loadAllNamesAndId"},
         });
        for (let i = 0; i < usersId.data.getUsersNameId.length; i++) {
            allUsers.push({"name":usersId.data.getUsersNameId[i].name, "userId":usersId.data.getUsersNameId[i].userId});
        }
         setAllUsersList(allUsers);

         const  allUserRoles = await getAllRoles({
             variables: {"name" : "loadAllRoles"},
         });

         for (let i = 0; i < allUserRoles.data.getAllRoles.length; i++) {
             allRoles.push({"name":allUserRoles.data.getAllRoles[i].name});
         }
         setAllRolesList(allRoles);
     }, [])

    const handleChange=(e)=>{
        //alert(e.target.value);
        // const name = e.target.name;
        // setParent({...parent,
        //     [name]: e.target.value
        // });
    }

    return (
        <>
        <Modal onClose = {closeSearchUserModal}>
            <div className="max-w-md mx-auto">
                <div className="w-full max-w-md">
            <form className="bg-white shadow-md rounded p-1 my-1 mb-4">
                <div className="mb-4 px-4">
                    <div className="max-w-7xl mx-auto py-1 align-center">
                        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            <span className="block text-blue-600">Search User By</span>
                        </h2>
                    </div>

                    <label
                        className={labelClass}
                        htmlFor="role"
                    >
                        Name
                    </label>

                    <select  className={inputClass}   name = "name" onChange={(e)=>handleChange(e)}>
                        <option value=""></option>
                        {allUsersList.map((item) =>
                            <option key={item.userId} value={item.userId}>{item.name} ({item.userId})</option>
                        )}
                    </select>
                    { !props.editUser &&
                        <>
                    <label
                        className={labelClass}
                        htmlFor="role"
                    >
                        Role
                    </label>
                    <select  className={inputClass}  placeholder="select role" name = "role" onChange={(e)=>handleChange(e)}>
                        <option value=""></option>
                        {allRolesList.map((item) =>
                            <option value={item.name}>{item.name}</option>
                        )}
                    </select>
                        </>
                    }

                </div>
            </form>
                </div>
            </div>
        </Modal>
        </>
    );
};

export default SearchUser;