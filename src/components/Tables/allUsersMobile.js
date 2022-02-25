import CreateUser from "../modals/EditProfile";
import {useContext, useEffect, useMemo, useState} from "react";
import AuthContext from "../context/auth-context";
import {useTable, usePagination, useGlobalFilter, useAsyncDebounce, useFilters, useSortBy } from "react-table";
import Card from "../UI/Card";
import {Link} from "react-router-dom";
import EditProfile from "../modals/EditProfile";
import EditUser from "../modals/EditUser";
import { ChevronDoubleLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleRightIcon } from '@heroicons/react/solid'


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
            <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                name={id}
                id={id}
                value={filterValue}
                onChange={e => {
                    setFilter(e.target.value || undefined)
                }}
            >
                <option value="">Search User by {render("Header")}</option>
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


const AllUsersListMobile = (props) => {

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
                <span className="text-gray-700 font-bold">Users: </span>
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


    const handleAction = (userId, action, name) => {
        setSelectedId(userId);
        setSelectedName(name);
        setActionType(action);
        if (action === 'assign class') {
            setAssignModal(true);
        }
        if (action === 'activate') {
            setActivateModal(true);
        }
        if (action === 'deactivate') {
            setDeactivateModal(true);
        }
    }


    const HandleUsersCell = (row) => {
        let isActive = false;
        let isStudent = false;
        let[showSelector, setShowSelector] = useState(false);
        if (row.original.active === 'Y') {
            isActive = true;
        }
        if (row.original.roles) {
            if (row.original.roles.includes('student')) {
                isStudent = true;
            }
        }
        return (
                <div>
                    {!showSelector && <button onClick={() => {setShowSelector(true)}}><span style={{font: "40px arial"}}>...</span></button>}
                    {showSelector && <> {isStudent &&
                         <>
                             <button onClick={() => {handleAction(row.original.userId, 'assign class', row.original.name)}}>Attendance Register</button><p></p>
                             <button onClick={() => {handleAction(row.original.userId, 'assign class', row.original.name)}}>Assign Class</button><p></p>
                             <button onClick={() => {handleAction(row.original.userId, 'assign class', row.original.name)}}>Create Report</button><p></p>
                             <button onClick={() => {handleAction(row.original.userId, 'assign class', row.original.name)}}>Mark Attendance</button><p></p>
                        </>
                    }
                        {isActive ? <><button onClick={() => {handleAction(row.original.userId, "deactivate", row.original.name)}}>Deactivate</button><p></p></> : <>  <button onClick={() => {handleAction(row.original.userId, 'activate' , row.original.name)}}>Activate</button> <p></p> </>}
                        <button onClick={() => {handleAction(row.original.userId, "deactivate", row.original.name)}}>Profile</button>
                        <button onClick={() => {handleAction(row.original.userId, "deactivate", row.original.name)}}>Others</button>
                    </>}
            </div>
        )
    }

    const styleUserId = (row) => {
        return (
            <></>
               )
    }

    const hideColumn = (row) => {
        return (
            <></>
        )
    }

    const[assignModal, setAssignModal] = useState(false);
    const[activateModal, setActivateModal] = useState(false);
    const[deactivateModal, setDeactivateModal] = useState(false);
    const[selectedId, setSelectedId] = useState('');
    const[selectedName, setSelectedName] = useState('');
    const[actionType, setActionType] = useState('');
    const [showParam, setShowParam] = useState(false)
    const {allUserList} = useContext(AuthContext);

    const columns = useMemo(
        () => [
            {
                Header: 'User Id',
                accessor: 'userId',
                Cell: ({row}) => hideColumn(),
            },
            {
                Header: 'Name',
                accessor: 'name',
                Filter: SelectColumnFilter,
            },
            {
                Header: 'Class',
                accessor: 'class',
                Filter: SelectColumnFilter,
                Cell: ({row}) => hideColumn(),
            },
            {
                Header: 'Email',
                accessor: 'email',
                Cell: ({row}) => hideColumn(),
            },
            {
                Header: 'Phone',
                accessor: 'mobileNumber',
                Cell: ({row}) => hideColumn(),
            },
            {
                Header: "Gender",
                accessor: 'gender',
                Filter: SelectColumnFilter,
                Cell: ({row}) => hideColumn(),
            },
            {
                Header: "Role",
                accessor: 'roles',
                Filter: SelectColumnFilter,
                Cell: ({row}) => hideColumn(),
            },
            {
                Header: 'Actions',
                accessor: 'action',
                Cell: ({row}) => HandleUsersCell(row),
            },
        ],
        []
    )

    const data = useMemo(() => allUserList, []);
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
        <Card>
            <div className="flex gap-x-2">


                { !showParam ?
                    <label className="flex gap-x-2 items-baseline">
                        <span className="text-gray-700 font-bold">Users: </span>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        value=""
                        placeholder="Search Users by ......."
                        onFocus={() => {
                               setShowParam(!showParam)
                        }}
                    />
                    </label>
                :
                <>

                    <table>
                         <span id='close'
                               onClick={() => {setShowParam(false)}}>
                        close
                    </span>
                {headerGroups.map((headerGroup) =>
                    headerGroup.headers.map((column) =>
                        column.Filter ? (
                           <tr><td key={column.id}>
                                <label htmlFor={column.id}></label>
                                {column.render("Filter")}
                            </td></tr>
                        ) : null

                    )
                )}
                </table>
                </>
                }
            </div>
            <div>
                <table {...getTableProps()}  id='usersList' className="min-w-full divide-y divide-gray-200">
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
                                            <p className="text-gray-900 whitespace-no-wrap"> {cell.render('Cell')}</p>
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                    </tbody>
                </table>




                {/*<table><tr><td><button className="text-sm  hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l" onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</button></td>*/}
                {/*     <td><button className="text-sm  hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l" onClick={() => nextPage()} disabled={!canNextPage}>Next</button></td></tr></table>*/}

                {/* Pagination */}
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
            { assignModal && <EditUser userId={selectedId} name={selectedName}  type={actionType} closeModal={() =>{setAssignModal(false)}}/>}
            { activateModal && <EditUser userId={selectedId} name={selectedName} type={actionType} closeModal={() =>{setActivateModal(false)}}/>}
            { deactivateModal && <EditUser userId={selectedId} name={selectedName} type={actionType} closeModal={() =>{setDeactivateModal(false)}}/>}
        </Card>
    );
};

export default AllUsersListMobile;