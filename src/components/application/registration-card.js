import React from 'react'
import { PencilIcon, XIcon } from '@heroicons/react/solid'
import { useApplication } from './application-context'

export default function RegistrationCard({data, index}){

    const {setRegData, regData, setRegStep, setIndexToEdit } = useApplication()

    const handleDelete =(index)=>{
        regData.splice(index, 1)
        setRegData([...regData])
    }

    const handleEdit=(index)=>{
        setIndexToEdit(index)
        if(regData[index].role === "parent") setRegStep(1)
        if(regData[index].role === "student") setRegStep(2)
    }


    return(
            <div className="flex w-full items-start bg-white shadow-md border border-gray-200 rounded-lg mb-2">
                <div className="p-2 w-full">
                    <span className="text-gray-900 font-bold tracking-tight mb-2">{data.name} </span>
                    {data.mobileNumber && <span className="font-normal text-gray-700 mb-3">{data.mobileNumber} </span>}
                    <br className="hidden "/>{data.address && <span className="font-normal text-gray-700 mb-3">{data.address}</span>}
                    {data.email && <span className="font-normal text-gray-700 mb-3">{data.email} </span>}
                    {data.dob && <span className="font-normal text-gray-700 mb-3">{data.dob} </span>}
                    {data.gender && <span className="font-normal text-gray-700 mb-3">{data.gender} </span>}
                    
                </div>
                <button 
                    onClick={()=>handleEdit(index)}
                    className="bg-white-700 hover:bg-gray-200 focus:ring-4 focus:ring-blue-300 font-medium m-1 rounded-lg text-sm px-1 py-1 text-center inline-flex items-center">
                        <PencilIcon className="h-5 w-5" aria-hidden="true"/>
                </button>
                {data.role === "student" &&
                <button 
                    onClick={()=>handleDelete(index)}
                    className="bg-white-700 hover:bg-gray-200 focus:ring-4 focus:ring-blue-300 font-medium m-1 rounded-lg text-sm px-1 py-1 text-center inline-flex items-center">
                        <XIcon className="h-5 w-5" aria-hidden="true"/>
                </button>
                }
                
                
            </div>
           
    )
}