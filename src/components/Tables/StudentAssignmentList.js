import CreateUser from "../modals/EditProfile";
import React, {useContext, useEffect, useMemo, useState, Fragment, useRef, useReducer} from "react";
import AuthContext from "../context/auth-context";
import {useTable, usePagination, useGlobalFilter, useAsyncDebounce, useFilters, useSortBy } from "react-table";
import Card from "../UI/Card";
//import Button from "@material-tailwind/react/Button";
import Popover from "@material-tailwind/react/Popover";
import PopoverContainer from "@material-tailwind/react/PopoverContainer";
import PopoverHeader from "@material-tailwind/react/PopoverHeader";
import PopoverBody from "@material-tailwind/react/PopoverBody";

import { ChevronDoubleLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleRightIcon } from '@heroicons/react/solid'
import QuestionDisplay from "../Question-Maker/question-display";
import CreateAssignment from "../modals/CreateAssignment";
import QuestionDisplayStuent from "../Question-Maker/question-display-provide-answer";
import QuestionDisplayProvideAnswer from "../Question-Maker/question-display-provide-answer";
import Modal from "../UI/Modal";
import QuestionModal from "../UI/OuestionModal";
import SubmitAssessmentModal from "../modals/SubmitAssessmentModal";


// const initialMatchingAnswerResponse = {
//
// }
//
// const reducer = (matchingAnswerResponse, action) => {
//     let val = action.toAdd
//     switch (action.type) {
//         case "ADD":
//             matchingAnswerResponse = {...matchingAnswerResponse , val}
//             console.log('  jjjjjjjjjjjjj   kkkkkkkkkkkkkkkkkkkkkk   ' + JSON.stringify(matchingAnswerResponse))
//             return matchingAnswerResponse
//         default:
//             return matchingAnswerResponse;
//     }
// };


export function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export function Button({ children, className, ...rest }) {
    return (
        <button
            type="button"
            className={classNames(
                "relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50",
                className
            )}
            {...rest}
        >
            {children}
        </button>
    );
}

export function PageButton({ children, className, ...rest }) {
    return (
        <button
            type="button"
            className={classNames(
                "relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50",
                className
            )}
            {...rest}
        >
            {children}
        </button>
    );
}


