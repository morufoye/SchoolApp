import React, {useEffect } from 'react'
import ApplicationHome from './application'
import { ApplicationProvider, useApplication } from './application-context'
import JobApplication from "./job-application";


const Application=(props)=>{

    return (
        <ApplicationProvider>
            {props.career ? <JobApplication/> : <ApplicationHome />}
    </ApplicationProvider>
    )

}
export default Application