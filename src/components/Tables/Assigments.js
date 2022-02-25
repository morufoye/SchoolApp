import CreateUser from "../modals/EditProfile";
import {useContext, useEffect, useMemo, useState, Fragment, useRef} from "react";
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
import QuestionDisplayProvideAnswer from "../Question-Maker/question-display-provide-answer";


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


const AssignmentList = (props) => {


    const[selectedId, setSelectedId] = useState('');
    const {questionArchive, currentUser, uploadTeacherAnswer} = useContext(AuthContext);
    const[displayQuestion, setDisplayQuestion] = useState(false);
    const[createAssigmentModal, setCreateAssigmentModal] = useState(false);
    const[assessmentOwner, setAssessmentOwner] = useState('');
    const[questions, setQuestions] = useState(false);
    const[assessmentTitle, setAssessmentTitle] = useState('');
    const[provideAnswer, setProvideAnswer] = useState(false);
    const[userInput, setUserInput] = useState();
    let answerList = [];
    let matchingAnswerResponse = {};


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



    const handleViewQuestion = (row) => {
        setQuestions(row.original.assessment_detail);
        setAssessmentOwner(row.original.created_by)
        setDisplayQuestion(true);
    }

    const provideAnswerToQuestion = (row) => {
        setSelectedId(row.original.assessment_id);
        setQuestions(row.original.assessment_detail);
        setAssessmentOwner(row.original.created_by)
        setDisplayQuestion(true);
        setProvideAnswer(true);
    }

    const handleCreateAssignment = (row) => {
        setSelectedId(row.original.assessment_id);
        setAssessmentOwner(row.original.created_by)
        setAssessmentTitle(row.original.title)
        setCreateAssigmentModal(true)
    }

    const HandleAction = (row) => {
        const buttonRef = useRef();
        let uploadAnswer = false;
        if (row.original.created_by === currentUser.name) {
            uploadAnswer = true;
        }
        return (
            <>
                <button color="black" ref={buttonRef} ripple="light">
                    <span style={{font: "40px arial"}}>....</span>
                </button>
                <Popover placement="bottom" ref={buttonRef}>
                    <PopoverContainer>
                        <PopoverBody>
                            <>
                                <p><span onClick={() => handleViewQuestion(row)}>View Question</span></p>
                                { uploadAnswer && <p><span onClick={() => provideAnswerToQuestion(row)}>Upload Answer</span></p>}
                                <p><span onClick={() => handleCreateAssignment(row)}>Create Assignment</span></p>

                            </>
                        </PopoverBody>
                    </PopoverContainer>
                </Popover>
            </>
        )
    }


    const columns = useMemo(
        () => [
            {
                Header: 'Assignment Id',
                accessor: 'assessment_id',
            },

            {
                Header: 'Title',
                accessor: 'title',
                Filter: SelectColumnFilter,
            },

            {
                Header: 'Owner',
                accessor: 'created_by',
                Filter: SelectColumnFilter,
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
        answerList.push(questionNumber + '-'+ index)
        for (let i = 0; i < 4; i++) {
            if (i !== index) {
                document.getElementById(questionNumber + '-'+ i).checked = false;
                if (answerList.indexOf(questionNumber + '-'+ i) !== -1) {
                    answerList.splice(answerList.indexOf(questionNumber + '-'+ i), 1)
                }
            }
        }
    }

    const handleClickActionForMOQ = (e, questionNumber, index) => {
         if (false !== document.getElementById(questionNumber + '-'+ index).checked) {
             document.getElementById(questionNumber + '-'+ index).checked = true;
             answerList.push(questionNumber + '-'+ index)
         }
        if (false === document.getElementById(questionNumber + '-'+ index).checked) {
            document.getElementById(questionNumber + '-'+ index).checked = false;
            if (answerList.indexOf(questionNumber + '-'+ index) !== -1) {
                answerList.splice(answerList.indexOf(questionNumber + '-'+ index), 1)
            }
        }
    }

    const handleMatchingAnswer = (questionNumber, index, val) => {
        matchingAnswerResponse = {...matchingAnswerResponse , [questionNumber + '-'+ index] : val }
    //    console.log(' >> >> >> matching response  >> ' + JSON.stringify(matchingAnswerResponse))
    }


    const handleSubmitAnswer = async(ques) => {
        let matchingLength =  Object.keys(matchingAnswerResponse).length
        let questionLen = ques.length;
         let answerKeys = Object.keys(matchingAnswerResponse)
         let allArray = [];
        for (let i = 1; i < questionLen + 1; i++) {
            let answerArray = [];
           for (let k in answerKeys) {

               let hyphenIndex = answerKeys[k].indexOf("-")
               let queNumber = answerKeys[k].substring(9, hyphenIndex)
               if ( parseInt(queNumber) === i) {
                   answerArray.push(matchingAnswerResponse[answerKeys[k]])
               }
           }
           allArray.push({['Question' + ' ' + i] : answerArray})
        }
       // console.log(' jjjjj object main' + JSON.stringify(allArray))
        if (0 === matchingLength) {
            await uploadTeacherAnswer({
                variables : {"userId": currentUser.userId, "assessment_id": selectedId, "answer_detail":  JSON.stringify(answerList)},
            })
        } else {
           await uploadTeacherAnswer({
               variables : {"userId": currentUser.userId, "assessment_id": selectedId, "answer_detail":  JSON.stringify(allArray)},
           })
        }

        setDisplayQuestion(false);
    }

    const data = useMemo(() => questionArchive, []);
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
                <h2>Assessment Question Archive</h2>
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
                <button className="object-right-top" id='refreshList' onClick={()=>{props.refreshList()}}>close</button>
                <table {...getTableProps()}  id='usersList' className="min-w-full divide-y divide-gray-200">
                    <thead  className="bg-gray-50">
                    {headerGroups.map(headerGroup => (
                        <tr
                            {...headerGroup.getHeaderGroupProps()}>
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
            <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md">
                <div className="lg:w-1/2 px-6  h-96  overflow-y-auto">
                    <h2 className=" title-font font-semibold text-gray-900 tracking-widest  text-xs">
                        QUESTIONS  {props.isTeacher && <span onClick={()=>{setDisplayQuestion(false)}}>close</span>}
                    </h2>
                    {questions.map((question, index)=>
                        <div key={index} className="rounded shadow-md my-1 p-4">
                            {provideAnswer ?
                                <QuestionDisplayProvideAnswer
                                assessment_id={selectedId}
                                key={index}
                                question={question}
                                questionNumber={`Question ${index + 1}`}
                                handleClickActionForMCQ={handleClickActionForMCQ}
                                handleClickActionForMOQ={handleClickActionForMOQ}
                                handleMatchingAnswer={handleMatchingAnswer}
                                isTeacher={true}
                                />
                                :
                                <QuestionDisplay  key={index}  question={question}  questionNumber={`Question ${index + 1}`} />}
                        </div>)}

                    { provideAnswer &&
                    <button  className=" float-right bg-blue-500 text-white active:bg-blue-600 font-bold text-xs px-4 py-2 mt-3 ml-6 rounded shadow hover:shadow-md outline-none  focus:outline-none "
                    onClick={() => handleSubmitAnswer(questions)} >
                        Done
                    </button>
                    }
                </div>
            </div>
            }

            { createAssigmentModal &&
            <CreateAssignment assessmentId={selectedId} owner={assessmentOwner} title={assessmentTitle} closeModal={() => setCreateAssigmentModal(false)}/>
            }
        </Fragment>
    );
};

export default AssignmentList;