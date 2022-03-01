import CreateUser from "../modals/EditProfile";
import {useContext, useEffect, useMemo, useRef, useState} from "react";
import AuthContext from "../context/auth-context";
import {useTable, usePagination, useGlobalFilter, useAsyncDebounce, useFilters, useSortBy } from "react-table";
import Card from "../UI/Card";

import Popover from "@material-tailwind/react/Popover";
import PopoverContainer from "@material-tailwind/react/PopoverContainer";
import PopoverHeader from "@material-tailwind/react/PopoverHeader";
import PopoverBody from "@material-tailwind/react/PopoverBody";

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


const AllUsersList = (props) => {

    const[editUserModal, setEditUserModal] = useState(false);
    const[selectedId, setSelectedId] = useState('');
    const[selectedName, setSelectedName] = useState('');
    const[actionType, setActionType] = useState('');
    const {allUserList, updateAllUsersList} = useContext(AuthContext);
    const[currentClass, setCurrentClass] = useState();

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


    const handleAction = (row, action) => {
        setCurrentClass(row.original.class);
        setSelectedId(row.original.userId);
        setSelectedName(row.original.name);
        setActionType(action);
        setEditUserModal(true);
    }

    const HandleUsersCell = (row) => {
        let isActive = false;
        let isStudent = false;
        const buttonRef = useRef();
        if (row.original.active === 'Y') {
            isActive = true;
        }
        if (row.original.roles) {
            if (row.original.roles.includes('student')) {
                isStudent = true;
            }
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
                        {isStudent &&
                        <>
                            <span onClick={() => {handleAction(row,  'view report')}}>View Reports</span><p></p>
                            <span onClick={() => {handleAction(row, 'assign class')}}>Assign Class</span><p></p>
                            <span onClick={() => {handleAction(row,  'create report')}}>Create Report</span><p></p>
                            <span onClick={() => {handleAction(row, 'mark attendance')}}>Mark Attendance</span><p></p>
                        </>
                        }
                        {isActive ? <><span onClick={() => {handleAction(row, "deactivate")}}>Deactivate</span><p></p></>
                            : <>  <span onClick={() => {handleAction(row, 'activate')}}>Activate</span> <p></p> </>}
                        <span onClick={() => {handleAction(row, "profile")}}>Profile</span><p></p>
                        <span onClick={() => {handleAction(row, "otherss")}}>Others</span>
                    </>
                </PopoverBody>
            </PopoverContainer>
        </Popover>
            </>
        )
    }



    const styleUserId = (row) => {
        let textStyle = {};
        if (row.original.active === 'Y') {
            textStyle = {
                font: "15px arial, san-serif",
                color: "green",
            };
        } else {
            textStyle = {
                color: "red",
                font: "15px arial, san-serif",
            };
        }
        return (
            <span style={textStyle}>
               {row.original.userId}
            </span>
        )
    }

    const columns = useMemo(
        () => [
            {
                Header: 'User Id',
                accessor: 'userId',
                Cell: ({row}) => styleUserId(row),
            },
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Class',
                accessor: 'class',
                Filter: SelectColumnFilter,
            },
            {
                Header: 'Email',
                accessor: 'email',
            },
            {
                Header: 'Phone',
                accessor: 'mobileNumber',
            },
            {
                Header: "Gender",
                accessor: 'gender',
                Filter: SelectColumnFilter,
            },
            {
                Header: "Role",
                accessor: 'roles',
                Filter: SelectColumnFilter,
            },
            {
                Header: 'Actions',
                accessor: 'action',
                Cell: ({row}) => HandleUsersCell(row),
            },
        ],
        []
    )

    const handleChange = () => {
        updateAllUsersList();
        document.getElementById('refreshList').click();
        setEditUserModal(false);
    }

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
            <header>
                <h2>All Users</h2>
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
            { editUserModal && <EditUser userId={selectedId} name={selectedName}  type={actionType} closeModal={handleChange} currentClass={currentClass}/>}
        </Card>
    );
};

export default AllUsersList;