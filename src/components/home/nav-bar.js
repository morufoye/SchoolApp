import React, { Fragment, useState, useContext, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { Popover, Transition, Dialog } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import AuthContext from "../context/auth-context";
import {useForm, Controller} from 'react-hook-form';




export default function NavBar(){

    const {login, setSuccessMessage, isAuthenticated,  setIsAuthenticated, welcomeName} = useContext(AuthContext)
    const { register, errors, handleSubmit, control} = useForm({
        // resolver: yupResolver(formSchema),
    });

   // const  = [];
    const navigationElements = [
        { name: 'Registration', path: 'application' },
        { name: 'Contact us', path: 'contact-us' },
        { name: 'Staff', path: 'staff'},
        { name: 'Career', path: 'career'}
    ]
    const[navigation, setNavigation]=useState(navigationElements);

    const navigate = useNavigate();

     const onSubmit = async (data) => {
          await login({
              variables: {...data},
          });
         navigationElements.splice(0, 1);
         setNavigation(navigationElements);
         navigate('/dashboard');
         closeModal();
     };



  let [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const logOut = () => {
      setIsAuthenticated(false);
      navigationElements.splice(0, 1,  { name: 'Registration', path: 'application' });
      setNavigation(navigationElements);
      navigate('/');

  }

    return (
        <>

        <Popover>
                <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
                <nav className="relative flex items-center justify-between sm:h-10 lg:justify-start" aria-label="Global">
                    <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
                    <div className="flex items-center justify-between w-full md:w-auto">
                        <Link to="/">
                        <span className="sr-only">Workflow</span>
                        <img
                            alt=""
                            className="h-8 w-auto sm:h-10"
                            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                        />
                        </Link>
                        <div className="-mr-2 flex items-center md:hidden">
                        <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="sr-only">Open main menu</span>
                            <MenuIcon className="h-6 w-6" aria-hidden="true" />
                        </Popover.Button>
                        </div>
                    </div>
                    </div>
                    <div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
                    {navigation.map((item) => (
                        <Link className="font-medium text-gray-500 hover:text-gray-900" key={item.name} to={item.path}>
                            {item.name}
                        </Link>
                    ))}
                        {!isAuthenticated ?
                        <button
                            type="button"
                            onClick={openModal}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Log in
                        </button> : <> <button  type="button"
                                             onClick={logOut}
                                             className="font-medium text-indigo-600 hover:text-indigo-500">
                                Log Out
                            </button>  <button className="font-large text-red-900 hover:text-Red-800">Welcome    {welcomeName}</button></>
                        }
                    </div>
                </nav>
                </div>

                <Transition appear show={isOpen} as={Fragment}>
                    <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={closeModal}
                    >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        >
                        <Dialog.Overlay className="fixed inset-0" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                        className="inline-block h-screen align-middle"
                        aria-hidden="true"
                        >
                        &#8203;
                        </span>
                        <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                        >
                        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                        <div>
                            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-5">
                            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                <span className="block text-blue-600">Log in</span>
                            </h2>
                            </div>
                            
                            <div className="w-full max-w-md">
                                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" id="loginForm" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                        User Id
                                    </label>
                                    {/*<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username"/>*/}
                                        <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                            <Controller
                                                id="username-text"
                                                name="username"
                                                defaultValue={''}
                                                control={control}
                                                render={({ onChange, value }) => (
                                                    <input id="username" {...register('username', {required: true})}/>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                        Password
                                    </label>
                                        <div className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" >
                                            <Controller
                                                id="password-text"
                                                name="password"
                                                defaultValue={''}
                                                control={control}
                                                render={({ onChange, value }) => (
                                                    <input id="password" type="password" data-testid="password" {...register('password', {required: true})}/>

                                                )}
                                            />
                                        </div>
                                        <p className="text-red-500 text-xs italic">
                                        Please enter your password.
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                    <button 
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                    type="submit">
                                        Sign In
                                    </button>
                                    <button className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                                        Forgot Password?
                                    </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        </div>
                        </Transition.Child>
                    </div>
                    </Dialog>
                </Transition>

                <Transition
                as={Fragment}
                enter="duration-150 ease-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="duration-100 ease-in"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
                >
                <Popover.Panel
                    focus
                    className="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
                >
                    <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div className="px-5 pt-4 flex items-center justify-between">
                        <div>
                        <img
                            className="h-8 w-auto"
                            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                            alt=""
                        />
                        </div>
                        <div className="-mr-2">
                        <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="sr-only">Close main menu</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                        </Popover.Button>
                        </div>
                    </div>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navigation.map((item) => (
                        
                        <Link 
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" 
                        key={item.name} 
                        to={item.path}>
                        {item.name}
                    </Link>
                        ))}
                    </div>

                        <button
                            type="button"
                            onClick={openModal}
                            className="block w-full px-5 py-3 text-center font-medium text-indigo-600 bg-gray-50 hover:bg-gray-100"
                        >
                            Log In
                        </button>
                    </div>
                </Popover.Panel>
                </Transition>

            </Popover>

        </>
    )
}