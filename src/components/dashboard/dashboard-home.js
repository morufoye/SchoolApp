import React, {Fragment, useContext, useEffect, useState} from 'react'
import { CogIcon, AcademicCapIcon, MusicNoteIcon, DotsHorizontalIcon } from '@heroicons/react/solid'
import Academics from '../academic'
import AuthContext from "../context/auth-context";
import ChangePassword from "../modals/ChangePassword";
import {useDashboard} from "./dashboard-context";
import CreateUser from "../modals/createUser";
import SearchUser from "../modals/searchUser";
import {gql, useQuery} from "@apollo/client";
import EditProfile from "../modals/EditProfile";
import AllUsersList from "../Tables/allUsers";
import AllUsersListMobile from "../Tables/allUsersMobile";
import CreateUserSelectMOdal from "../modals/CreateUserTypeSelectModal";
import Application from "../application";
import {isMobile} from 'react-device-detect';


export default function DashboardHome() {
  const [activeClass, setActiveClass]= useState(0);
  const {roles} = useContext(AuthContext);
  let isSuperAdmin = false;
  const[pwordModal, setPwordModal] = useState(false);
    const[editProfileModal, setEditProfileModal] = useState(false);
    const[searchUserModal, setSearchUserMOdal] = useState(false);
    const[createUserModal, setCreateUserModal] = useState(false);
    const[createUser1Modal, setCreateUser1Modal] = useState(false);
    const[createUser2Modal, setCreateUser2Modal] = useState(false);
    const[editUserModal, setEditUserModal] = useState(false);

    const ALL_USER_NAME_USERID = gql`query {users { name userId }}`;
    const ALL_ROLES = gql`query{roles {name}}`;

    if (roles.indexOf("SUPER-ADMIN") !== -1) {
        isSuperAdmin = true;
    }
  const links = [{name: "Academics", icon: AcademicCapIcon},
                 {name: "Edit Profile", icon: MusicNoteIcon},
                 {name: "Change Password", icon: MusicNoteIcon}
    ]

    if (isSuperAdmin) {
        links.push({name : "Search", icon : AcademicCapIcon});
        links.push({name : "Create User", icon : AcademicCapIcon});
        links.push({name : "Edit User", icon : AcademicCapIcon});
    }
    links.push({name : "Others", icon : AcademicCapIcon});

const buttonClass= `block w-full px-4 py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-pink-500 border-b-2 border-gray-800 md:border-gray-900 hover:border-pink-500`

const getActiveClass =(index)=>{
  return activeClass === index? buttonClass + " bg-gray-600": buttonClass
}

const selectUserType = (userType) => {
    if (userType === 'teachers_admins') {
        setCreateUser1Modal(true);
        setCreateUser2Modal(false);
        setCreateUserModal(false);
    }
    if (userType === 'parents_students') {
        setCreateUser2Modal(true);
        setCreateUser1Modal(false)
        setCreateUserModal(false);
    }
}

const refreshList = () => {
    setEditUserModal(false);
    setTimeout(()=>{setEditUserModal(true)}, 200)
}


    return (
      <Fragment> {
    <div className="flex md:flex-row-reverse flex-wrap md:h-screen">

        { createUser1Modal ?
        <div className="w-full md:w-4/5 bg-gray-100 sm:h-screen  md:mt-4">
            <div className=" p-3">
            <CreateUser closeCreatUserModal={() => setCreateUser1Modal(false)}/>
            </div>
            </div> : <></>}
        { createUser2Modal ?
            <Application/>
            :
         <>
             { editProfileModal ?
           <div className="w-full md:w-4/5 bg-gray-100 sm:h-screen  md:mt-4">
            <div className=" p-3">
                <EditProfile closeEditUserModal={() => setEditProfileModal(false)}/>
            </div>
            </div> :
                 <>
            { editUserModal ? <
                div className="w-full md:w-4/5 bg-gray-100 sm:h-screen  md:mt-4">
                    <div className=" p-3">
                        {isMobile ? <AllUsersListMobile /> : <AllUsersList refreshList={refreshList}/>}
                    </div>
                </div> :
              <div className="w-full md:w-4/5 bg-gray-100 sm:h-screen  md:mt-4">
                    <div className=" p-3">
                        {activeClass === 0 && <Academics/>}
                    </div>
                </div>
            }
            </>
            }
         </>
        }

        <div
            className="w-full md:w-1/5 bg-gray-900 md:bg-gray-900 px-2 text-center sm:bottom-0 md:pt-8 md:top-20 md:left-0 h-16 md:h-screen sm:fixed md:border-r-4 md:border-gray-600">
            <div className="md:relative mx-auto lg:px-6">
                <ul className="list-reset flex flex-row md:flex-col text-center md:text-left p-1">
                    {links.map((link, index) =>
                        <li className="mr-3 flex-1" key={index}>
                            <button
                                className={getActiveClass(index)}
                                onClick={ () =>  {
                                    if (index === 1) {
                                        setEditProfileModal(true);
                                        setEditUserModal(false);
                                    } else if (index === 2){
                                        setPwordModal(true);
                                        setEditUserModal(false);
                                    } else if ( index === 3) {
                                        setSearchUserMOdal(true);
                                        setEditUserModal(false);
                                    } else if (index === 4) {
                                        setCreateUserModal(true);
                                        setEditUserModal(false);
                                    }else if (index === 5) {
                                        setEditUserModal(true);
                                    }
                                    else {
                                        setEditProfileModal(false);
                                        setActiveClass(index);
                                    }
                                }}
                            >
                                <link.icon className="h-5 w-5 md:hidden " aria-hidden="true"/>
                                <span
                                    className="hidden md:show pb-1 md:pb-0 text-lg md:text-base text-gray-600 md:text-white block md:inline-block">{link.name}</span>
                            </button>
                        </li>
                    )}

                </ul>
            </div>
        </div>
    </div>
      }

          { pwordModal && <ChangePassword closePwordModal={() => setPwordModal(false)}/>}
          { searchUserModal && <SearchUser closeSerchUserModal={() => setSearchUserMOdal(false)} editUser={false}/>}
          { createUserModal && <CreateUserSelectMOdal selectUserType={selectUserType} closeCreatUserModal={() => setCreateUserModal(false)}/>}

       </Fragment>
  )
}