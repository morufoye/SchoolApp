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
import QuestionDisplaySubmittedAssignments from "../Question-Maker/question-display-submitted-assignments";


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


const AllSubmittedAssignments = (props) => {
    const[selectedId, setSelectedId] = useState('');
    const[studentId, setStudentId] = useState('');
    const {allSubmittedAssignment, getStudentAnswerDetail, updateStudentAnswer} = useContext(AuthContext);
    const[displayQuestion, setDisplayQuestion] = useState(false);
    const[questions, setQuestions] = useState('');
    const[assessmentId, setAssessmentId] = useState('');
    const[studentScore, setStudentScore] = useState('pending')
    let [textAnswerList, setTextAnswerList] = useState([])
    let[textRespScore, setTextRespScore] = useState([])
    const[pass, setPass] = useState(false)
    const[questionLength, setQuestionLength] = useState(0);
    let answerList = [];

    let student_answer = [{}]

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

    const calculateScore =(totalScore) => {
        if ('not yet available' !== totalScore) {
            if (totalScore * 100 > 70 ) { setPass(true)}
            setStudentScore(totalScore * 100 + '%')
        }

    }

    const handleViewQuestion = (row) => {
        setQuestions(JSON.parse(row.original.assessment_detail));
        setStudentId(row.original.userId)
        setAssessmentId(row.original.assessment_id)
        setQuestionLength((JSON.parse(row.original.assessment_detail)).length)
        //const res = processQuestion(row.original.assessment_id, row.original.userId, row.original.question_type, JSON.parse(row.original.assessment_detail))
        setDisplayQuestion(true);
    }

    const commentTextQuestion = (number, comment) => {
        let response = {"questionNumber": number, "comment": comment}
        for (let i in textAnswerList) {
            if (textAnswerList[i].questionNumber === number) {
                textAnswerList.splice(i,1)
            }
        }
        textAnswerList.push(response)
    }



    const handleTextRespScore = (number, score) => {
        let ass = {questionNumber: number, score: score}
        for (let i in textRespScore) {
            if (textRespScore[i].questionNumber === number) {
                textRespScore.splice(i,1)
            }
        }
        textRespScore.push(ass)
        let totalScore = 0;
        for (let i in textRespScore) {
            totalScore = totalScore + parseInt(textRespScore[i].score)
        }
        setStudentScore(totalScore/questionLength * 10 + '%')
    }


    const handleClose = async (studentId, assessment_id, question, score) => {
        setDisplayQuestion(false);
        setStudentScore('pending');
        setPass(false);
        setTextRespScore([])
        if (textAnswerList.length > 0) {
            for (let i in textAnswerList) {
                question[i] = {...question[i], comment :  textAnswerList[i].comment}
            }
            for (let i in textRespScore) {
                question[i] = {...question[i], score :  textRespScore[i].score}
            }
            await updateStudentAnswer({
                variables : {"userId": studentId, "assessment_id": assessment_id,  "assessment_detail": JSON.stringify(question), total_score: score},
            })
        }
        setQuestions('')

    }



    const HandleAction = (row) => {
        const buttonRef = useRef();

        return (
            <>
                <button color="black" ref={buttonRef} ripple="light">
                    <span style={{font: "40px arial"}}>....</span>
                </button>
                <Popover placement="bottom" ref={buttonRef}>
                    <PopoverContainer>
                        <PopoverBody>
                            <>
                                <p><span onClick={() => handleViewQuestion(row)}>View</span></p>
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
                accessor: 'assignment_id',
                Filter: SelectColumnFilter,
            },

           {
                Header: 'Student Id',
                accessor: 'userId',
            },

            {
                Header: 'Name',
                accessor: 'name',
            },

            {
                Header: 'Course Code',
                accessor: 'course_code',
                Filter: SelectColumnFilter,
            },

            {
                Header: 'View Detail',
                accessor: 'view',
                Cell: ({row}) => HandleAction(row),
            },
        ],
        []
    )

    const handleChange = () => {
        props.closeModal()
    }



    const data = useMemo(() => allSubmittedAssignment, []);
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
                        <h2>Submitted Assignments</h2>
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
                        <button className="object-right-top" id='refreshList' onClick={()=>{props.closeTable()}}>close</button>
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

                    <div className="lg:w-1/0.1 px-6  h-96  overflow-y-auto">
                        <h2 className=" title-font font-semibold text-gray-900 tracking-widest  text-xs">
                            QUESTIONS<span onClick={()=>{handleClose(studentId, assessmentId, questions, studentScore)}}>close</span>
                        </h2>
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
                        {questions.map((question, index)=>
                            <div key={index} className="rounded shadow-md my-1 p-4">
                                    <QuestionDisplaySubmittedAssignments
                                        assessment_id={selectedId}
                                        key={index}
                                        question={question}
                                        questionNumber={`Question ${index + 1}`}
                                        submitted={true}
                                        student_id={studentId}
                                        assessment_id={assessmentId}
                                        score={calculateScore}
                                        commentTextQuestion={commentTextQuestion}
                                        handleTextRespScore={handleTextRespScore}
                                    />
                            </div>)}

                    </div>
                </div>
            }
        </Fragment>
    );
};

export default AllSubmittedAssignments;