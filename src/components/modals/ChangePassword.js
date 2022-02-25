import {useContext, useState} from 'react';
import Modal from "../UI/Modal";
import AuthContext from "../context/auth-context";


const ChangePassword= (props) => {
    const{currentUser, updatePassword, confirmOldPassword} = useContext(AuthContext);
    const[oldPassword, setOldPassword] = useState('');
    const[password, setPassword] = useState('');
    const[passwordConfirm, setPasswordConfirm] = useState('');

    const labelClass= "block text-gray-700 text-sm font-bold mb-1 mt-2"
    const inputClass= "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"


    const changePasswordHandler= async(event) => {
        event.preventDefault();
        const res = await confirmOldPassword({variables: {"userId" : currentUser.userId, "password": oldPassword},})
        if (res.data.confirmOldPassword === 'success') {
            if (password === passwordConfirm) {
                const res = await updatePassword({variables: {"userId" : currentUser.userId, "password": password},})
                props.closePwordModal();
                alert('password change successful')
            }else {
                alert('passwords do not match')
            };
        } else {
            alert('old password is not correct')
        }

    }

    const oldPasswordChangeHandler = (event) => {
        setOldPassword(event.target.value);
    };

    const passwordChangeHandler = (event) => {
        setPassword(event.target.value);
    };

    const passwordConfirmChangeHandler = (event) => {
        setPasswordConfirm(event.target.value);
    };

    const closeModal = () => {
        props.closePwordModal();
    }

    return (
        <Modal onClose = {closeModal}>
            <div className="max-w-md mx-auto">
                <div className="w-full max-w-md">
            <div className="max-w-7xl mx-auto py-1 align-center">
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                    <span className="block text-blue-600">Change Password </span>
                </h2>
            </div>
               
                    <form className="bg-white shadow-md rounded p-1 my-1 mb-4">
                        <div className="form-control">
                            <label className={labelClass}   htmlFor="oldPassword">Current Password</label>
                            <input className={inputClass} id="oldPassword" type="password" value={oldPassword} onChange={oldPasswordChangeHandler} required/>
                        </div>

                        <div className="form-control">
                            <label className={labelClass}  htmlFor="password">New Password</label>
                            <input className={inputClass} id="password" type="password" value={password} onChange={passwordChangeHandler} required/>
                        </div>

                        <div className="form-control">
                            <label className={labelClass}  htmlFor="passwordConfirm">Confrim Password</label>
                            <input className={inputClass} id="confPword" type="password" value={passwordConfirm} onChange={passwordConfirmChangeHandler} required/>
                        </div>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={changePasswordHandler}
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>

        </Modal>
    );
};

export default ChangePassword;

