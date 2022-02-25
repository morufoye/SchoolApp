import {forwardRef, useContext, useRef} from "react";
import AuthContext from "../context/auth-context";
import {getCurrentDate} from "../modals/DateUtills";
import React from "react";


const ref = React.createRef();
const StaffCodeOfConduct =  React.forwardRef(({options,  reset}, ref) => {
    return (
        <div className="sm:py-0 md:py-20 ">
            <div className="max-w-7xl mx-auto">
                <main>
                    <div className="sm:text-center">
                        <h1 className="tracking-tight font-extrabold text-gray-900 sm:text-2xl">
                            <span ><u>Staff Code of Conduct</u></span>
                        </h1>
                        <br></br>
                        <b>Acknowledgment</b><br></br><br></br>
                        By signing this Acknowledgement,you are agreeing to abide by this Staff Code of
                        Conduct to the best of your ability and acknowledge that you understand that
                        breaches of this Staff Code of Conduct will be taken seriously and could result
                        disciplinary action or in termination of your employment.<br></br><br></br>
                        Please sign and date your Acknowledgement and return to the Administrative Officer
                        within <b>five</b>(5) working days.<br></br>
                        Thank you.<br></br>

                        I
                        <span  className="tracking-tight font-extrabold text-gray-900 sm:text-2xl">
                         <input ref={ref} type="text" placeholder="Enter Full Name" className="ml-2 outline-none py-1 px-2 text-md border-2 rounded-md"/>
                        </span>
                        have read,understood and agree to comply with the
                        terms of this Staff Code of Conduct.<br></br><br></br>

                        <table className="min-w-full divide-y divide-gray-200">
                        <tr><td className="px-6 py-4 whitespace-nowrap">____________________________</td><td className="px-6 py-4 whitespace-nowrap">{getCurrentDate()}</td></tr>
                        <tr><td className="px-6 py-4 whitespace-nowrap">Employee Signature </td><td className="px-6 py-4 whitespace-nowrap">Dated</td>
                        </tr>
                             <tr><td className="px-6 py-4 whitespace-nowrap">_____________________________</td><td className="px-6 py-4 whitespace-nowrap">{getCurrentDate()}</td></tr>
                             <tr><td className="px-6 py-4 whitespace-nowrap">Principal Signature</td><td className="px-6 py-4 whitespace-nowrap">Dated</td></tr>
                        </table>

                    </div>
                </main>
            </div>
        </div>

                        )
})
export default StaffCodeOfConduct;