import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCertificate } from '@fortawesome/free-solid-svg-icons'
import {useContext} from "react";
import AuthContext from "../context/auth-context";

const Footer =()=>{

  const {isAuthenticated} = useContext(AuthContext)

    return(
        <footer className="footer-1 bg-gray-100">
  <div className="container mx-auto py-4 px-4">
    <div className="sm:flex sm:flex-wrap sm:-mx-4 mt-6 pt-6 sm:mt-12 sm:pt-12 border-t">
      { !isAuthenticated &&
          <>
      <div className="sm:w-full px-4 md:w-1/6">
        {/* <strong>FWR</strong> */}
      </div>
      <div className="px-4 sm:w-1/2 md:w-1/4 mt-4 md:mt-0">
        <h6 className="font-bold mb-2">Address</h6>
        <address className="not-italic mb-4 text-sm">
          123 6th St.<br/>
          Melbourne, FL 32904
        </address>
      </div>
      <div className="px-4 sm:w-1/2 md:w-1/4 mt-4 md:mt-0">
        <h6 className="font-bold mb-2">Free Resources</h6>
        <p className="mb-4 text-sm">Use our HTML blocks for <strong>FREE</strong>.<br/>
          <em>All are MIT License</em></p>
      </div>

      <div className="px-4 md:w-1/4 md:ml-auto mt-6 sm:mt-4 md:mt-0">
        <button className="px-4 py-2 bg-purple-800 hover:bg-purple-900 rounded text-white">Get Started</button>
      </div>
          </>
      }
    </div>
  </div>
</footer>
    )
}

export default Footer