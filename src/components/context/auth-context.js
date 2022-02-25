import React, { useState, useEffect, useCallback } from 'react';
import {gql, useMutation, useQuery} from "@apollo/client";
import * as resolvers from "../service/api";
import axios from "axios";
import {GET_ANSWER_DETAIL, GET_DOWNLOAD_STATUS, REGISTER_JOB_APPLICANT, UPDATE_DOWNLOAD_STATUS} from "../service/api";

let logoutTimer;



const AuthContext = React.createContext({
  token: '',
  authError: '',
  successMessage: '',
  currentUser: null,
  isLoggedIn: false,
  logout: () => {},
  resetAuthError: () => {},
});



const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  return adjExpirationTime - currentTime;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const currentUser = localStorage.getItem('currentUser');
  const storedExpirationDate = localStorage.getItem('expirationTime');

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 3600) {
    console.log("removing from local storage")
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('expirationTime');
    return null;
  }

  return {
    token: storedToken,
    currentUser,
    duration: remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  
  let initialToken;
  let initialUser;
  if (tokenData) {
    initialToken = tokenData.token;
    initialUser = tokenData.currentUser;
  }

  const [token, setToken] = useState(initialToken);
  const [user, setUser] = useState(initialUser);
  const [authError, setAuthError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const[isAuthenticated, setIsAuthenticated] = useState(false);
  const[roles, setRoles] = useState([]);
  const[welcomeName, setWelcomeName] = useState('');
  const[regDetail, setRegDetails] = useState([]);
  let allUsers = [];
  const[allUserList, setAllUsersList] = useState([{}]);
  let userRoles = [];
    const[questionArchive, setQuestionArchive] = useState([]);
  let allStudents = [];
  const[allStudentList, setAllStudentList] =  useState([]);
  const[studentAssignments, setStudentAssignments] = useState([]);
  const[allSubmittedAssignment, setAllSubmittedAssignment] = useState([]);
  const[allCourses, setAllCourses] = useState([]);
  const[uploadedFileUrl, setUploadedFileUrl] = useState('');
  const[allJobApplicants, setAllJobApplicants] = useState([]);
  const[codeOfConductModal, setCodeOfConductModal] = useState(true);
  let userIsLoggedIn = false;

  const logoutHandler = useCallback(() => {

    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('expirationTime');
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);



  // NEW CODE HERE

  // Login User
  const [login] = useMutation(
      resolvers.LOGIN,
      {
        onError: (requestError) => {
          console.log("requestError?.message==>", requestError?.message)
          setAuthError(requestError?.message ?? 'Unknown Error.')
        },
        onCompleted: async (loginResponse) => {
          if (loginResponse?.login) {
              let {user: loadedUser, accessToken, expiresIn} = loginResponse?.login;
              console.log("expiresIn", expiresIn)
              if ('Y' === loadedUser.active) {
                  if (loadedUser) {
                      setIsAuthenticated(true);
                  }

                  const expirationTime = new Date(
                      new Date().getTime() + 4000 * 1000
                  );
                  setToken(accessToken);
                  localStorage.setItem('token', accessToken);
                  localStorage.setItem('currentUser', {...loadedUser});
                  localStorage.setItem('expirationTime', expirationTime.toISOString());
                  console.log("accessToken==>", accessToken)
                  console.log("loadedUser==>", loadedUser)

                  setUser({...loadedUser})
                  //setUser(user)
                  console.log("Current user  in body", user?.name)
                  console.log("loadedUser role roles", loadedUser.linked_roles.roles.map(item => userRoles.push(item)));
                  setWelcomeName(loadedUser.name);
                  setRoles(userRoles);


                  if ('teacher' === loadedUser.role) {
                      const res = await getDownLoadStatus({
                          variables: {"userId": loadedUser.userId},
                      })
                      if (res) {
                          if ('not submitted' === res.data.getDownLoadStatus.form_status) {
                              userRoles.push('not submitted')
                          }
                      }

                      let resHolder = [];
                      const allSubAssignments = await loadSubmittedAssignmentsForTeacher({
                          variables: {assignedBy : loadedUser.name}
                      })
                      //console.log(' >>>>>> >>>> all submitted assignment >>>>>>  ', JSON.stringify(allSubAssignments))
                      if (allSubAssignments) {
                          for(let i = 0; i < allSubAssignments.data.loadSubmittedAssignmentsForTeacher.length; i++){
                              resHolder.push({
                                  assignment_id:allSubAssignments.data.loadSubmittedAssignmentsForTeacher[i].assignment_id,
                                  assessment_detail:allSubAssignments.data.loadSubmittedAssignmentsForTeacher[i].assessment_detail,
                                  name: allSubAssignments.data.loadSubmittedAssignmentsForTeacher[i].user.name,
                                  userId:allSubAssignments.data.loadSubmittedAssignmentsForTeacher[i].userId,
                                  course_code:allSubAssignments.data.loadSubmittedAssignmentsForTeacher[i].course_code,
                                  assessment_id:allSubAssignments.data.loadSubmittedAssignmentsForTeacher[i].assessment_id,
                                  question_type:allSubAssignments.data.loadSubmittedAssignmentsForTeacher[i].question_type
                             })
                          }
                      }
                      setAllSubmittedAssignment(resHolder)
                  }

                  const remainingTime = calculateRemainingTime(expirationTime);
                  const fiveMinutes = 60000 * 5;
                  const userData = await getAllUsers({
                      variables: {"username": "loadAllNamesAndId"},
                  });
                  for (let i = 0; i < userData.data.getUsersNameId.length; i++) {
                      allUsers.push(
                          {
                              "name": userData.data.getUsersNameId[i].name,
                              "class": userData.data.getUsersNameId[i].class,
                              "userId": userData.data.getUsersNameId[i].userId,
                              "mobileNumber": userData.data.getUsersNameId[i].mobileNumber,
                              "email": userData.data.getUsersNameId[i].email,
                              "gender": userData.data.getUsersNameId[i].gender,
                              "roles": userData.data.getUsersNameId[i].role,
                              "active": userData.data.getUsersNameId[i].active,
                              "action": '***'
                          }
                      );
                      if ('student' === userData.data.getUsersNameId[i].role) {
                          allStudents.push(userData.data.getUsersNameId[i].name)
                      }
                  }
                  setAllUsersList(allUsers);
                  setAllStudentList(allStudents);

                  let resHolder = [];
                  const res = await assignments({
                      variables: {"assessmentId": "loadAll"},
                  });

                  if (res) {
                      for (let i = 0; i < res.data.getAssignments.length; i++) {
                          resHolder.push({
                              "title": res.data.getAssignments[i].title,
                              "assessment_id": res.data.getAssignments[i].assessment_id,
                              "assessment_detail": JSON.parse(res.data.getAssignments[i].assessment_detail),
                              "created_by": res.data.getAssignments[i].created_by
                          })
                      }
                      setQuestionArchive(resHolder);
                  }
                //  setUser({...loadedUser})



                  if ('student' === loadedUser.role) {
                      let holder = [];
                      const res = await getAllStudentAssignment({
                          variables: {"assignmentId": "loadall"},
                      })

                      if (res) {
                          for (let i = 0; i < res.data.getStudentAssignment.length; i++) {
                              if (loadedUser.class === res.data.getStudentAssignment[i].assignedTo | loadedUser.name === res.data.getStudentAssignment[i].assignedTo) {
                                  let status = 'not submitted'
                                  let assessment_detail = []
                                   await getAssignmentStatus({
                                      variables: {"userId": loadedUser.userId, "assessmentId": res.data.getStudentAssignment[i].assessment_id},
                                  }).then((response) => {
                                          if (response.data.getAssignmentStatus !== null) {
                                              status = 'submitted'
                                              assessment_detail = response.data.getAssignmentStatus.assessment_detail
                                          }
                                     }, (onRejected) => {

                                   })
                                     if ('not submitted' === status) {
                                  holder.push({
                                      "assessment_id": res.data.getStudentAssignment[i].assessment_id,
                                      "assignment_id": res.data.getStudentAssignment[i].assignment_id,
                                      "created_on": res.data.getStudentAssignment[i].created_on,
                                      "assignedBy": res.data.getStudentAssignment[i].assignedBy,
                                      "dateDue": res.data.getStudentAssignment[i].dateDue,
                                      "duration": res.data.getStudentAssignment[i].duration,
                                      "assignedTo": res.data.getStudentAssignment[i].assignedTo,
                                      'courseCode': res.data.getStudentAssignment[i].courseCode,
                                      "assessment_detail": JSON.parse(res.data.getStudentAssignment[i].assessment_detail),
                                      "status": status
                                   })
                                     } else {
                                         holder.push({
                                             "assessment_id": res.data.getStudentAssignment[i].assessment_id,
                                             "assignment_id": res.data.getStudentAssignment[i].assignment_id,
                                             "created_on": res.data.getStudentAssignment[i].created_on,
                                             "assignedBy": res.data.getStudentAssignment[i].assignedBy,
                                             "dateDue": res.data.getStudentAssignment[i].dateDue,
                                             "duration": res.data.getStudentAssignment[i].duration,
                                             "assignedTo": res.data.getStudentAssignment[i].assignedTo,
                                             'courseCode': res.data.getStudentAssignment[i].courseCode,
                                             "assessment_detail": JSON.parse(assessment_detail),
                                             "status": status
                                         })
                                     }
                              }
                          }
                      }
                      setStudentAssignments(holder);
                  }

                  if ("SUPER-ADMIN" === loadedUser.role) {
                      let holder = [];
                      const res = await getAllApplicants({
                          variables: {"email": "loadAll"},
                      })
                      if (res) {
                          for (let i = 0; i < res.data.getJobApplicants.length; i++) {
                              holder.push({
                                  "name": res.data.getJobApplicants[i].name,
                                  "email": res.data.getJobApplicants[i].email,
                                  "major": res.data.getJobApplicants[i].major,
                                  "qualification": res.data.getJobApplicants[i].qualification,
                                  "address": res.data.getJobApplicants[i].address,
                                  "resumeUrl": res.data.getJobApplicants[i].resumeUrl,
                                  "phone": res.data.getJobApplicants[i].phone,
                              })
                          }
                          setAllJobApplicants(holder);
                      }
                  }


                  if (true) {
                      let holder = [];
                      const res = await getAllCourses({
                          variables: {"code": "loadall"},
                      })
                      if (res) {
                          for (let i = 0; i < res.data.getAllCourses.length; i++) {
                              holder.push({
                                  "code": res.data.getAllCourses[i].code,
                                  "title": res.data.getAllCourses[i].title.toUpperCase().trim(),
                                  "description": res.data.getAllCourses[i].description
                              })
                          }
                      }
                      setAllCourses(holder);
                  }
                  logoutTimer = setTimeout(logoutHandler, fiveMinutes);
              } else {
                  setIsAuthenticated(false);
              }
          }
        },
      },
  );

    const [getAssignmentStatus] = useMutation(
        resolvers.GET_ASSIGNMENT_STATUS, {
            onError: (requestError) => {
                console.log("requestError?.message==>", requestError?.message)
                return false
            },

        }
    );


    const [getDownLoadStatus] = useMutation(
        resolvers.GET_DOWNLOAD_STATUS, {
            onCompleted : (res) => {

            }
        }
    );

  const [registerParent] = useMutation(
      resolvers.PARENT,
      {
        onError: (requestError) => {
          setAuthError(requestError?.message ?? 'Unknown Error.')
        },
        onCompleted: (registerResponse) => { if (registerResponse?.registerParent) {
            const {user : newUser, errors} = registerResponse?.registerParent;
            if(errors?.length) {
              console.log("errors[0].message", errors)
              setAuthError(errors[0]?.message ?? 'Unknown Error.')
            } else {
              setSuccessMessage("You have successfully registered")
            }
          }
        },
      },
  );

  // Register User
  const [registerStudent] = useMutation(
      resolvers.STUDENT,
      {
        onError: (requestError) => {
          setAuthError(requestError?.message ?? 'Unknown Error.')
        },
        onCompleted: (registerResponse) => {
          if (registerResponse?.registerStudent) {
            const {user : newUser, errors} = registerResponse?.registerStudent;
            if(errors?.length) {
              console.log("errors[0].message", errors)
              setAuthError(errors[0]?.message ?? 'Unknown Error.')
            } else {
              setSuccessMessage("You have successfully registered")
            }
          }
        },
      },
  );




  const updateAllUsersList = async() => {
    allUsers = [];
    const  userData = await getAllUsers({
      variables: {"username" : "loadAllNamesAndId"},
    });
    for (let i = 0; i < userData.data.getUsersNameId.length; i++) {
      allUsers.push(
          {
            "name":userData.data.getUsersNameId[i].name,
            "class":userData.data.getUsersNameId[i].class,
            "userId":userData.data.getUsersNameId[i].userId,
            "mobileNumber":userData.data.getUsersNameId[i].mobileNumber,
            "email":userData.data.getUsersNameId[i].email,
            "gender":userData.data.getUsersNameId[i].gender,
            "roles":userData.data.getUsersNameId[i].role,
            "active":userData.data.getUsersNameId[i].active,
            "action":'***'
          }
      );
    }
      setAllUsersList(allUsers);
     return allUserList;
  }

  const updateStudentAssignmentList = async () => {
      let holder = [];
      const res = await getAllStudentAssignment({
          variables: {"assignmentId": "loadall"},
      })
      if (res) {
          for (let i = 0; i < res.data.getStudentAssignment.length; i++) {
              if (user.class === res.data.getStudentAssignment[i].assignedTo | user.name === res.data.getStudentAssignment[i].assignedTo) {
                  let status = 'not submitted'
                  let assessment_detail = []
                  await getAssignmentStatus({
                      variables: {
                          "userId": user.userId,
                          "assessmentId": res.data.getStudentAssignment[i].assessment_id
                      },
                  }).then((response) => {
                      if (response.data.getAssignmentStatus !== null) {
                          status = 'submitted'
                          assessment_detail = response.data.getAssignmentStatus.assessment_detail
                      }
                  }, (onRejected) => {

                  })
                  if ('not submitted' === status) {
                      holder.push({
                          "assessment_id": res.data.getStudentAssignment[i].assessment_id,
                          "assignment_id": res.data.getStudentAssignment[i].assignment_id,
                          "created_on": res.data.getStudentAssignment[i].created_on,
                          "assignedBy": res.data.getStudentAssignment[i].assignedBy,
                          "dateDue": res.data.getStudentAssignment[i].dateDue,
                          "duration": res.data.getStudentAssignment[i].duration,
                          "assignedTo": res.data.getStudentAssignment[i].assignedTo,
                          'courseCode': res.data.getStudentAssignment[i].courseCode,
                          "assessment_detail": JSON.parse(res.data.getStudentAssignment[i].assessment_detail),
                          "status": status
                      })
                  } else {
                      holder.push({
                          "assessment_id": res.data.getStudentAssignment[i].assessment_id,
                          "assignment_id": res.data.getStudentAssignment[i].assignment_id,
                          "created_on": res.data.getStudentAssignment[i].created_on,
                          "assignedBy": res.data.getStudentAssignment[i].assignedBy,
                          "dateDue": res.data.getStudentAssignment[i].dateDue,
                          "duration": res.data.getStudentAssignment[i].duration,
                          "assignedTo": res.data.getStudentAssignment[i].assignedTo,
                          'courseCode': res.data.getStudentAssignment[i].courseCode,
                          "assessment_detail": JSON.parse(assessment_detail),
                          "status": status
                      })
                  }
              }
          }
      }
      setStudentAssignments(holder);
      return studentAssignments;
  }


  const [createUser] = useMutation(
      resolvers.REGISTER,
      {
        onError: (requestError) => {
          setAuthError(requestError?.message ?? 'Unknown Error.')
        },
        onCompleted: (registerResponse) => {
          if (registerResponse?.createUser) {
            const {user, errors} = registerResponse?.createUser;
            if(errors?.length) {
              console.log("errors[0].message", errors)
              setAuthError(errors[0]?.message ?? 'Unknown Error.')
            } else {
              setSuccessMessage("You have successfully registered")
            }
          }
        },
      },
  );

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  console.log("Current user  outside", user?.name)


    const [getAllUsers] = useMutation(
        resolvers.ALL_USERS
    );

    const [getAllRoles] = useMutation(
        resolvers.ALL_ROLES
    );

    const [getUserById] = useMutation(
        resolvers.USER_BY_ID
    );



    const [updateClass] = useMutation(
        resolvers.UPDATE_CLASS,
    );

    const [activateDeactivate] = useMutation(
        resolvers.ACTIVATE,
    );

    const [updatePassword] = useMutation(
        resolvers.UPDATE_PASSWORD,
    );

    const [uploadAssessment] = useMutation(
        resolvers.UPLOAD_ASSESSMENT,{
            onCompleted: async () => {
                    let resHolder = [];
                    const res = await assignments({
                        variables : {"assessmentId" : "loadAll"},
                    });
                    if (res) {
                        for (let i = 0; i < res.data.getAssignments.length; i++) {
                            resHolder.push({
                                "title":res.data.getAssignments[i].title,
                                "assessment_id":res.data.getAssignments[i].assessment_id,
                                "assessment_detail": JSON.parse(res.data.getAssignments[i].assessment_detail),
                                "created_by":res.data.getAssignments[i].created_by
                            })
                        }
                        setQuestionArchive(resHolder);
                    }
            },
        },
    );

    const [markAttendanceCommit] = useMutation(
        resolvers.MARK_ATTENDANCE
    );
    const [assignments] = useMutation(
        resolvers.GET_ASSIGNMENTS
    );

    const[getAllStudentAssignment] = useMutation(
        resolvers.GET_ALL_STUDENTS_ASSIGNMENTS,
    );

    const [createAssignmentCommit] = useMutation(
        resolvers.CREATE_ASSIGNMENT,
    );

    const [getAssessmentDetail] = useMutation(
        resolvers.GET_ASSIGNMENT_DETAIL
    );

    const [getAnswerDetail] = useMutation(
        resolvers.GET_ANSWER_DETAIL
    );

    const [getStudentAnswerDetail] = useMutation(
        resolvers.GET_STUDENT_ANSWER_DETAIL
    );

    const [confirmOldPassword] = useMutation(
        resolvers.CONFIRM_OLD_PASSWORD
    );

    const [registerJobApplicant] = useMutation(
        resolvers.REGISTER_JOB_APPLICANT
    );

    const [getAllApplicants] = useMutation(
        resolvers.GET_ALL_APPLICANTS
    );

    const [createCourseCommit] = useMutation(
        resolvers.CREATE_COURSE, {
            onCompleted: async () => {
                let holder = [];
                const res = await getAllCourses({
                    variables : {"code" : "loadall"},
                })
                if (res) {
                    for (let i = 0; i < res.data.getAllCourses.length; i++) {
                        holder.push({
                            "code": res.data.getAllCourses[i].code,
                            "title": res.data.getAllCourses[i].title,
                            "description": res.data.getAllCourses[i].description
                        } )
                    }
                }
                setAllCourses(holder);
            },
        }
    );


    const [updateConductDownloadStatus] = useMutation(
        resolvers.UPDATE_DOWNLOAD_STATUS,
    );

    const [updateStudentAnswer] = useMutation(
        resolvers.UPDATE_STUDENT_ANSWER,
    );

    const [loadSubmittedAssignmentsForTeacher] = useMutation(
        resolvers.LOAD_SUBMITTED_ASSIGNMENTS,
    );


    const [getAllCourses] = useMutation(
        resolvers.GET_ALL_COURSES
    );

    const [uploadTeacherAnswer] = useMutation(
        resolvers.SUBMIT_TEACHER_ANSWER
    );

    const [uploadStudentAnswer] = useMutation(
        resolvers.SUBMIT_STUDENT_ANSWER, {
            onCompleted: async () => {

            }
        }
    );


  const contextValue = {
    token,
    currentUser: user,
    login,
    createUser,
    successMessage,
    authError,
    setAuthError,
    setSuccessMessage,
    isAuthenticated,
    setIsAuthenticated,
    registerParent,
    registerStudent,
    regDetail,
    getAllUsers,
    allUserList,
    getAllRoles,
    welcomeName,
    getUserById,
    updateClass,
    activateDeactivate,
      uploadAssessment,
    updateAllUsersList,
      markAttendanceCommit,
    roles: roles,
      questionArchive,
      allStudentList,
      createAssignmentCommit,
    isLoggedIn: userIsLoggedIn,
      logoutHandler,
      studentAssignments,
      getAssessmentDetail,
      createCourseCommit,
      allCourses,
      updatePassword,
      confirmOldPassword,
      registerJobApplicant,
      uploadedFileUrl,
      allJobApplicants,
      updateConductDownloadStatus,
      codeOfConductModal,
      uploadTeacherAnswer,
      getAnswerDetail,
      uploadStudentAnswer,
      getStudentAnswerDetail,
      updateStudentAssignmentList,
      allSubmittedAssignment,
      updateStudentAnswer
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
