import React, {Fragment, useContext, useEffect, useMemo, useRef, useState} from 'react'
import {Link, Route, useNavigate} from "react-router-dom";
import AuthContext from "../context/auth-context";
import AllUsersList from "../Tables/allUsers";
import AssignmentList from "../Tables/Assigments";
import QuestionMaker from "../Question-Maker";
import StudentAssignmentList from "../Tables/StudentAssignmentList";
import Popover from "@material-tailwind/react/Popover";
import PopoverContainer from "@material-tailwind/react/PopoverContainer";
import PopoverBody from "@material-tailwind/react/PopoverBody";
import CreateCourseModal from "../modals/CreateCourseModal";
import AllCourses from "../Tables/AllCourses";
import AllJobApplicants from "../Tables/AllJobApplicants";
import CodeOfConductModal from "../modals/CodeOfConductModal";
import CodeOfConductForm from "../code-of-conduct-form/codeOfConductForm";
import {useMutation} from "@apollo/client";
import * as resolvers from "../service/api";
import AllSubmittedAssignments from "../Tables/AllSubmittedAssignments";

export const ManageCourses = (props) => {
    const buttonRef = useRef();
    const displayModal = () => {
        props.displayModal();
    }
    const displayTable = () => {
        props.displayTable();
    }
    return (
        <>
            <button color="black" ref={buttonRef} ripple="light">
                Manage Courses
            </button>
            <Popover placement="bottom" ref={buttonRef}>
                <PopoverContainer>
                    <PopoverBody>
                        <>
                            <p><span onClick={() => {displayModal()}}>Create Course</span></p>
                            <p><span onClick={() => {displayTable()}}>Assign/Modify Courses</span></p>
                        </>
                    </PopoverBody>
                </PopoverContainer>
            </Popover>
        </>
    )
}

export const ManageAssignments = (props) => {
    const buttonRef = useRef();
    const displayCreateAssignmentTable = () => {
        props.displayCreateAssignmentTable();
    }
    const disPlayAllSubmittedAssignmentTable = () => {
        props.disPlayAllSubmittedAssignmentTable();
    }
    return (
        <>
            <button color="black" ref={buttonRef} ripple="light">
                Assignments
            </button>
            <Popover placement="bottom" ref={buttonRef}>
                <PopoverContainer>
                    <PopoverBody>
                        <>
                            <p><span onClick={() => {displayCreateAssignmentTable()}}>Create Assignment</span></p>
                            <p><span onClick={() => {disPlayAllSubmittedAssignmentTable()}}>View All Submitted Assignments</span></p>
                        </>
                    </PopoverBody>
                </PopoverContainer>
            </Popover>
        </>
    )
}


