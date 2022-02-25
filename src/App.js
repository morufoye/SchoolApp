import React, {useContext} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import Application from "./components/application";
import ContactUs from "./components/home/contact-us";
import Gallery from "./components/home/gallery";
import Home from "./components/home";
import StaffProfile from "./components/home/staff-profile";
import Dashboard from './components/dashboard';
import Layout from './layout';
import Resources from './components/Resources';
import QuestionMaker from './components/Question-Maker';
import EduGameMaker from './components/edu-game-maker';
import {ApolloProvider} from "@apollo/client";
import dataStore from "./components/service/api";
import {AuthContextProvider} from "./components/context/auth-context";
import AuthContext from "./components/context/auth-context";



function App() {
  return (
    <Router>
        <ApolloProvider client={dataStore}>
        <AuthContextProvider>
        <Routes>
          <Route 
            path="/"
            element={<Layout/>}>
              <Route index element={<Home/>}/>
              <Route  path="/" element={<Home/>}/>
              <Route  path="application" element={<Application/>}/>
              <Route  path="contact-us" element={<ContactUs/>}/>
              <Route  path="career" element={<Application career={true}/>}/>
              <Route  path="staff" element={<StaffProfile/>}/>
              <Route  path="gallery" element={<Gallery/>}/>
              <Route  path="dashboard" element={<Dashboard/>}/>
              <Route path="question-tool" element={<QuestionMaker/>}/>
              <Route path="edu-game-tool" element={<EduGameMaker/>}/>
              <Route  path="resources">
                <Route index element={<Resources/>}/>

              </Route>
            </Route>
        </Routes>
        </AuthContextProvider>
            </ApolloProvider>
    </Router>
    
  );
}

export default App;
