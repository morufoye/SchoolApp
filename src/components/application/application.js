import React, {useContext, useEffect, useState} from 'react'
import ParentForm from './parent-form'
import RegistrationCard from './registration-card'
import StudentRegistrationForm from './student-form'
import AuthContext from "../context/auth-context";
import {useApplication} from "./application-context";


export default function ApplicationHome (){
    const{registerParent, registerStudent, isAuthenticated} = useContext(AuthContext);
    const {setRegData, setRegStep, regData, regStep } = useApplication();
    const[summary, setSummary] = useState([]);
    let parentResponse = {};
    let regSummary = [];
    let data = {};
    let userInput = {};

    const  handleSubmit = async ()=>{
       for (let i = 0; i < regData.length; i++) {
          // let parent_id = '';
          if ( i === 0) {
              console.log("this is the parent Object ", regData[i]);
              userInput = {
                  "name" : regData[i].name,
                  "role" : regData[i].role,
                  "address": regData[i].address,
                  "email": regData[i].email,
                  "mobileNumber": regData[i].mobileNumber
              }
            parentResponse =     await registerParent({
                  variables: {userInput},
              });

              regSummary.push({ "name" : parentResponse.data.registerParent.user.name, "id" : parentResponse.data.registerParent.user.userId});
          } else {
              console.log("this is a student Object ", regData[i]);
              userInput = {
                     "name" : regData[i].name,
                     "role" : regData[i].role,
                     "dob" : regData[i].dob,
                     "gender": regData[i].gender,
                     "address": regData[0].address,
                     "email": regData[0].email,
                     "mobileNumber": regData[0].mobileNumber,
                     "parent_id": parentResponse.data.registerParent.user.userId
               }
              console.log("this is a modified student Object ", data);
             const newStudent =  await registerStudent({
                  variables: {userInput},
              });
              regSummary.push({ "name" : newStudent.data.registerStudent.user.name, "id" : newStudent.data.registerStudent.user.userId});
          }
       }
       setSummary(regSummary);
       setRegData([])
        setRegStep("final")
    }

    const handleStartNew = ()=>{
        setRegData([])
        setRegStep(1)
    }

    useEffect(()=>{
        return handleStartNew()
    },[])


    return <div className="max-w-md mx-auto">
        <div className="max-w-7xl mx-auto my-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {!isAuthenticated ?  <span className="block">{regStep !== "final"? "Ready to join us": "Registration "}</span> : <span className="block">Parents and Students </span>}
            {!isAuthenticated  ? <span className="block text-2xl  text-indigo-600">{regStep !== "final"? "Start your application": "successful!!!"}</span> : <span className="block text-2xl  text-indigo-600">{regStep !== "final"? "Start registration": "successful!!!"}</span>}
        </h2>
        </div>
        
        <div className="w-full max-w-md">
            <ul>
                {regData && regData.map((data, index)=> 
                    <li key={index} >
                        <RegistrationCard 
                            data={data} 
                            index={index}
                            regData={regData}
                            setRegData={setRegData}
                        />
                    </li>
                )}
            </ul>
            {regStep === 1 &&
            <ParentForm regData={regData} setRegData={setRegData} setRegStep={setRegStep}/>
            }

            {regStep === 2 &&
            <StudentRegistrationForm regData={regData} setRegData={setRegData} setRegStep={setRegStep}/>
            }

            {regStep === 3 &&
            <>
                <button 
                    className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 mb-3 rounded focus:outline-none focus:shadow-outline" 
                    type="button"
                    onClick={()=>setRegStep(2)}
                >
                    Add more student
                </button>

                <button 
                    className="bg-blue-700 w-full hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                    type="button"
                    onClick={handleSubmit}
                >
                    Submit application
                </button>
            </>
            }

            {regStep === "final" &&
            <div className=" p-4 w-full items-center bg-white shadow-md border border-gray-200 rounded-lg mb-2">
                <h2 className="font-extrabold tracking-tight text-gray-900 mb-3" >Thanks for submitting your application</h2>
                
                <p> Our representative will get back to you as soon as possible </p>

                   <p>Below is your registration summary</p>
                    <table>
                        <thead className="font-extrabold tracking-tight text-gray-900 mb-3" >
                            <td>Name</td><td>User Id</td>
                        </thead>
                        <tbody>
                    {summary.map((summary) =>(<tr key={summary.id}>
                        <td>{summary.name}</td><td className="font-extrabold">{summary.id}</td>
                    </tr>))
                    }
                        </tbody>
                    </table>
                <p 
                onClick={()=>alert("Navigating to resources")}
                className="text-red-400 my-5"
                >Click here to check our resources</p>

           

            <button 
                className="bg-blue-400 w-full hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                type="button"
                onClick={handleStartNew}
            >
                Start new registration
            </button>

            

            </div>
            }

        </div>
    </div>
    
}