import Modal from "../UI/Modal";
import {useContext, useEffect, useMemo, useState} from "react";
import AuthContext from "../context/auth-context";

const HomeWorkSelectorModal = (props) => {
    const {pendingWorks} = useContext(AuthContext)
    const closeModal = () => {
        props.closeModal();
    }



    return (
        <Modal onClose={closeModal}>
            <select type="text" name="assessmentId" onChange={(e) => {alert(e.target.value)}}>
                <option value=" ">Select Home Work</option>
                {pendingWorks.map((item, index) => <option key={index} value={item.assessment_id}>{item.assessment_id}</option>)}
            </select>
        </Modal>
    );
};

export default HomeWorkSelectorModal;