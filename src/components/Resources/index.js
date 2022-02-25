import Card from "../utiliities/card"

const Resources =()=> {

    const tools = [
        {
            heading: "Question Tool",
            link: "question-tool",
            description: "This tool will enable you to make question. It has several functionalities to create different types of question including multiple choice question, essay question, matching question, etc."
        },
        {
            heading: "EduGame Tool",
            link: "edu-game-tool",
            description: "This tool will enable you to make educational game. It has several functionalities to create different types of edu-game including memory matcher, fast-clicker etc."
        },
    ]

    return <div className="container mx-auto py-4 flex flex-col items-center content-center">
        <h1 className="text-4xl">Resources</h1>
     
        <div className="flex flex-row flex-wrap items-center">
            {tools.map((tool, index)=>
            <Card key={index} heading={tool.heading} description = {tool.description} link={tool.link}/>
            )}
        </div>
    </div>
}

export default Resources