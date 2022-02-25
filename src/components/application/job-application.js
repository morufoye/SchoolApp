import React, {useContext, useEffect, useState} from 'react'
import AuthContext from "../context/auth-context";
import axios from "axios";



export default function JobApplication (){
    const initData = {"name":"", "phone":"", "email":"", "address": "", "major":"",  "qualification": ""}
    const[userInput, setUserInput] = useState(initData);
    const{registerJobApplicant, uploadedFileUrl} = useContext(AuthContext)
    const[submitted, setSubmitted] = useState(false)

    const labelClass= "block text-gray-700 text-sm font-bold mb-1 mt-2"
    const inputClass= "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"

    const formData = [
        {name: "name", label: "Name", placeholder: "Enter fullname", id:"name", type:"text", value: userInput.name, tag:"input"},
        {name: "phone", label: "Phone number", placeholder: "Enter mobile number", id:"phone", type:"text", value: userInput.mobileNumber, tag:"input"},
        {name: "email", label: "Email", placeholder: "Enter email", type:"email", id:"email", value: userInput.email, tag:"input"},
        {name: "address", label: "Address", placeholder: "Enter address", id:"address", type:"textarea", value: userInput.address, tag:"textarea"},
        {name: "major", label: "Major", placeholder: "Field of Study", id:"major", type:"text", value: userInput.major, tag:"input"},
  ]

    const onChange =(e) =>{
            uploadFile(e, userInput.name)
        console.log(" #############  " + userInput.resumeUrl)
    }


    const handleChange=(e)=>{
        const name = e.target.name;
        setUserInput({...userInput,
            [name]: e.target.value
        });
    }

    const handleSubmit = async () => {
     await registerJobApplicant({variables: {"userInput" : userInput}, })
        setSubmitted(true)
    }

    const uploadFile = (event, name) => {
        event.preventDefault();
        let pix = event.target.files[0];
        let fileName = document.getElementById('resume').value;
        if (fileName.includes('fakepath')) {
            fileName = fileName.substring(12, fileName.length)
        }
        try {
            const formData = new FormData();
            formData.append("file", pix, name);
            const config = {
                headers: {
                    "content-type": "multipart/form-data"
                }
            };
            const url =  "http://localhost:8080/uploadFile/"+ fileName;
            axios.post(url, formData, config).then((response) => response.data
            ).then((data) => {
                console.log(JSON.stringify(data));
                setUserInput({...userInput, "resumeUrl" : data.fileDownloadUri});
            }).catch((error) => console.log(error.message));
        } catch(error) {
            console.error(error);
        }
    };

    useEffect(()=>{
    },[])


    return <div className="max-w-md mx-auto">
        { !submitted ? <>
        <div className="max-w-7xl mx-auto my-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                <span className="block">Please provide the following information</span>

            </h2>
        </div>

        <div className="w-full max-w-md">
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

                </div>
            )}
            <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="gender"
            >
                Qualification<span className="text-red-600">*</span>
            </label>
            <select  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                     placeholder="select role" value={userInput.qualification}  name = "qualification" onChange={(e)=>handleChange(e)}>
                <option value=""></option>
                <option value="PhD">PhD</option>
                <option value="Masters">Masters</option>
                <option value="Bachelors">Bachelors</option>
                <option value="HND">HND</option>
                <option value="OND">OND</option>
                <option value="NCE">NCE</option>
            </select>

            <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="gender"
            >
                Upload Resume<span className="text-red-600">*</span>
            </label>
            <input type="file"
                   id="resume"
                   required onChange={(e) => {onChange(e)}} />
            <button
                className="bg-green-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleSubmit}
            >
                Submit
            </button>
        </div>

        </> : <><div className=" p-4 w-full items-center bg-white shadow-md border border-gray-200 rounded-lg mb-2">
            <h2 className="font-extrabold tracking-tight text-gray-900 mb-3" >Thanks for submitting your application</h2>

            <p> Our representative will get back to you as soon as possible </p>
            </div>
        </>}
    </div>

}