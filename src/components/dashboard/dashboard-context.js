import React, { useState, useContext } from 'react'

const DashboardContext = React.createContext()


function Dashboardrovider({children}){
    
        const [students, setStudents]= useState([])
        const [classes, setClasses]= useState([])
        const [teachers, setTeachers]=useState([])
        const [payments, setPayments]=useState([])
        const [results, setResults]=useState([])

    return (
        <DashboardContext.Provider 
        value={
            {
                students, 
                setStudents, 
                classes, 
                setClasses, 
                teachers, 
                setTeachers, 
                payments, 
                setPayments, 
                results, 
                setResults
            }
        }>
            {children}

        </DashboardContext.Provider>
    )
}

const useDashboard= () => useContext(DashboardContext);

export {useDashboard, Dashboardrovider}