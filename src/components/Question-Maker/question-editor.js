import React, {useEffect, useState} from 'react'

const getOptions=(options)=>{
    let output=""
    options.forEach((element, index) => {
        output =  index+1 !== options.length? output + `${element} \n` 
               : output + `${element}`
    });
    return output
}
const QuestionEditor=({questionClone, index, setQuestions, questions})=>{
    const[question, setQuestion] = useState(questionClone?.question)
    const[options, setOptions] = useState("")
    const[options2, setOptions2] = useState("")

useEffect(()=>{
    if(questionClone?.options){
        setOptions(getOptions(questionClone?.options))
    }
    if(questionClone?.options2){
        setOptions2(getOptions(questionClone?.options2))
    }
},[])

    const handleSave=()=>{
        let QuestionObj ={
            ...questionClone,
            mode: "Final"
        }
        if(question){
            QuestionObj["question"] = question
        }
        if(options){
            QuestionObj["options"] = options.split("\n")
        }
        if(options2){
            QuestionObj["options2"] = options2.split("\n")
        }
        setQuestion("")
        setOptions("")
        setOptions2("")
        let questionsClone = [...questions]
        questionsClone[index]= QuestionObj
        setQuestions(questionsClone)
    }

    const button =()=>(
        <button
            className="
                bg-blue-500
                text-white
                active:bg-blue-600
                font-bold
                text-xs
                px-4
                py-2
                m-1
                rounded
                shadow
                hover:shadow-md
                outline-none
                focus:outline-none
                mr-1
                mb-1
                ease-linear
                transition-all
                duration-150
            "
            type="button"
            onClick={handleSave}
            >
            Save
            </button>
    )

    switch(questionClone.questionType){
        case "multipleChoice":
            return <div>
                    <label className="block text-left">
                        <textarea
                            className="form-textarea mt-1 block w-full bg-white bg-white
                            rounded
                            text-sm
                            border border-gray-400
                            outline-none
                            focus:outline-none focus:ring px-2
                            py-1"
                            rows="2"
                            placeholder="Enter question"
                            value={question}
                            onChange={(e)=>setQuestion(e.target.value)}
                        ></textarea>
                    </label>
                    <label className="block text-left">
                        <textarea
                            className="form-textarea mt-1 block w-full bg-white bg-white
                            rounded
                            text-sm
                            border border-gray-400
                            outline-none
                            focus:outline-none focus:ring px-2
                            py-1"
                            rows="4"
                            placeholder="Enter options on each line"
                            value={options}
                            onChange={(e)=>setOptions(e.target.value)}
                        ></textarea>
                    </label>
                    {button()}
                </div>
        case "multipleOption":
            return <div>
                    <label className="block text-left">
                        <textarea
                            className="form-textarea mt-1 block w-full bg-white bg-white
                            rounded
                            text-sm
                            border border-gray-400
                            outline-none
                            focus:outline-none focus:ring px-2
                            py-1"
                            rows="2"
                            placeholder="Enter question"
                            value={question}
                            onChange={(e)=>setQuestion(e.target.value)}
                        ></textarea>
                    </label>
                    <label className="block text-left">
                        <textarea
                            className="form-textarea mt-1 block w-full bg-white bg-white
                            rounded
                            text-sm
                            border border-gray-400
                            outline-none
                            focus:outline-none focus:ring px-2
                            py-1"
                            rows="4"
                            placeholder="Enter options on each line"
                            value={options}
                            onChange={(e)=>setOptions(e.target.value)}
                        ></textarea>
                    </label>
                    {button()}
                </div>
        case "essay":
            return <div> 
                    <label className="block text-left">
                        <textarea
                            className="form-textarea mt-1 block w-full bg-white bg-white
                            rounded
                            text-sm
                            border border-gray-400
                            outline-none
                            focus:outline-none focus:ring px-2
                            py-1"
                            rows="2"
                            placeholder="Enter question"
                            value={question}
                            onChange={(e)=>setQuestion(e.target.value)}
                        ></textarea>
                    </label>
                    {button()}
                 </div>
        case "matching":
            return<div> 
                    <div className="flex flex-direction-row">
                            <div className="w-1/2 mx-1">
                                    Category 1
                                    <textarea
                                    className="form-textarea mt-1 block w-full bg-white bg-white
                                    rounded
                                    text-sm
                                    border border-gray-400
                                    outline-none
                                    focus:outline-none focus:ring px-2
                                    py-1"
                                    rows="4"
                                    placeholder="Enter options on each line"
                                    value={options}
                                    onChange={(e)=>setOptions(e.target.value)}
                                    />
                            </div>
                            <div className="w-1/2 mx-1">
                                    Category 2
                                    <textarea
                                    className="form-textarea mt-1 block w-full bg-white bg-white
                                    rounded
                                    text-sm
                                    border border-gray-400
                                    outline-none
                                    focus:outline-none focus:ring px-2
                                    py-1"
                                    rows="4"
                                    placeholder="Enter options on each line"
                                    value={options2}
                                    onChange={(e)=>setOptions2(e.target.value)}
                                    />
                            </div>
                    </div>
                    {button()}
                </div>
        default:
            return null
    }
}

export default QuestionEditor