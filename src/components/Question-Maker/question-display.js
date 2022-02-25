import React, {useEffect, useState} from 'react'

export default function QuestionDisplay({question, questionNumber}){

    const [draggedListObj, setDraggedListObj] = useState({})
    const onDragOver =(e)=>{
        e.preventDefault()
    }
    const onDragStart =(e, option)=>{
        e.dataTransfer.setData("option", option)
    }

    const onDrop=(e, index)=>{
        let option = e.dataTransfer.getData("option")
        e.target.innerHTML = option
        setDraggedListObj({...draggedListObj, [index]: option})
    }

    switch (question.questionType){
        case "multipleChoice":
            return <div>
                <p>{questionNumber}</p>
                <p>{question.question}</p>
                    {question.options.map((option, index)=> 
                    <div key={index}>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="radio"
                        value={option}
                        id={option}
                      />
                      <span className="ml-2">{option}</span>
                    </label>
                  </div>)}
            </div>
        case "multipleOption":
            return <div>
                <p>{questionNumber}</p>
                <p>{question.question}</p>
                    {question.options.map((option, index)=> 
                    <div key={index}>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        name="checkbox"
                        value={option}
                      />
                      <span className="ml-2">{option}</span>
                    </label>
                  </div>)}
            </div>
        case "essay":
            return <div>
                <p>{questionNumber}</p>
                <p>{question.question}</p>
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
                            placeholder="Enter answer"
                            // value={options}
                            // onChange={(e)=>setOptions(e.target.value)}
                        ></textarea>
                    </label>
            </div>
        case "matching":
            return <div>
                <p>{questionNumber}</p>
                <div className="flex flex-direction-row" >
                    {question.options2.map((option, index)=> 
                    <div key={index} 
                    draggable 
                    onDragStart={e=> onDragStart(e, option)}
                    className="mx-1 px-2 bg-gray-200">
                      <span >{option}</span>
                  </div>)}

                </div>
                <div className="flex flex-direction-row">
                    <div className="w-full">
                        {question.options.map((option, index)=> 
                            <div className="flex flex-direction-row my-1 border border-gray-400 p-1" key={index}>
                            <span className="ml-2 w-1/2">{option}</span> 
                            <div
                            className="pl-2 w-1/2 bg-gray-300"
                            onDragOver={e=>onDragOver(e)}
                            onDrop={e=> onDrop(e, index)}
                            >
                                <span className="ml-2">?</span>
                                <br/>
                            </div>
                        </div>)}
                    </div>
                </div>
            </div>
        default:
            return null
    }

}