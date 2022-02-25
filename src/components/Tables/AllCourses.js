import CreateUser from "../modals/EditProfile";
import {useContext, useEffect, useMemo, useState, Fragment, useRef } from "react";
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


const AllCourses = (props) => {
    const {allCourses} = useContext(AuthContext)

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

    const assignCourse = (row) => {

    }

    const modify = (row) => {

    }

    const HandleAction = (row) => {
        const buttonRef = useRef();
        return (
            <>
                <button  ref={buttonRef} ripple="light">
                    <span style={{font: "40px arial"}}>....</span>
                </button>
                <Popover placement="bottom" ref={buttonRef}>
                    <PopoverContainer>
                        <PopoverBody>
                            <>
                                <p><button onClick={() => {assignCourse(row)}}>Assign</button></p>
                                <p><button onClick={() => {modify(row)}}>Modify</button></p>
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
                Header: 'Title',
                accessor: 'title',
            },
            {
                Header: 'Code',
                accessor: 'code',
                Filter: SelectColumnFilter,
            },
            {
                Header: 'Description',
                accessor: 'description',
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

    const data = useMemo(() => allCourses, []);
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

            <Card>
                <header>
                    <h2>All Courses</h2>
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


            {
            }

        </Fragment>
    );
};

export default AllCourses;