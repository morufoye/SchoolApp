import Modal from "../UI/Modal";

const SubmitAssessmentModal = (props) => {
    return (
        <Modal onClose={() => {props.onClose()}}>
            <label className="block text-gray-700 text-sm font-bold mb-1 mt-2">
                Are you sure you want to submit now?
                Click 'OK' to submit
            </label>
            <button className="p-3 w-lg m-2 bg-red-100 text-center rounded-xl"
                    type="button"
                    onClick={(e)=>{props.handleSubmitAnswer(props.questionObject)}}>
                OK
            </button>

            <button className = "p-3 w-lg m-2 bg-green-100 text-center rounded-xl"
                    type="button"
                    onClick={(e)=>{props.onClose()}}>
                Cancel
            </button>
        </Modal>
    )
}
export default SubmitAssessmentModal;