import "../stylesheets/AddJob.css"
import Header from "../Components/Header"
import AddJobForm from "../Components/AddJobForm"

export default function AddJob() {
    return (
        <>
            <Header />
            <div className="addJobPage">
                <AddJobForm />
            </div>
        </>
    )
}