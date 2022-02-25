import React, {useState, useEffect, useContext} from 'react'
import { useApplication } from './application-context'
import AuthContext from "../context/auth-context";

const initData = {role: "parent", address:"", email:"", name:"", mobileNumber:""}


export default function ParentForm(){

    const {setRegData, setRegStep, regData, indexToEdit, setIndexToEdit } = useApplication();
    const{registerParent, registerStudent} = useContext(AuthContext);
    const [parent, setParent]=useState(initData)

    const labelClass= "block text-gray-700 text-sm font-bold mb-1 mt-2"
    const inputClass= "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    
    const formData = [
        {name: "name", label: "Name", placeholder: "Enter fullname", id:"parentFullname", type:"text", value: parent.name, tag:"input"},
        {name: "mobileNumber", label: "Phone number", placeholder: "Enter mobile number", id:"parentFullname", type:"text", value: parent.mobileNumber, tag:"input"},
        {name: "email", label: "Email", placeholder: "Enter email", type:"email", id:"email", value: parent.email, tag:"input"},
        {name: "address", label: "Address", placeholder: "Enter address", id:"address", type:"textarea", value: parent.address, tag:"textarea"},
    ]

    const [error, setError]= useState([])

    const validForm=(forData)=>{
        const errorHere = []
        for (const [key, value] of Object.entries(forData)) {
            if(value === "") errorHere.push(key)
          }
          setError([...error, ...errorHere])
          return errorHere.length > 0?  false: true
    }


    const handleReset =()=>{
        setError([])
        setParent({role: "parent", address:"", email:"", name:"", mobileNumber:""})
    }

    const handleChange=(e)=>{
        setError([])
        const name = e.target.name;
        setParent({...parent,
          [name]: e.target.value
        });
    }
    
    const handleNext =  ()=>{
        if (validForm(parent)){
            setRegData([...regData, parent])
            setRegStep(2)
        }
    }

    const handleSaveEdit =()=>{
        if (validForm(parent)){
           regData.splice(indexToEdit, 1, parent)
           console.log(regData)
        setRegData(regData)
        setIndexToEdit()
        setRegStep(2)}
    }

    useEffect(()=>{
        if(indexToEdit !== undefined){
            setParent(regData[indexToEdit])
        }
    },[indexToEdit])

    return <form className="bg-white shadow-md rounded p-1 my-1 mb-4">
                <div className="mb-4 px-4">
                    <div className="max-w-7xl mx-auto py-1 align-center">
                        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            <span className="block text-blue-600">Parent </span>
                        </h2>
                    </div>
                    
                    {formData.map(data =>
                        <div key={data.name}>
                            <label 
                                className={labelClass} 
                                htmlFor={data.id}
                            >
                                {data.label}<span className="text-red-600">*</span>
                            </label>
                            <data.tag 
                                name={data.name}
                                onChange={(e)=>handleChange(e)}  
                                className={inputClass}
                                id={data.id} 
                                type={data.type}
                                placeholder={data.placeholder}
                                value={data.value}
                            />
                            {error.includes(data.name) && <p className="text-red-400">This is required </p>}

                        </div>
                    )}
                     {indexToEdit !== undefined? 
                    <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                        type="button"
                        onClick={handleSaveEdit}
                    >
                        Save Edit
                    </button>:
                    <>
                    <div className="flex items-center justify-between mt-2">
                        <button 
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                            type="button"
                            onClick={handleNext}
                        >
                            Next
                        </button>
                        <button 
                            className="bg-green-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                            type="button"
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                    </div>
                    </>
                    }
                    
                </div>
            </form>
}