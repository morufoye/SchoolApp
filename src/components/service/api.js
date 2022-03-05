import {
    ApolloClient,
    createHttpLink,
    gql,
    InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getItem } from "./local-storage"



const httpLink = createHttpLink({
   uri: "http://localhost:5000/graphql",
    //uri: "http://api.babatundealaraje.com/graphql",
});

const authLink = setContext(async (_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = await getItem("token");
    console.log("token==>", token)
    // eslint-disable-next-line no-console
    if (process.env.NODE_ENV !== 'test') console.log('token', token);
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : '',
        },
    };
});

const dataStore = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export const CURRENT_USER = gql`
    query Me {
        me {
            id
            email
            firstName
            lastName
        }
    }
`;

export const LOGIN = gql`
    mutation Login($username: String!, $password: String!) {
        login(userId: $username, password: $password) {
            accessToken
            user {
                userId
                name
                mobileNumber
                email
                address
                linked_roles
                class
                role
                active
            }
            errors {
                field
                message
            }
        }
    }
`;

export const GET_DOWNLOAD_STATUS = gql`
    mutation GetDownLoadStatus($userId: String!) {
        getDownLoadStatus(userId: $userId) {
                form_status
        }
    }
`;

export const GET_ASSIGNMENT_STATUS = gql`
    mutation GetAssignmentStatus($userId: String!, $assessmentId: String!) {
        getAssignmentStatus(userId: $userId, assessmentId: $assessmentId) {
                userId
                assessment_detail
        }
    }
`;

export const UPDATE_CLASS =  gql`
       mutation UpdateClass($userId: String!, $newClass: String!) {
              updateClass(userId: $userId, newClass: $newClass) 
                }
`;

export const UPDATE_PASSWORD =  gql`
       mutation UpdatePassword($userId: String!, $password: String!) {
              updatePassword(userId: $userId, password: $password) 
                }
`;

export const ACTIVATE =  gql`
       mutation ActivateUser($userId: String!, $active: String!) {
              activateUser(userId: $userId, active: $active) 
                }
`;

export const UPDATE_DOWNLOAD_STATUS =  gql`
       mutation updateConductDownloadStatus($userId: String!, $status: String!, $fullName: String!) {
              updateConductDownloadStatus(userId: $userId, status: $status, fullName: $fullName) 
                }
`;

export const CONFIRM_OLD_PASSWORD =  gql`
       mutation ConfirmOldPassword($userId: String!, $password: String!) {
              confirmOldPassword(userId: $userId, password: $password) 
                }
`;

export const REGISTER = gql`
    mutation CreateUser($options: UserRegister!) {
        createUser(options: $options) {
            accessToken
            user {
                id
                firstName
                email
                lastName
            }
            errors {
                field
                message
            }
        }
    }
`;

export const PARENT = gql`
    mutation RegisterParent($userInput: UserRegistration!) {
        registerParent(userInput: $userInput) {
            user {
                name
                userId
                role
            }
            errors {
                field
                message
            }
        }
    }
`;

export const MARK_ATTENDANCE = gql`
    mutation MarkAttendance($userInput: AttendanceRegister!) {
        markAttendance(userInput: $userInput)  
    }
`;

export const UPLOAD_ASSESSMENT = gql`
    mutation UploadAssessment($userInput: AssessmentUpload!) {
        uploadAssessment(userInput: $userInput)  
    }
`;

export const CREATE_ASSIGNMENT = gql`
    mutation CreateAssignment($userInput: AssignmentRegister!) {
        createAssignment(userInput: $userInput)  
    }
`;


export const STUDENT = gql`
    mutation RegisterStudent($userInput: UserRegistration!) {
        registerStudent(userInput: $userInput) {
            accessToken
            user {
               name
               userId
            }
            errors {
                field
                message
            }
        }
    }
`;

// export const ALLUSERS = gql`
//   query
//   {
//             users {
//               name
//               userId
//             }
//  }
// `;

export const ALL_USERS = gql`
    mutation GetUsersNameId($username: String!) {
        getUsersNameId(userId: $username) {
           name
           userId
           mobileNumber
           email
           class
           linked_roles
           role
           gender
           active
        }
    }
`;

export const ALL_ROLES = gql`
    mutation GetAllRoles($name: String!) {
        getAllRoles(name: $name) {
           name
        }
    }
`;

export const USER_BY_ID = gql`
    mutation GetUserById($userId: String!) {
        getUserById(userId: $userId) {
           userId
           name
           mobileNumber
           address
           email
           class
           role
           linked_roles
           gender
           dob
        }
    }
`;