export default function Academics(){
    const {roles} = useContext(AuthContext);
    const[showQuestionBuilder, setShowQuestionBuilder] = useState(false);
    const[showHomeWorkModal, setShowHomeWorkModal] = useState(false);
    const[displayCreateCourseModal, setDisplayCreateCourseModal] = useState(false);
    const[displayStudentAssignment, setDisplayStudentAsssignment] = useState(false);
    const[displayCourses, setDisplayCourses] = useState(false);
    const[showJobApplications, setShowJobApplications] = useState(false);
    const[showCodeOfConductFormModal, setSetShowCodeOfConductForm] = useState(true)
    const[showAllSubmittedAssignments, setShowAllSubmittedAssignments] = useState(false)

    console.log('this user roles are ' + roles.map(role => role));

     let isTeacher = false;
     let isParent = false;
     let isStudent = false;
     let isSuperAdmin = false;
     let showCodeOfConductForm = false;



    if (roles.indexOf("teacher") !== -1) {
        isTeacher = true;
    }
    if (roles.indexOf("SUPER-ADMIN") !== -1) {
        isSuperAdmin = true;
    }
    if (roles.indexOf("parent") !== -1) {
        isParent = true;
    }
    if (roles.indexOf("student") !== -1) {
        isStudent = true;
    }

    if(roles.indexOf("not submitted") !== -1)  {
        showCodeOfConductForm = true;
    }

    const navigate = useNavigate();
    const navToQuestionBuilder = () => {
        setShowQuestionBuilder(true);
    }

    const hideCodeOfConduct = () => {
        showCodeOfConductForm = false;
        setSetShowCodeOfConductForm(false)
    }

    const myAssignments = () => {
        setDisplayStudentAsssignment(true)
    }

    const handleSetDisplayCourseCreate = () => {
        setDisplayCreateCourseModal(true)
    }

    const handleDisplayTable = () => {
        setDisplayCourses(true)
    }

    const navToEduGameTools = () => {
    }

    const closeBuilder = () => {
        setShowQuestionBuilder(false);
    }

    const refreshList = () => {
        setDisplayStudentAsssignment(false);
        setTimeout(()=>{setDisplayStudentAsssignment(true)}, 200)
    }

    return (
        <Fragment>
        <div className="flex flex-wrap justify-center">
        {  isStudent &&
            <>
                <div className="p-3 w-lg m-2 bg-blue-400 align-middle text-center rounded-xl">
                    Classes
                </div>

                <button className="p-3 w-lg m-2 bg-blue-400 text-center rounded-xl"
                        onClick={myAssignments}
                >
                    Assignments
                </button>

            <div className="p-3 w-lg m-2 bg-blue-400 text-center rounded-xl">
            My Courses
            </div>

                <div className="p-3 w-lg m-2 bg-blue-400 text-center rounded-xl">
                    My Results
                </div>

                <button className="p-3 w-lg m-2 bg-blue-400 text-center rounded-xl"
                        onClick={navToEduGameTools}
                >
                    Edu Game Tools
                </button>
            </>
        }

        { isTeacher &&
            <>
            <div className="p-3 w-lg m-2 bg-green-400 text-center rounded-xl">
                Students
            </div>

                <div className="p-3 w-lg m-2 bg-green-400 text-center rounded-xl">
                    Teachers
                </div>

                <button className="p-3 w-lg m-2 bg-blue-400 text-center rounded-xl"
                        onClick={navToQuestionBuilder}
                >
                    Build Questions
                </button>

                <div className="p-3 w-lg m-2 bg-blue-400 text-center rounded-xl">
                    <ManageAssignments displayCreateAssignmentTable={() => setShowHomeWorkModal(true)} disPlayAllSubmittedAssignmentTable={()=>{setShowAllSubmittedAssignments(true)}}/>
                </div>
            </>
        }
        {
            isParent &&
                <>
        <div className="p-3 w-lg m-2 bg-blue-400 text-center rounded-xl">
            Payments
        </div>

                    <div className="p-3 w-lg m-2 bg-blue-400 text-center rounded-xl">
                        Results
                    </div>


                    <div className="p-3 w-lg m-2 bg-blue-400 text-center rounded-xl">
                        Meetings
                    </div>
                </>
        }

            {
                isSuperAdmin &&
                <>
                    <div className="p-3 w-lg m-2 bg-blue-400 text-center rounded-xl">
                      <ManageCourses displayModal={handleSetDisplayCourseCreate} displayTable={handleDisplayTable}/>
                    </div>

                    <button className="p-3 w-lg m-2 bg-blue-400 text-center rounded-xl"
                            onClick={() => setShowJobApplications(true)}
                    >
                        Job Applications
                    </button>

                </>
            }

    </div>
            { showQuestionBuilder &&
            <div className="flex flex-wrap justify-center">
            <QuestionMaker closeQuestionBuilder={closeBuilder}/>
            </div>
            }
            {  showHomeWorkModal  &&
            <div className=" container mx-auto py-4">
                <AssignmentList closeModal={() =>setShowHomeWorkModal(false)} isTeacher={isTeacher}/>
            </div>

            }

            { displayStudentAssignment && isStudent &&
            <div className=" container mx-auto py-4">
                <StudentAssignmentList closeModal={() =>setShowHomeWorkModal(false)} isTeacher={isTeacher} refreshList={refreshList}/>
            </div>
            }
            { displayCreateCourseModal &&
            <div className=" container mx-auto py-4">
                <CreateCourseModal closeModal={() =>setDisplayCreateCourseModal(false)}/>
            </div>
            }

            { displayCourses &&
            <div className=" container mx-auto py-4">
                <AllCourses closeTable={() =>setDisplayCourses(false)}/>
            </div>
            }

            {
                showJobApplications &&
                <div className=" container mx-auto py-4">
                    <AllJobApplicants closeTable={() =>setShowJobApplications(false)}/>
                </div>
            }

            {
                showCodeOfConductForm && showCodeOfConductFormModal &&
                <div className=" container mx-auto py-4">
                <CodeOfConductForm closeModal={hideCodeOfConduct}/>
                </div>
            }

            {
                showAllSubmittedAssignments &&
                <div className=" container mx-auto py-4">
                    <AllSubmittedAssignments closeTable={() =>setShowAllSubmittedAssignments(false)}/>
                </div>
            }

        </Fragment>
    )
}