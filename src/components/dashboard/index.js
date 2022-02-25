import React, {useContext, useState} from 'react'
import { Dashboardrovider } from './dashboard-context'
import DashboardHome from './dashboard-home'
import AuthContext from "../context/auth-context";
import Home from "../home";
import ChangePassword from "../modals/ChangePassword";


export default function Dashboard() {
    const {isAuthenticated} = useContext(AuthContext);
    const[pwordModal, setPwordModal]= useState(false);

    const showPwordChangeModal = () => {
        setPwordModal(false);
    }

  return (
      <>
          { isAuthenticated ?
          <Dashboardrovider>
              <DashboardHome/>
          </Dashboardrovider>
              :
              <Home/>
         }

      </>
  )
}