export const GET_ASSIGNMENTS = gql`
    mutation GetAssignments($assessmentId: String!) {
        getAssignments(assessmentId: $assessmentId) {
           title
           assessment_id
           assessment_detail
           created_by
        }
    }
`;

export const LOAD_SUBMITTED_ASSIGNMENTS = gql`
    mutation loadSubmittedAssignmentsForTeacher($assignedBy: String!) {
        loadSubmittedAssignmentsForTeacher(assignedBy: $assignedBy) {
           userId
           assessment_detail
           course_code
           user { name }
           assignment_id
           assessment_id
           question_type
        }
    }
`;

export const GET_ASSIGNMENT_DETAIL = gql`
    mutation GetAssignmentDetail($assessmentId: String!) {
        getAssignmentDetail(assessmentId: $assessmentId) {
           assessment_detail
        }
    }
`;

export const GET_ANSWER_DETAIL = gql`
    mutation GetAnswerDetail($assessmentId: String!) {
        getAnswerDetail(assessmentId: $assessmentId) {
           answer_detail
        }
    }
`;

export const GET_STUDENT_ANSWER_DETAIL = gql`
    mutation GetStudentAnswerDetail($assessmentId: String!, $userId: String!) {
        getStudentAnswerDetail(assessmentId: $assessmentId, userId: $userId) {
           answer_detail
           question_type
           total_score
        }
    }
`;

export const CREATE_COURSE = gql`
    mutation CreateCourse($userInput: CourseCreateRegister!) {
        createCourse(userInput: $userInput) 
    }
`;

export const GET_ALL_STUDENTS_ASSIGNMENTS = gql`
    mutation GetStudentAssignment($assignmentId: String!) {
        getStudentAssignment(assignmentId: $assignmentId) {
           assessment_id
           assignment_id
           assignedBy
           assignedTo
           duration
           created_on
           dateDue
           assessment_detail
           courseCode
        }
    }
`;

export const GET_ALL_APPLICANTS = gql`
    mutation GetJobApplicants($email: String!) {
        getJobApplicants(email: $email) {
           name
           email
           phone
           address
           major
           qualification
           resumeUrl
        }
    }
`;

export const GET_ALL_COURSES = gql`
    mutation GetAllCourses($code: String!) {
        getAllCourses(code: $code) {
           code
           title
           description
        }
    }
`;

export const REGISTER_JOB_APPLICANT = gql`
    mutation RegisterJobApplicant($userInput: ApplicantReg!) {
        registerJobApplicant(userInput: $userInput) 
    }
`;

export const SUBMIT_TEACHER_ANSWER = gql`
    mutation uploadTeacherAnswer($userId: String!, $assessment_id:String!, $answer_detail:String!) {
        uploadTeacherAnswer(userId: $userId, assessment_id:$assessment_id, answer_detail:$answer_detail) 
    }
`;
export const SUBMIT_STUDENT_ANSWER = gql`
    mutation uploadStudentAnswer($userId: String!, $assessment_id:String!, $answer_detail:String!, $question_type:String!, $assigned_by:String!,  $course_code:String!, $assignment_id:String!, $assessment_detail:String!) {
        uploadStudentAnswer(userId: $userId, assessment_id:$assessment_id, answer_detail:$answer_detail, question_type:$question_type, assigned_by:$assigned_by,  course_code:$course_code, assignment_id:$assignment_id, assessment_detail:$assessment_detail) 
    }
`;

//UPDATE_STUDENT_ANSWER
export const UPDATE_STUDENT_ANSWER = gql`
    mutation updateStudentAnswer($userId: String!, $assessment_id:String!, $assessment_detail:String!, $total_score:String!) {
        updateStudentAnswer(userId: $userId, assessment_id:$assessment_id, assessment_detail:$assessment_detail, total_score:$total_score) 
    }
`;

export const UPDATE_STUDENT_SCORE = gql`
    mutation updateStudentScore($userId: String!, $assessment_id:String!,  $total_score:String!) {
        updateStudentScore(userId: $userId, assessment_id:$assessment_id, total_score:$total_score) 
    }
`;

//getDailyReport
export const GET_DAILY_REPORT = gql`
    mutation GetDailyReport($userId: String!, $report_date:String!) {
        getDailyReport(userId: $userId, report_date:$report_date) {
           report_date
           comment
           other_comment
           adaab
           hifz
           murajah
        }
    }
`;

export const GET_WEEKLY_REPORT = gql`
    mutation GetWeeklyReport($userId: String!) {
        getWeeklyReport(userId: $userId) {
           report_date
           comment
           other_comment
           adaab
           hifz
           murajah
        }
    }
`;


export default dataStore;
