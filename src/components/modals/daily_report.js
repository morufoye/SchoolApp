import Modal from "../UI/Modal";
import React, {useEffect} from "react";

const DailyReport = (props) => {
     let user = {};
    const labelClass= "block text-gray-700 text-sm font-bold mb-1 mt-2"
    const inputClass= "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  const formData = [
        {name: "userId", label: "User Id", id:"userId", type:"text", value: props.reportObject.userId , tag:"input"},
        {name: "name", label: "Name", id:"name", type:"text", value: props.reportObject.name, tag:"input",readOnly:true},
        {name: "reporDate", label: "Report Date", id:"report_date", type:"text", value: props.reportObject.report_date, tag:"input"},
        {name: "adaab", label: "Adaab", id:"adaab", type:"text", value: props.reportObject.adaab , tag:"input"},
        {name: "hifz", label: "Hifz", id:"userId", type:"hifz", value: props.reportObject.hifz , tag:"input"},
        {name: "Murajah", label: "Murajah", id:"murajah", type:"text", value: props.reportObject.murajah , tag:"input"},
        {name: "Comment", label: "Comment", id:"comment", type:"text", value: props.reportObject.comment, tag:"input"},
        {name: "Other Comment", label: "Other Comment", id:"otherComment", type:"text", value: props.reportObject.other_comment, tag:"input"}
    ]

    useEffect(()=>{
        document.getElementById(props.reportObject.adaab + "adaab").checked = true;
        document.getElementById(props.reportObject.hifz + "hifz").checked = true;
        document.getElementById(props.reportObject.murajah + "murajah").checked = true;
    }, [])

    const handleCheckBoxChange=(e)=> {
        let name = e.target.name;
        let value = e.target.value;
        document.getElementById(value + name).checked = false;
        document.getElementById(props.reportObject.adaab + "adaab").checked = true;
        document.getElementById(props.reportObject.hifz + "hifz").checked = true;
        document.getElementById(props.reportObject.murajah + "murajah").checked = true;
    }

    return (

        <Modal onClose={props.onClose}>
            <div className="max-w-md mx-auto">
                <div className="w-full max-w-md">
                    <div className="max-w-7xl mx-auto py-1 align-center">
                        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            <span className="block text-blue-600">Daily Report </span>
                        </h2>
                    </div>

                    <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Name</td>
                            <td>{props.reportObject.name}</td>
                        </tr>

                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Report Date</td>
                            <td>{props.reportObject.report_date}</td>
                        </tr>
                        </tbody>
                    </table>

                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-bold text-gray-500  tracking-wider"
                            >
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-bold text-gray-500  tracking-wider"
                            >
                                Poor
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-bold text-gray-500  tracking-wider"
                            >
                                Good
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-bold text-gray-500  tracking-wider"
                            >
                                Great
                            </th>

                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">

                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                                Adaab<br/>(Manners)
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                                <input type="checkbox" id="pooradaab" name="adaab" value="poor"  onClick={(event) => {handleCheckBoxChange(event)}} readOnly="readonly"/>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                                <input type="checkbox" id="goodadaab" name="adaab" value="good"   onClick={(event) => {handleCheckBoxChange(event)}} readOnly="readonly"/>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <input type="checkbox" id="greatadaab" name="adaab" value="great"   onClick={(event) => {handleCheckBoxChange(event)}} readOnly="readonly"/>
                            </td>
                        </tr>


                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                                Hifz<br/>(New Read)
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                                <input type="checkbox" id="poorhifz" name="hifz" value="poor" onClick={(event) => {handleCheckBoxChange(event)}} />
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                                <input type="checkbox" id="goodhifz" name="hifz" value="good" onClick={(event) => {handleCheckBoxChange(event)}}/>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <input type="checkbox" id="greathifz" name="hifz" value="great" onClick={(event) => {handleCheckBoxChange(event)}}/>
                            </td>
                        </tr>


                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                                Murajah<br/>(Revision)
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                                <input type="checkbox" id="poormurajah" name="murajah" value="poor" onClick={(event) => {handleCheckBoxChange(event)}}/>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                                <input type="checkbox" id="goodmurajah" name="murajah" value="good" onClick={(event) => {handleCheckBoxChange(event)}}/>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <input type="checkbox" id="greatmurajah" name="murajah" value="great" onClick={(event) => {handleCheckBoxChange(event)}}/>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Comment</td>
                            <td>{props.reportObject.comment}</td>
                        </tr>
                        </tbody>
                    </table>
                    <table align = 'center'>
                        <tr><td><textarea className="w-96"   value={props.reportObject.other_comment} /></td></tr>
                    </table>
                    </div>
            </div>
        </Modal>
    );
};
export default DailyReport;