export function SelectColumnFilter({
                                       column: { filterValue, setFilter, preFilteredRows, id, render },
                                   }) {
    const options = useMemo(() => {
        const options = new Set();
        preFilteredRows.forEach((row) => {
            options.add(row.values[id]);
        });
        return [...options.values()];
    }, [id, preFilteredRows]);

    return (
        <label className="flex gap-x-2 items-baseline">
            <span className="text-gray-700">{render("Header")}: </span>
            <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                name={id}
                id={id}
                value={filterValue}
                onChange={e => {
                    setFilter(e.target.value || undefined)
                }}
            >
                <option value="">All</option>
                {options.map((option, i) => (
                    <option key={i} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </label>
    );
}


const StudentAssignmentList = (props) => {
    const[selectedId, setSelectedId] = useState('');
    const {studentAssignments, currentUser, uploadStudentAnswer, updateStudentAssignmentList, getStudentAnswerDetail, updateStudentScore} = useContext(AuthContext);
    const[displayQuestion, setDisplayQuestion] = useState(false);
    const[createAssigmentModal, setCreateAssigmentModal] = useState(false);
    const[assessmentOwner, setAssessmentOwner] = useState('');
    const[questions, setQuestions] = useState(false);
    const[timeSpent, setTimeSpent] = useState(0)
    const[timeAllowed, setTimeAllowed] = useState('00:00:00');
    const[submitted, setSubmitted] = useState(false)
    const[userInput, setUserInput] = useState({})
    let [answerListMCQ, setAnswerListMCQ] = useState([])
    let [answerListMOQ, setAnswerListMOQ] = useState([])
    let [textAnswerList, setTextAnswerList] = useState([])
    const[studentScore, setStudentScore] = useState();
    const[pass, setPass] = useState(false)
    const[textRes, setTextRes] = useState({questionNumber: "", answer : ""});
    let questionObject = {};
    const[queObjectState, setQueObjectState] = useState({})
    const[rowObject, setRowObject] = useState({})
    const[showSubmitModal, setShowSubmitModal] = useState(false);
    let[matchingAnswerResponse, setMatchingAnswerResponse] = useState([]);
    //const [matchingAnswerResponse, dispatch] = useReducer(reducer, initialMatchingAnswerResponse);



    function GlobalFilter({
                              preGlobalFilteredRows,
                              globalFilter,
                              setGlobalFilter,
                          }) {
        const count = preGlobalFilteredRows.length
        const [value, setValue] = useState(globalFilter)
        const onChange = useAsyncDebounce(value => {
            setGlobalFilter(value || undefined)
        }, 200)

        return (
            <label className="flex gap-x-2 items-baseline">
                <span className="text-gray-700">Search: </span>
                <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    value={value || ""}
                    onChange={e => {
                        setValue(e.target.value);
                        onChange(e.target.value);
                    }}
                    placeholder={`${count} records...`}
                />
            </label>
        )
    }

    const handleCellAction = (row) => {
        setQuestions((row.original.assessment_detail))
        setSelectedId(row.original.assessment_id)
        setDisplayQuestion(true)
        setSubmitted(false);

        questionObject =
                  {             id:row.original.assessment_id,
                                assigned_by:row.original.assignedBy,
                                courseCode:row.original.courseCode,
                                assignment_id:row.original.assignment_id,
                                assessment_detail:row.original.assessment_detail
                  }
        setQueObjectState(questionObject)

        const duration = processDuration(row.original.duration)
        setTimeAllowed(row.original.duration + ':00')
        let i = 0;
        let hour = 0
        let min = 0
        let totSec = 0;
        const timer = setInterval(async ()=> {
                ++i
                ++totSec
                if (totSec === duration) {
                    setDisplayQuestion(false)
                    clearTimeout(timer)
                   handleSubmitAnswer(questionObject)
                    if (!textAnswerList.length > 0) {
                        setTimeout(()=>{handleViewScore(row.original.assessment_detail, row.original.assessment_id)}, 100)
                    }
                }
                if ( i === 60) {
                    min++
                    i = 0;
                }
                if (min === 60) {
                    hour++
                    min = 0;
                }
                let ss = i.toString();
                if (ss.length === 1) {
                    ss = '0'+ ss;
                }
                let mm = min.toString()
                if (mm.length === 1) {
                    mm = '0'+ mm + ':';
                }
                let hh = hour.toString()
                if (hh.length === 1) {
                    hh = '0'+ hh + ':';
                }
                setTimeSpent(hh + mm + ss)

            }
            , 1000)
    }

    const handleViewScore = (detail, id) => {
        setQuestions(detail)
        processScore(detail)
        setDisplayQuestion(true)
        setSelectedId(id)
        setSubmitted(true)
    }

    const processScore =  (questions) => {
        let totalScore = 0;
        for (let i in questions) {
            if (questions[i].score) {
                totalScore = totalScore + parseInt(questions[i].score)
            }
         }
         setStudentScore(totalScore/questions.length * 10 + '%')
    }

    const processDuration = (rawDuration) => {
        const hour =  rawDuration.substring(0,2);
        const min =   rawDuration.substring(3,5);
        const totalTime = parseInt(hour)*60*60 + parseInt(min)*60
        return totalTime;
    }




    const HandleAction = (row) => {
        let[showSelector, setShowSelector] = useState(false);
        const buttonRef = useRef();
        let submitted = false;
        if (row.original.status === 'submitted') {
            submitted = true;
        }
        return (
            <>
                <button  ref={buttonRef} ripple="light">
                    <span style={{font: "40px arial"}}>....</span>
                </button>
                <Popover placement="bottom" ref={buttonRef}>
                    <PopoverContainer>
                        <PopoverBody>
                            <>
                                <p>{submitted ? <button onClick={() => {handleViewScore(row.original.assessment_detail, row.original.assessment_id)}}>View Score</button> : <button onClick={() => {handleCellAction(row)}}>Start</button>}</p>
                            </>
                        </PopoverBody>
                    </PopoverContainer>
                </Popover>
            </>
        )
    }

    const RenderDuration = (row) => {
        let val = row.original.created_on.substring(0, 10)
        return (
            <>
               <span>{val}</span>
            </>
        )
    }



    const columns = useMemo(
        () => [
            {
                Header: 'Assignment_Id',
                accessor: 'assignment_id',
            },

            {
                Header: 'Course Code',
                accessor: 'courseCode',
                Filter: SelectColumnFilter,
            },

            {
                Header: 'Assigned By',
                accessor: 'assignedBy',
            },

            {
                Header: 'Created On',
                accessor: 'created_on',
                Cell: ({row}) => RenderDuration(row),
            },
            {
                Header: 'Duration (HH:MM)',
                accessor: 'duration',
            },
            {
                Header: 'Date Due',
                accessor: 'dateDue',
                Filter: SelectColumnFilter,
            },

            {
                Header: 'Status',
                accessor: 'status',
            },

            {
                Header: 'Actions',
                accessor: 'action',
                Cell: ({row}) => HandleAction(row),
            },
        ],
        []
    )

    const handleChange = () => {
        props.closeModal()
    }

    const handleClickActionForMCQ = (e, questionNumber, index) => {
        document.getElementById(questionNumber + '-'+ index).checked = true;
        for (let i = 0; i < 4; i++) {
            if (i !== index) {
                document.getElementById(questionNumber + '-'+ i).checked = false;
                if (answerListMCQ.indexOf(questionNumber + '-'+ i) !== -1) {
                    answerListMCQ.splice(answerListMCQ.indexOf(questionNumber + '-'+ i), 1)
                }
            }
        } answerListMCQ.push(questionNumber + '-'+ index)
         //setUserInput({"userId": currentUser.userId, "assessment_id": selectedId, "answer_detail":  JSON.stringify(answerList)} )
    }

    const handleClickActionForMOQ = (e, questionNumber, index) => {
        if (false !== document.getElementById(questionNumber + '-'+ index).checked) {
            document.getElementById(questionNumber + '-'+ index).checked = true;
            answerListMOQ.push(questionNumber + '-'+ index)
        }
        if (false === document.getElementById(questionNumber + '-'+ index).checked) {
            document.getElementById(questionNumber + '-'+ index).checked = false;
            if (answerListMOQ.indexOf(questionNumber + '-'+ index) !== -1) {
                answerListMOQ.splice(answerListMOQ.indexOf(questionNumber + '-'+ index), 1)
            }
        }
    }

    const handleMatchingAnswer = (questionNumber, index, val) => {
        matchingAnswerResponse.push({[questionNumber + '-' + index]: val})
    }



    const handleSubmitAnswer = async (quesObj) => {
        let matchingLength =  Object.keys(matchingAnswerResponse).length;
         let finalMatchcingReasponse = {}
        for (let i in matchingAnswerResponse) {
            let key = Object.keys(matchingAnswerResponse[i])
            let value = Object.values(matchingAnswerResponse[i])
            finalMatchcingReasponse = {...finalMatchcingReasponse, [key]  : Object.values(matchingAnswerResponse[i])[0]}
        }
        let answerKeys = Object.keys(finalMatchcingReasponse)
        let allArray = [];
        let questionLen =  quesObj.assessment_detail.length
        for (let i = 1; i < questionLen + 1; i++) {
            let answerArray = [];
            for (let k in answerKeys) {
                let hyphenIndex = answerKeys[k].indexOf("-")
                let queNumber = answerKeys[k].substring(9, hyphenIndex)
                if ( parseInt(queNumber) === i) {
                    answerArray.push(finalMatchcingReasponse[answerKeys[k]])
                }
            }
            allArray.push({['Question' + ' ' + i] : answerArray})
        }


        if (answerListMCQ.length > 0) {
            await uploadStudentAnswer({
                variables : {"userId": currentUser.userId, "assessment_id": quesObj.id, "answer_detail":  JSON.stringify(answerListMCQ), "question_type": "multipleChoice", "assigned_by":quesObj.assigned_by,  "course_code": quesObj.courseCode, "assignment_id":quesObj.assignment_id, "assessment_detail": JSON.stringify(quesObj.assessment_detail)},
            })
        }
        if (answerListMOQ.length > 0) {
            await uploadStudentAnswer({
                variables : {"userId": currentUser.userId, "assessment_id": quesObj.id, "answer_detail":  JSON.stringify(answerListMOQ), "question_type": "multipleOption", "assigned_by":quesObj.assigned_by,  "course_code": quesObj.courseCode, "assignment_id":quesObj.assignment_id, "assessment_detail": JSON.stringify(quesObj.assessment_detail)},
            })
        }
        if (textAnswerList.length > 0) {
            for (let i in textAnswerList) {
                quesObj.assessment_detail[i] = {...quesObj.assessment_detail[i], "resp" :  textAnswerList[i].answer}
            }
            await uploadStudentAnswer({
                variables : {"userId": currentUser.userId, "assessment_id": quesObj.id, "answer_detail":  JSON.stringify(textAnswerList), "question_type": "essay", "assigned_by":quesObj.assigned_by, "course_code":quesObj.courseCode, "assignment_id":quesObj.assignment_id, "assessment_detail": JSON.stringify(quesObj.assessment_detail)},
            })
       }

        if (0 !== matchingLength) {
            await uploadStudentAnswer({
                variables : {"userId": currentUser.userId, "assessment_id": quesObj.id, "answer_detail":  JSON.stringify(allArray), "question_type": "matching", "assigned_by":quesObj.assigned_by, "course_code":quesObj.courseCode, "assignment_id":quesObj.assignment_id, "assessment_detail": JSON.stringify(quesObj.assessment_detail)},
            })
        }
        closeModalAndRefresh();
    }

    const submitBeforeTimeOut = (quesObj) => {
        handleSubmitAnswer(quesObj)
        setDisplayQuestion(false)
        if (!textAnswerList.length > 0) {
            setTimeout(()=>{handleViewScore(quesObj.assessment_detail, quesObj.assessment_id)}, 100)
        }
        setShowSubmitModal(false)

    }

    const calculateScore =async(totalScore, userId, assessmentId) => {
        if ('not yet available' !== totalScore) {
            if (totalScore * 100 > 70 ) { setPass(true)}
            setStudentScore(totalScore * 100 + '%')
            const res = await updateStudentScore({
                variables : {userId: userId, assessment_id:assessmentId, total_score:totalScore * 100 + '%'}
            })
        }
        else {
            setStudentScore(' Your grade for this assessment is still pending');
        }
    }

    const answerTextQuestion = (number, answer) => {
        let response = {"questionNumber": number, "answer": answer}
        for (let i in textAnswerList) {
            if (textAnswerList[i].questionNumber === number) {
                textAnswerList.splice(i,1)
            }
        }
        textAnswerList.push(response)
    }

    const keepTextResponse = (number, answer) => {
        answerTextQuestion(number, answer)
    }




    const closeModalAndRefresh = () => {
        updateStudentAssignmentList()
        document.getElementById('refreshList').click();
        setDisplayQuestion(false);
    }

    const data = useMemo(() => studentAssignments, []);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        previousPage,
        nextPage,
        gotoPage,
        pageCount,
        canPreviousPage,
        canNextPage,
        pageOptions,
        setPageSize,
        state,
        prepareRow,
        preGlobalFilteredRows, // new
        setGlobalFilter,
    } = useTable({ columns, data }, useFilters, useGlobalFilter, useSortBy, usePagination);
    const { pageIndex, pageSize }  = state;

    return (
        <Fragment>
            {!displayQuestion &&
            <Card>
                <header>
                    <h2>Assessments</h2>
                </header>
                <div className="flex gap-x-2">
                    <GlobalFilter
                        preGlobalFilteredRows={preGlobalFilteredRows}
                        globalFilter={state.globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                    {headerGroups.map((headerGroup) =>
                        headerGroup.headers.map((column) =>
                            column.Filter ? (
                                <div key={column.id}>
                                    <label htmlFor={column.id}></label>
                                    {column.render("Filter")}
                                </div>
                            ) : null
                        )
                    )}
                </div>
                <div>
                    <button className="object-right-top" id='refreshList' onClick={()=>{props.refreshList()}}>refresh</button>
                    <table {...getTableProps()}  id='usersList' className="min-w-full divide-y divide-gray-200">
                        <thead  className="bg-gray-50">
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                { headerGroup.headers.map(column => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render('Header')}
                                        <span>
                    {column.isSorted
                        ? column.isSortedDesc
                            ? ' ▼'
                            : ' ▲'
                        : ''}
                  </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody {...getTableBodyProps()}
                               className="px-6 py-4 whitespace-nowrap"
                        >
                        { page.map(row => {
                            prepareRow(row)
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => {
                                        return (
                                            <td {...cell.getCellProps()} className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap text-center"> {cell.render('Cell')}</p>
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                    <div className="py-3 flex items-center justify-between">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <Button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</Button>
                            <Button onClick={() => nextPage()} disabled={!canNextPage}>Next</Button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div className="flex gap-x-2">
            <span className="text-sm text-gray-1000">
              Page <span className="font-medium">{state.pageIndex + 1}</span> of <span className="font-medium">{pageOptions.length}</span>
            </span>
                                <label>
                                    <span className="sr-only">Items Per Page</span>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        value={state.pageSize}
                                        onChange={(e) => {
                                            setPageSize(Number(e.target.value));
                                        }}
                                    >
                                        {[5, 10, 20].map((pageSize) => (
                                            <option key={pageSize} value={pageSize}>
                                                Show {pageSize}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <PageButton
                                        className="rounded-l-md"
                                        onClick={() => gotoPage(0)}
                                        disabled={!canPreviousPage}
                                    >
                                        <span className="sr-only">First</span>
                                        <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
                                    </PageButton>
                                    <PageButton
                                        onClick={() => previousPage()}
                                        disabled={!canPreviousPage}
                                    >
                                        <span className="sr-only">Previous</span>
                                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                    </PageButton>
                                    <PageButton
                                        onClick={() => nextPage()}
                                        disabled={!canNextPage
                                        }>
                                        <span className="sr-only">Next</span>
                                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                    </PageButton>
                                    <PageButton
                                        className="rounded-r-md"
                                        onClick={() => gotoPage(pageCount - 1)}
                                        disabled={!canNextPage}
                                    >
                                        <span className="sr-only">Last</span>
                                        <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
                                    </PageButton>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            }

            { displayQuestion &&
             <QuestionModal>
            <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md">
                { !submitted ? <table>
                    <tr>
                        <td>
                            <button className="p-3 w-lg m-2 bg-green-400 text-center rounded-xl">
                                Time Allowed  <b>{timeAllowed}</b>
                            </button>
                        </td>

                        <td>
                            <button className="p-3 w-lg m-2 bg-red-100 text-center rounded-xl">
                                Time Spent  <b>{timeSpent}</b>
                            </button>
                        </td>
                    </tr>
                </table> :
                    <table>
                        <tr>
                    <td>Grade</td>
                    <td> { pass ?
                        <button className="p-3 w-lg m-2 bg-green-100 text-center rounded-xl"> <b>{studentScore}</b>
                    </button> :
                        <button className="p-3 w-lg m-2 bg-red-100 text-center rounded-xl"> <b>{studentScore}</b>
                        </button>
                    }
                    </td>
                      </tr>
                    </table>
                }

                <div className="lg:w-1/9 px-6  h-96  overflow-y-auto">
                    <h2 className=" title-font font-semibold text-gray-900 tracking-widest  text-xs">
                        QUESTIONS  {props.isTeacher && <span onClick={()=>{setDisplayQuestion(false)}}>close</span>} {submitted && <span onClick={()=>{setDisplayQuestion(false); props.refreshList()}}>close</span>}
                    </h2>
                    {questions.map((question, index)=>
                        <div key={index} className="rounded shadow-md my-1 p-4">
                            <QuestionDisplayProvideAnswer
                                key={index}
                                question={question}
                                questionNumber={`Question ${index + 1}`}
                                textValueId={`Questionkkk${index + 1}`}
                                assessment_id={selectedId}
                                handleClickActionForMCQ={handleClickActionForMCQ}
                                handleClickActionForMOQ={handleClickActionForMOQ}
                                score={calculateScore}
                                answerTextQuestion={answerTextQuestion}
                                submitted={submitted}
                                keepTextResponse={keepTextResponse}
                                handleMatchingAnswer={handleMatchingAnswer}
                                isTeacher={false}
                            />
                        </div>)
                       }
                       <button className="p-3 w-lg m-2 bg-green-100 text-center rounded-xl"
                       onClick={()=>{setShowSubmitModal(true)}}
                       >
                           submit
                       </button>
                    { showSubmitModal && <SubmitAssessmentModal questionObject={queObjectState} handleSubmitAnswer={submitBeforeTimeOut} onClose={()=>{setShowSubmitModal(false)}}/>}


                </div>

            </div>
                </QuestionModal>
            }


        </Fragment>
    );
};

export default StudentAssignmentList;