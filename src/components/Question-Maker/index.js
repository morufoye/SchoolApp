import {Fragment, useContext, useState} from "react"
import { PencilIcon, XIcon } from '@heroicons/react/solid'
import QuestionBuilder from "./question-builder"
import QuestionDisplay from "./question-display"
import QuestionEditor from "./question-editor"
import AuthContext from "../context/auth-context";
import CourseChooserModal from "../modals/CourseChooserModal";

const QuestionMaker = (props)=>{
    const [questions, setQuestions] = useState([])
    const [questionType, setQuestionType] = useState("")
    const{uploadAssessment, currentUser} = useContext(AuthContext)
    const[title, setTitle] = useState('');

    const toggleMode =(index)=>
    {
        let questionClone = questions[index]
        questionClone.mode="Edit"
        let questionsClone = [...questions]
        questionsClone[index]= questionClone
        setQuestions(questionsClone)
    }

    const handleDelete = (index)=>
    {
        let questionsClone = [...questions]
        questionsClone.splice(index, 1)
        setQuestions(questionsClone)
    }

    const upload = async() =>
    {
        const userInput = {
                           "title": title,
                           "created_by": currentUser.name,
                           "assessment_detail": JSON.stringify(questions)
                          }
        const res = await uploadAssessment({
            variables: {userInput},
        });
        props.closeQuestionBuilder();
    }

    const closeViewer = () => {
        props.closeQuestionBuilder()
    }

    const handleTitleChange = (chTitle) => {
        setTitle(chTitle)
    }

    return(
        <Fragment>
            {
              title === '' &&  <div className=" container mx-auto py-4"><CourseChooserModal handleTitleChoose={handleTitleChange}/></div>
            }
        <div className=" container mx-auto py-4">
            <h1 className="text-4xl">
                {title}
            </h1>
            <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md">
                <div className="
                lg:w-1/2 px-6 
                h-96 
                overflow-y-auto
                ">
                    <h2 className="
                    title-font 
                    font-semibold 
                    text-gray-900 
                    tracking-widest 
                    text-xs">
                        QUESTIONS
                    </h2>

                    {questions.map((question, index)=> 
                    <div key={index} className="rounded shadow-md my-1 p-4">
                        <XIcon 
                            className="h-5 w-5 float-right m-1 " 
                            aria-hidden="true"
                            onClick={()=>handleDelete(index)}
                            />
                        {question.mode === "Final" 
                        && 
                        <PencilIcon 
                            className="h-5 w-5 float-right m-1 " 
                            aria-hidden="true"
                            onClick={()=>toggleMode(index)}
                            />
                        }
                        
                    {question.mode === "Final"?
                    <QuestionDisplay 
                    key={index} 
                    question={question} 
                    questionNumber={`Question ${index + 1}`}
                    />:
                    <QuestionEditor
                    key={index}
                    index={index} 
                    questionClone = {question} 
                    questions={questions} 
                    setQuestions={setQuestions}
                    />
                    }
                    </div>
                    )
                    }

                </div>
                <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
                    <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">SETTINGS</h2>
                    <select 
                        className="form-select block w-full my-3 border border-gray-400 p-2"
                        value = {questionType}
                        onChange={(e)=>setQuestionType(e.target.value)}
                        >
                        <option value="">Select question type</option>
                        <option value="multipleChoice">Multiple Choice</option>
                        <option value="multipleOption">Multiple Option</option>
                        <option value="essay">Essay</option>
                        <option value="matching">Matching</option>
                    </select>
                        {questionType && 
                        <QuestionBuilder 
                            questionType={questionType} 
                            setQuestionType={setQuestionType} 
                            questions={questions} 
                            setQuestions={setQuestions}
                            />
                        }
                </div>
                {questions.length > 0 &&
                <button
                    className="
                    float-right
                    bg-blue-500
                    text-white
                    active:bg-blue-600
                    font-bold
                    text-xs
                    px-4
                    py-2
                    mt-3
                    ml-6
                    rounded
                    shadow
                    hover:shadow-md
                    outline-none
                    focus:outline-none
                    "
                    onClick={upload}
                >
                    Done</button>
                }
            </div>
        </div>
        </Fragment>
    )
}

export default QuestionMaker