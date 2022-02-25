import { Link } from "react-router-dom"

const Card =({heading, description, link})=>(
    <div className="max-w-xs min-w-xs max-h-xs min-h-xs py-4 px-8 bg-white shadow-lg rounded-lg m-5">
                <div>
                    { heading && 
                    <h2 className="text-gray-800 text-2xl font-semibold">{heading}</h2>
                    }
                    {description &&
                    <p className="mt-2 text-gray-600">
                        {description}
                    </p>
                    }
                    {link && 
                    <div className="flex justify-end mt-4">
                        <Link
                        to={link}
                        >
                            <p className="text-xl font-medium text-indigo-500">Link</p>
                        </Link>
                    </div>
                    }
                </div>
            </div>
)

export default Card