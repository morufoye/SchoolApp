import React, {Fragment, useContext, useEffect, useState} from 'react'
import AuthContext from "../context/auth-context";

export default function QuestionDisplayProvideAnswer({question, questionNumber,
                                                         handleClickActionForMCQ, assessment_id,
                                                         isTeacher, score, answerTextQuestion,
                                                         submitted, keepTextResponse,
                                                         handleClickActionForMOQ, handleMatchingAnswer
                                                          }){

    const[draggedListObj, setDraggedListObj] = useState({})
    const{getAnswerDetail, getStudentAnswerDetail, currentUser} = useContext(AuthContext)
    const[viewMode, setViewMode] = useState(false);
    const[viewMatchingMode, setViewMatchingMode] = useState(false);
    const[teachermatchingResponse, setTeacherMatchingResponse] = useState({})
    const[studentMatchingResponse, setStudentMatchingResponse] = useState({})
    let textResponse = {}
    let teacher_answer = []
    let student_answer = []
    // let teacher_matching_answer = {}
    // let student_matching_answer = {}
    let questNumb = questionNumber;
    let total_score = 'not available'
    const onDragOver =(e)=>{
        e.preventDefault()
    }
    const onDragStart =(e, option)=>{
        e.dataTransfer.setData("option", option)
    }

     useEffect(async()=>{
         let questionType = ''

         if (submitted) {
             setViewMode(true)
         }

         const res = await getAnswerDetail({
             variables: {"assessmentId": assessment_id},
         })

         if (res) {
             teacher_answer = (JSON.parse(res.data.getAnswerDetail.answer_detail));
             setTeacherMatchingResponse(teacher_answer)
              setViewMatchingMode(true)
         }

         if (isTeacher) {
             for (let i = 0; i < teacher_answer.length; i++) {
                 document.getElementById(teacher_answer[i]).checked = true
             }
         }
         if (!isTeacher) {

         const res2 = await getStudentAnswerDetail({
             variables: {"assessmentId": assessment_id, "userId": currentUser.userId},
         })
             setViewMatchingMode(false)
             if (res2) {
                 student_answer = (JSON.parse(res2.data.getStudentAnswerDetail.answer_detail));
                 questionType = (res2.data.getStudentAnswerDetail.question_type)
                 setStudentMatchingResponse(student_answer)
                 setViewMatchingMode(true)
             }
             for (let i = 0; i < student_answer.length; i++) {
                 if (document.getElementById(student_answer[i])) {
                     document.getElementById(student_answer[i]).checked = true
                 }
             }
         }


         if ("matching" === questionType) {
             let questionLength = teacher_answer.length
             let curScore = 0;
             for (let i =  0; i < questionLength; i++ ) {
                 let skip = false;

                 let correctSequence = Object.values(teacher_answer[i])[0]
                 let studentSequence = Object.values(student_answer[i])[0]



                 if (correctSequence.length !== studentSequence.length) {
                   //  console.log(' got question  ' + [parseInt(i) + 1] + '  wrong')
                     continue
                 }

                 for (let k = 0; k < studentSequence.length; k++) {
                     if (correctSequence[k] !==  studentSequence[k]) {
                         skip = true;
                         break;
                     }
                 }
                 if (skip === true) {
                     continue
                 }
                 ++curScore;
             }
             total_score = curScore / questionLength;
             score(total_score)
         }


      if ("multipleChoice" === questionType) {
          if (teacher_answer.length !== 0) {
              let x = 0;
              if (student_answer.length !== 0) {
                  for (let i = 0; i < student_answer.length; i++) {
                      if (teacher_answer.indexOf(student_answer[i]) !== -1) {
                          x++
                      }
                  }
              }
              total_score = x / teacher_answer.length;
          }
          score(total_score)
      }

      if ("multipleOption" === questionType) {
          let distinctQuestions = [];
          let curScore = 0;
          let questionLength = 0;

          if (teacher_answer.length !== 0) {
              for (let i = 0; i < teacher_answer.length; i++) {
                  let dQ = teacher_answer[i].substring(0, teacher_answer[i].indexOf("-"))
                  if (distinctQuestions.indexOf(dQ) === -1) {
                      distinctQuestions.push(dQ)
                  }
              }
              questionLength = distinctQuestions.length
              let ques = 0;
              for (let i = 0; i < questionLength; i++) {
                  let teacherChoice = []
                  let skip = false;
                  for (let j = 0; j < teacher_answer.length; j++) {
                      let answer_prefix = (distinctQuestions[i])+'-';
                      if (teacher_answer.indexOf(answer_prefix) === -1 && teacher_answer[j].includes(answer_prefix)) {
                          teacherChoice.push(teacher_answer[j])
                      }
                  }
                  console.log(' now this is the Teacher Choice for ', distinctQuestions[i] + ' >>>>>>> '  + JSON.stringify(teacherChoice))
                  //  select student options
                  let studentChoice = []
                  for (let j = 0; j < student_answer.length; j++) {
                      let answer_prefix = (distinctQuestions[i])+'-';
                      if (student_answer.indexOf(answer_prefix) === -1 && student_answer[j].includes(answer_prefix)) {
                          studentChoice.push(student_answer[j])
                      }
                  }

                  if (studentChoice.length !== teacherChoice.length) {
                      continue
                  }
                  for (let k = 0; k < studentChoice.length; k++) {
                      if (teacherChoice.indexOf(studentChoice[k]) === -1) {
                          skip = true;
                          break;
                      }
                  }
                  if (skip === true) {
                      continue
                  }
                  ++curScore;
              }
          }
          total_score = curScore / questionLength;
          score(total_score)
      }


     }, [])


    const loadMatchingAnswers = (questionNumber, index) => {
        let answerIndex = questionNumber+'-'+index;
        if (isTeacher) {
            let ansObj =  teachermatchingResponse[questionNumber + 1];
            let ind = questionNumber.substring(9, questionNumber.length);
            ind = parseInt(ind) - 1
            if (teachermatchingResponse[ind]) {
                return Object.values(teachermatchingResponse[ind])[0][index]
            }
        } else {
            let ansObj =  studentMatchingResponse[questionNumber + 1];
            let ind = questionNumber.substring(9, questionNumber.length);
            ind = parseInt(ind) - 1
            if (studentMatchingResponse[ind]) {
                return Object.values(studentMatchingResponse[ind])[0][index]
            }
        }
    }

    const onDrop=(e, index, questionNumber)=>{
        let option = e.dataTransfer.getData("option")
        e.target.innerHTML = option
        setDraggedListObj({...draggedListObj, [index]: option})
        handleMatchingAnswer(questionNumber, index, e.target.innerHTML)
    }

    const constructOptionIndex = (questionNumber, optionIndex) => {
        return questionNumber + '-'+optionIndex;
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
                                type="checkbox"
                                className="form-radio"
                                name="checkbox"
                                value={option}
                                id= {constructOptionIndex(questionNumber, index)}
                                onClick={(event) => {handleClickActionForMCQ(event, questionNumber, index)}}
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
                                id= {constructOptionIndex(questionNumber, index)}
                                onClick={(event) => {handleClickActionForMOQ(event, questionNumber, index)}}
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
                    {viewMode ? <> <textarea
                        className="form-textarea mt-1 block w-full bg-white bg-white
                            rounded
                            text-sm
                            border border-gray-400
                            outline-none
                            focus:outline-none focus:ring px-2
                            py-1"
                        rows="4"
                        value={question.resp}
                        readOnly={true}
                    > </textarea>
                            <textarea
                                className="form-textarea mt-1 block w-full bg-white bg-white
                            rounded
                            text-sm
                            border border-gray-400
                            outline-none
                            focus:outline-none focus:ring px-2
                            py-1"
                                rows="4"
                                placeholder="enter comment"
                                name={questionNumber}
                                value={question.comment}
                                readOnly={true}
                            ></textarea>
                            <input
                                className="form-textarea mt-1 block w-full bg-white bg-white
                            rounded
                            text-sm
                            border border-gray-400
                            outline-none
                            focus:outline-none focus:ring px-2
                            py-1"
                                placeholder="Enter Score over 10"
                                type="number"
                                value={question.score}
                                readOnly={true}
                            />
                        </>:
                        <textarea
                            className="form-textarea mt-1 block w-full bg-white bg-white
                            rounded
                            text-sm
                            border border-gray-400
                            outline-none
                            focus:outline-none focus:ring px-2
                            py-1"
                            rows="4"
                            name={questionNumber}
                            onChange={(e)=>{keepTextResponse(questionNumber, e.target.value)}}
                            placeholder="Enter your response"
                            onBlur={(e)=>answerTextQuestion(questionNumber, e.target.value)}
                        ></textarea>
                    }
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
                                { !viewMatchingMode ?
                                <>
                                <div
                                    className="pl-2 w-1/2 bg-gray-300"
                                    onDragOver={e=>onDragOver(e)}
                                    onDrop={e=> onDrop(e, index, questionNumber)}
                                >
                                    <span className="ml-2">
                                        ?
                                        </span>
                                    <br/>
                                </div>
                                </>
                                :
                                <input className="ml-2" value ={loadMatchingAnswers(questionNumber, index)} readOnly={true}/>
                                }
                         </div>
                        )}
                    </div>
                </div>
            </div>
        default:
            return null
    }
}