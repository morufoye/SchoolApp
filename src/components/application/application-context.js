import React, { useState, useContext } from 'react'

const ApplicationContext = React.createContext()


function ApplicationProvider({children}){

    const [regData, setRegData] =useState([])
    const [regStep, setRegStep] = useState(1)
    const [dataToEdit, setDataToEdit] =useState({})
    const [indexToEdit, setIndexToEdit] =useState()

    return (
        <ApplicationContext.Provider 
        value={
            {
            regData, 
            setRegData,
            regStep, 
            setRegStep,
            dataToEdit, 
            setDataToEdit,
            indexToEdit, 
            setIndexToEdit
            }
        }>
            {children}

        </ApplicationContext.Provider>
    )
}

const useApplication = () => useContext(ApplicationContext);

export {useApplication, ApplicationProvider}