import NavBar from "./components/home/nav-bar"
import {Outlet} from 'react-router-dom'
import Footer from "./components/home/footer"

const Layout = ()=>{
    return(
        <div>
            <NavBar/>
            <Outlet />
            <Footer/>
        </div>
    )
}

export default Layout