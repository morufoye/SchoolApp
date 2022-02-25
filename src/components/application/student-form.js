import React, {useEffect, useState} from 'react'
import { useApplication } from './application-context'


const initData = {role: "student", name:"", dob:"", gender:""}

export default function StudentRegistrationForm(){

    const {setRegData, setRegStep, regData, indexToEdit, setIndexToEdit } = useApplication()

    const [error, setError]= useState([])


    const [student, setStudent]=useState(initData)

    const handleChange=(e)=>{
        setError([])
        const name = e.target.name;
        setStudent({...student,
          [name]: e.target.value
        });
    }

    const validForm=(forData)=>{
        const errorHere = []
        for (const [key, value] of Object.entries(forData)) {
            if(value === "") errorHere.push(key)
          }
          setError([...error, ...errorHere])
          return errorHere.length > 0?  false: true
    }
    
    const handleSave =()=>{
        if (validForm(student)){
            setRegData([...regData, student])
            setStudent(initData)
        }
        
    }

    const handleSaveEdit =()=>{
    if (validForm(student)){
        regData.splice(indexToEdit, 1, student)
        setRegData(regData)
        setIndexToEdit()
        setRegStep(3)}
    }


    const handleFinish =()=>{
        setRegStep(3)
    }

    const handleAddMore =()=>{
        if (validForm(student)){
            setRegData([...regData, student])
            setStudent({role: "student", name:"", dob:"", gender:""})
        }
    }

    useEffect(()=>{
        if(indexToEdit !== undefined){
            setStudent(regData[indexToEdit])
        }
    },[indexToEdit])


    return (    <div>
                    <div className="max-w-7xl mx-auto py-0 px-4 sm:px-6 align-center">
                    <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                        <span className="block text-blue-600">Student </span>
                    </h2>
                    </div>
                    
                    <div className="w-full max-w-md">
                        <form className="bg-white shadow-md rounded px-8 pt-2 pb-8 mb-4">
                            <div className="mb-4">
                                <label 
                                className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Name<span className="text-red-600">*</span>
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="name" id="name" type="text" placeholder="Student fullname"
                                onChange={(e)=>handleChange(e)} value={student.name}
                                />
                                {error.includes("name") && <p className="text-red-400">Name is required </p>}
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dob">
                                    Date of birth<span className="text-red-600">*</span>
                                </label>
                                <input 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                id="dob" 
                                name="dob"
                                type="date"
                                onChange={(e)=>handleChange(e)} 
                                value={student.dob} 
                                />
                                {error.includes("dob") && <p className="text-red-400">Date of birth is required </p>}
                            </div>

                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="gender"
                            >
                                Select Gender<span className="text-red-600">*</span>
                            </label>
                            <select  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                     placeholder="select role" value={student.gender}  name = "gender" onChange={(e)=>handleChange(e)}>
                                <option value=""></option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>

                            <div className="flex items-center justify-between">
                            {indexToEdit !== undefined? 
                                <button 
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                    type="button"
                                    onClick={handleSaveEdit}
                                >
                                    Save Edit
                                </button>:
                                <>
                                <button 
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                type="button"
                                onClick={handleSave}
                                >
                                    Save
                                </button>
                                <button 
                                className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                type="button"
                                onClick={handleAddMore}
                                >
                                    Add more
                                </button>
                                <button 
                                className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                type="button"
                                onClick={handleFinish}
                                >
                                    Finish
                                </button>
                                </>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            )
}