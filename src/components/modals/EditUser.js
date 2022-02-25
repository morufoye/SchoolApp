import {useContext} from 'react';
import Modal from "../UI/Modal";
import AuthContext from "../context/auth-context";
import Card from "../UI/Card";
import {getCurrentDate} from "./DateUtills";

const EditUser = (props) => {
    const {updateClass, activateDeactivate, markAttendanceCommit} = useContext(AuthContext);
    let user= {"name" :props.name, "userId":props.userId, "presentClass" : props.currentClass};
    let newClass = '';
    let userId = props.userId;
    let userInput = {}
    let dailyReport = {"userId" : props.userId, other_comment: ""};

    const labelClass= "block text-gray-700 text-sm font-bold mb-1 mt-2"
    const inputClass= "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"

    const handleChange=(e)=>{
        const field_name = e.target.name;
        const field_value = e.target.value;
      if (field_name === 'class') {
          newClass = e.target.value;
          user = {...user, "class": field_value}
      }
      if (field_name === 'dailyReportComment') {
          dailyReport = {...dailyReport, "comment": field_value}
      }
      if (field_name === 'dailyRepOtherComment') {
            dailyReport = {...dailyReport, "other_comment": field_value}
      }
        console.log('daily report so far ......' + JSON.stringify(dailyReport));

    }

    const handleCheckBoxChange=(e)=>{
       let name = e.target.name;
       let value = e.target.value;
       let grades = ['poor', 'good', 'great']
        document.getElementById(value + name).checked = true;

       if (name === 'adaab') {
           dailyReport = {...dailyReport, 'adaab':value}
       }
        if (name === 'hifz') {
            dailyReport = {...dailyReport, 'hifz':value}
        }
        if (name === 'murajah') {
            dailyReport = {...dailyReport, 'murajah':value}
        }

        console.log('daily report so far ......' + JSON.stringify(dailyReport));
       for (let i in grades) {
           if (grades[i] !== value) {
               document.getElementById(grades[i] + name).checked = false;
           }
       }

    }

    const  assignClass = async (event) => {
        event.preventDefault();
        const data = {"userId" : userId, "newClass": newClass}
        await updateClass({
            variables: {...data},
        });
        props.closeModal()
    }

    const  markAttendance = async (event) => {
        userInput = dailyReport;
        event.preventDefault();
        await markAttendanceCommit({
            variables: {userInput},
        });
        props.closeModal()
    }

    const  activateUser = async (event, active) => {
        event.preventDefault();
        let data = {"userId" : userId, "active": 'Y'}
        if (active === 'N') {
            data = {"userId" : userId, "active": 'N'}
        }
        await activateDeactivate({
            variables: {...data},
        });
        props.closeModal();
    }


    const formData = [
        {name: "userId", label: "User Id", id:"userId", type:"text", value: user.userId , tag:"input"},
        {name: "name", label: "Name", id:"name", type:"text", value: user.name, tag:"input"},
        {name: "presentClass", label: "Current Class", id:"presentClass", type:"text", value: user.presentClass, tag:"input"}
    ]

    const closeModal = () => {
        props.closeModal();
    }
    return (
            <Modal onClose={closeModal}>
            <div className="max-w-md mx-auto">
                <div className="w-full max-w-md">
                    <form className="bg-white shadow-md rounded p-1 my-1 mb-4">
                        <div className="mb-4 px-4">
                            <div className="max-w-7xl mx-auto py-1 align-center">
                                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-1xl">
                                    {  props.type === 'assign class' && <span className="block text-blue-600">Assign Class</span>}
                                    {  props.type === 'activate' && <span className="block text-blue-600">Activate User</span>}
                                    {  props.type === 'deactivate' && <span className="block text-blue-600">Deactivate User</span>}
                                    {  props.type === 'mark attendance' && <span className="block text-blue-600">Daily Report   ({getCurrentDate()})</span>}
                                </h2>
                            </div>


                            {/*{formData.map(data => data.value)}*/}
                            <div><span className="font-bold">{props.userId}</span>{'/'}<span className="font-bold">{props.name}</span>{'/'}<span className="font-bold">{props.currentClass}</span></div>
                            {
                                props.type === 'assign class' &&
                            <>
                            <label className={labelClass}>New Class</label>
                            <select  className={inputClass} value={user.class} name = "class"  onChange={handleChange}>
                                <option value=""></option>
                                <option value="class 1">class 1</option>
                                <option value="class 2">class 2</option>
                                <option value="class 3">class 3</option>
                                <option value="class 4">class 4</option>
                            </select>
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                    onClick={assignClass}
                                >
                                    Submit
                                </button>
                            </>
                            }

                            {
                                props.type === 'activate' &&
                                <>
                                <label className={labelClass}>Are you sure you want to activate this user? Click 'OK' to continue</label>
                                   <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                       type="button"
                                       onClick={(e)=>{activateUser(e, 'Y')}}> OK </button>
                                </>
                            }

                            {
                                props.type === 'deactivate' &&
                                <>
                                    <label className={labelClass}>Are you sure you want to deactivate this user? Click 'OK' to continue</label>
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                            type="button"
                                        onClick={(e)=>{activateUser(e, 'N')}}> OK </button>
                                </>
                            }

                            {
                                props.type === 'mark attendance' &&
                                <>
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
                       <input type="checkbox" id="pooradaab" name="adaab" value="poor" onClick={(event) => {handleCheckBoxChange(event)}}/>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                       <input type="checkbox" id="goodadaab" name="adaab" value="good" onClick={(event) => {handleCheckBoxChange(event)}}/>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                       <input type="checkbox" id="greatadaab" name="adaab" value="great" onClick={(event) => {handleCheckBoxChange(event)}}/>
                                        </td>
                                     </tr>


                                     <tr>
                                         <td className="px-6 py-4 whitespace-nowrap">
                                             Hifz<br/>(New Read)
                                         </td>

                                         <td className="px-6 py-4 whitespace-nowrap">
                                             <input type="checkbox" id="poorhifz" name="hifz" value="poor" onClick={(event) => {handleCheckBoxChange(event)}}/>
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
                                        </tbody>
                                    </table>
                                    <table align = 'center'>
                                        <tr><td className={labelClass} align ="center">Comment</td></tr>
                                        <tr><td><select className="w-96" name="dailyReportComment" onChange={handleChange}>
                                            <option value="">Select most fit ...........</option>
                                            <option value="Satisfactory">Satisfactory</option>
                                            <option value="unsatisfactory">Unsatisfactory</option>
                                        </select></td></tr>
                                        <tr><td><textarea className="w-96"   name="dailyRepOtherComment" placeholder = "More comment if any ..."  onChange={handleChange}/></td></tr>
                                    </table>
                                    <div align="center">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-80"
                                        type="button"
                                        onClick={markAttendance}
                                    >
                                        Submit
                                    </button>
                                    </div>
                                </>
                            }

                        </div>
                    </form>
                </div>
            </div>
            </Modal>
    );
};

export default EditUser;