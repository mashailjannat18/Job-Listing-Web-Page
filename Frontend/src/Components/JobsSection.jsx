import "../stylesheets/JobsSection.css"
import addIcon from "../assets/addIcon.png"
import savedIcon from "../assets/savedIcon-outline.png"
import savedIconBlue from "../assets/savedIcon-darkblue.png"
import editIcon from "../assets/editIcon.png"
import deleteIcon from "../assets/deleteIcon.png"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function JobsSection({ toggleBlur }) {
    const navigate = useNavigate()
    const [savedJobs, setSavedJobs] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [jobs, setJobs] = useState([])
    const [editForm, setEditForm] = useState(false)
    const [currentJob, setCurrentJob] = useState(null)
    const [editValues, setEditValues] = useState({
        company: "",
        title: "",
        location: "",
        job_type: "",
        experience_level: "",
        tags: "",
        workLocationTypes: [],
        timeCommitmentType: "",
        city: ""
    })
    const [dropdowns, setDropdowns] = useState({
        workLocation: false,
        timeCommitment: false,
        experienceLevel: false,
        city: false
    })
    const [tags, setTags] = useState([])
    const [currentTag, setCurrentTag] = useState("")
    
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [showEditConfirm, setShowEditConfirm] = useState(false)
    const [jobToDelete, setJobToDelete] = useState(null)

    const worklocations = ["Onsite", "Hybrid", "Remote"]
    const timecommitmenttypes = ["Project-based", "Contract", "Temporary", "Internship", "Part-time", "Full-time"]
    const experienceleveltypes = ["Entry Level", "Associate Level", "Mid Level", "Senior Level", "Executive Level"]
    const [cities, setCities] = useState([])

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setIsLoading(true)
                const response = await fetch("http://127.0.0.1:5000/getAllJobs", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })

                if (!response.ok) {
                    throw new Error(`HTTP Error! status: ${response.status}`)
                }

                const data = await response.json()
                setJobs(data)
            } catch (error) {
                console.error("Error fetching data: ", error)
            } finally {
                setIsLoading(false)
            }
        }

        const fetchCities = async () => {
            try {
                const response = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ country: 'pakistan' })
                })

                if (!response.ok) {
                    throw new Error(`HTTP Error! status: ${response.status}`)
                }

                const data = await response.json()
                const cityNames = data.data
                setCities(cityNames.sort())
            } catch (error) {
                console.error("Error fetching cities: ", error)
            }
        }

        fetchJobs()
        fetchCities()
    }, [])

    const handleSaveClick = (jobId) => {
        setSavedJobs(prev => ({
            ...prev,
            [jobId]: !prev[jobId]
        }))
    }

    const parseTags = (tagsString) => {
        if (!tagsString) return []
        return tagsString.split(",").map(tag => tag.trim())
    }

    const formatPostingDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString()
    }

    const handleEditClick = (job) => {
        const workLocationTypes = job.job_type ? job.job_type.split(",").map(item => item.trim()).filter(item => 
            worklocations.includes(item)
        ) : []
        
        const timeCommitmentType = job.job_type ? job.job_type.split(",").map(item => item.trim()).find(item => 
            timecommitmenttypes.includes(item)
        ) : ""

        const locationParts = job.location ? job.location.split(",").map(item => item.trim()) : []
        const location = locationParts.length > 1 ? locationParts.slice(0, -1).join(", ") : job.location || ""
        const city = locationParts.length > 1 ? locationParts[locationParts.length - 1] : ""

        setCurrentJob(job)
        setEditValues({
            company: job.company || "",
            title: job.title || "",
            location: location,
            job_type: job.job_type || "",
            experience_level: job.experience_level || "",
            tags: job.tags || "",
            workLocationTypes: workLocationTypes,
            timeCommitmentType: timeCommitmentType,
            city: city
        })
        setTags(parseTags(job.tags || ""))
        setEditForm(true)
        toggleBlur(true)
    }

    const handleWorkLocationChange = (value) => {
        setEditValues(prev => ({
            ...prev,
            workLocationTypes: prev.workLocationTypes.includes(value) 
                ? prev.workLocationTypes.filter(item => item !== value)
                : [...prev.workLocationTypes, value]
        }))
    }

    const handleTimeCommitmentChange = (value) => {
        setEditValues(prev => ({
            ...prev,
            timeCommitmentType: value
        }))
        toggleDropdown('timeCommitment')
    }

    const handleExperienceLevelChange = (level) => {
        setEditValues(prev => ({
            ...prev,
            experience_level: level
        }))
        toggleDropdown('experienceLevel')
    }

    const handleCityChange = (selectedCity) => {
        setEditValues(prev => ({
            ...prev,
            city: selectedCity
        }))
        toggleDropdown('city')
    }

    const toggleDropdown = (dropdownName) => {
        setDropdowns(prev => ({
            ...prev,
            [dropdownName]: !prev[dropdownName],
            ...Object.fromEntries(
                Object.keys(prev)
                    .filter(key => key !== dropdownName)
                    .map(key => [key, false])
            )
        }))
    }

    const handleTagInput = (e) => {
        const value = e.target.value
        setCurrentTag(value)
        
        if (value.includes(',')) {
            const newTags = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
            setTags(prev => [...new Set([...prev, ...newTags])])
            setCurrentTag('')
        }
    }

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' && currentTag.trim() !== '') {
            e.preventDefault()
            setTags(prev => [...new Set([...prev, currentTag.trim()])])
            setCurrentTag('')
        }
    }

    const removeTag = (tagToRemove) => {
        setTags(prev => prev.filter(tag => tag !== tagToRemove))
    }

    const handleInputChange = (field, value) => {
        setEditValues(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmitEdit = async () => {
        try {
            const jobType = [
                ...editValues.workLocationTypes,
                editValues.timeCommitmentType
            ].filter(Boolean).join(", ")

            const location = editValues.city ? 
                `${editValues.location}, ${editValues.city}`.trim() : 
                editValues.location

            const response = await fetch("http://127.0.0.1:5000/updateJob", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: currentJob.id,
                    title: editValues.title,
                    company: editValues.company,
                    job_type: jobType,
                    location: location,
                    experience_level: editValues.experience_level,
                    tags: tags.join(", ")
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP Error! status: ${response.status}`)
            }

            const jobsResponse = await fetch("http://127.0.0.1:5000/getAllJobs")
            const jobsData = await jobsResponse.json()
            setJobs(jobsData)

            setEditForm(false)
            setShowEditConfirm(false)
            toggleBlur(false)
        } catch (error) {
            console.error("Error updating job: ", error)
        }
    }

    const confirmDeleteJob = (jobId) => {
        setJobToDelete(jobId)
        setShowDeleteConfirm(true)
        toggleBlur(true)
    }

    const deleteJob = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/deleteJob", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: jobToDelete })
            })

            if (!response.ok) {
                throw new Error(`HTTP Error! status: ${response.status}`)
            }
            const jobsResponse = await fetch("http://127.0.0.1:5000/getAllJobs")
            const jobsData = await jobsResponse.json()
            setJobs(jobsData)
        } catch (error) {
            console.error("Error deleting job: ", error)
        } finally {
            setShowDeleteConfirm(false)
            setJobToDelete(null)
            toggleBlur(false)
        }
    }

    const confirmEditChanges = () => {
        setShowEditConfirm(true)
    }

    return (
        <>
            <div className={`jobsContent ${editForm || showDeleteConfirm ? "blurred" : ""}`}>
                <div className="beforeJobsList">
                    <p className="heading">Active Jobs</p>
                    <button className="addJobBtn" onClick={() => navigate("/addjob")}>
                        <img src={addIcon} alt="" width={13.5} height={13.5} className="addIcon-class" />
                        Add Job
                    </button>
                </div>

                {isLoading ? (
                    <div className="loading">Loading jobs...</div>
                ) : (
                    <div className="jobsList">
                        {jobs.map(job => (
                            <div className="jobCard" key={job.id}>
                                <div className="cardHead">
                                    <h2 className="jobTitle">{job.title}</h2>
                                    <p className="postingTime">{formatPostingDate(job.posting_date)}</p>
                                </div>

                                <div className="jobdetail">
                                    <div className="jobDetailContent">
                                        <div className="contentText">
                                            <p className="companyName">{job.company}</p>
                                            <p className="locationPlace">{job.location}</p>
                                            <p className="jobTypeText">Job type: {job.job_type}</p>
                                            <p className="experienceLevel">Level: {job.experience_level}</p>
                                        </div>
                                        <img 
                                            src={savedJobs[job.id] ? savedIconBlue : savedIcon} 
                                            alt="Save job" 
                                            width={25} 
                                            height={25} 
                                            className="savedIconImg" 
                                            onClick={() => handleSaveClick(job.id)} 
                                        />
                                    </div>
                                    <span className="tagsList">
                                        {parseTags(job.tags).map((tag, index) => (
                                            <span className="tagText" key={index}>{tag}</span>
                                        ))}
                                    </span>
                                </div>
                                <div className="jobCardButtons">
                                    <button className="deleteJobBtn" onClick={() => confirmDeleteJob(job.id)}>
                                        <img src={deleteIcon} alt="Delete" width={19} height={19} className="deleteIconImg" />
                                        Delete Job
                                    </button>
                                    <button className="editJobBtn"
                                        onClick={() => handleEditClick(job)}
                                    >
                                        <img src={editIcon} alt="Edit" width={19} height={19} className="editIconImg" />
                                        Edit Job
                                    </button>
                                </div>                            
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {editForm && (
                <div className="editJobFormOverlay">
                    <div className="editJobFormContainer">
                        <div className="editFormHeader">
                            <h2>Edit Job Posting</h2>
                            <p className="editFormSubtitle">Update the job details below</p>
                        </div>
                        
                        <form className="editJobForm" onSubmit={(e) => e.preventDefault()}>
                            <div className="formGrid">
                                <div className="formGroup">
                                    <label className="formLabel">
                                        Job Title: 
                                    </label>
                                    <input 
                                        type="text" 
                                        value={editValues.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        className="formInput"
                                        placeholder="Enter job title"
                                    />
                                </div>

                                <div className="formGroup">
                                    <label className="formLabel">
                                        Company: 
                                    </label>
                                    <input 
                                        type="text" 
                                        value={editValues.company}
                                        onChange={(e) => handleInputChange('company', e.target.value)}
                                        className="formInput"
                                        placeholder="Enter company name"
                                    />
                                </div>

                                <div className="formGroup">
                                    <label className="formLabel">
                                        Address: 
                                    </label>
                                    <input 
                                        type="text" 
                                        value={editValues.location}
                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                        className="formInput"
                                        placeholder="Enter street address"
                                    />
                                </div>

                                <div className="formGroup">
                                    <label className="formLabel">City *</label>
                                    <div className="dropdownWrapper">
                                        <button 
                                            type="button" 
                                            className={`dropdownToggle ${editValues.city ? 'hasSelection' : ''} ${dropdowns.city ? 'open' : ''}`}
                                            onClick={() => toggleDropdown('city')}
                                        >
                                            {editValues.city || "Select city"}
                                            <span className={`dropdownArrow ${dropdowns.city ? 'open' : ''}`}>▼</span>
                                        </button>
                                        {dropdowns.city && (
                                            <div className="dropdownMenu">
                                                {cities.map((cityItem) => (
                                                    <div 
                                                        key={cityItem} 
                                                        className={`dropdownItem ${editValues.city === cityItem ? 'selected' : ''}`}
                                                        onClick={() => handleCityChange(cityItem)}
                                                    >
                                                        {cityItem}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="formGroup">
                                    <label className="formLabel">Experience Level *</label>
                                    <div className="dropdownWrapper">
                                        <button 
                                            type="button" 
                                            className={`dropdownToggle ${editValues.experience_level ? 'hasSelection' : ''} ${dropdowns.experienceLevel ? 'open' : ''}`}
                                            onClick={() => toggleDropdown('experienceLevel')}
                                        >
                                            {editValues.experience_level || "Select level"}
                                            <span className={`dropdownArrow ${dropdowns.experienceLevel ? 'open' : ''}`}>▼</span>
                                        </button>
                                        {dropdowns.experienceLevel && (
                                            <div className="dropdownMenu">
                                                {experienceleveltypes.map((level) => (
                                                    <div 
                                                        key={level} 
                                                        className={`dropdownItem ${editValues.experience_level === level ? 'selected' : ''}`}
                                                        onClick={() => handleExperienceLevelChange(level)}
                                                    >
                                                        {level}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="formGroup">
                                    <label className="formLabel">Time Commitment *</label>
                                    <div className="dropdownWrapper">
                                        <button 
                                            type="button" 
                                            className={`dropdownToggle ${editValues.timeCommitmentType ? 'hasSelection' : ''} ${dropdowns.timeCommitment ? 'open' : ''}`}
                                            onClick={() => toggleDropdown('timeCommitment')}
                                        >
                                            {editValues.timeCommitmentType || "Select commitment"}
                                            <span className={`dropdownArrow ${dropdowns.timeCommitment ? 'open' : ''}`}>▼</span>
                                        </button>
                                        {dropdowns.timeCommitment && (
                                            <div className="dropdownMenu">
                                                {timecommitmenttypes.map((commitment) => (
                                                    <div 
                                                        key={commitment} 
                                                        className={`dropdownItem ${editValues.timeCommitmentType === commitment ? 'selected' : ''}`}
                                                        onClick={() => handleTimeCommitmentChange(commitment)}
                                                    >
                                                        {commitment}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="formGroup fullWidth">
                                    <label className="formLabel">Work Location *</label>
                                    <div className="checkboxGroup">
                                        {worklocations.map((location) => (
                                            <label key={location} className="checkboxLabel">
                                                <input 
                                                    type="checkbox"
                                                    checked={editValues.workLocationTypes.includes(location)}
                                                    onChange={() => handleWorkLocationChange(location)}
                                                    className="checkboxInput"
                                                />
                                                <span className="checkboxCustom"></span>
                                                {location}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="formGroup fullWidth">
                                    <label className="formLabel">Tags</label>
                                    <div className="tagsInputWrapper">
                                        <div className="tagsContainer">
                                            {tags.map((tag, index) => (
                                                <span key={index} className="tagItem">
                                                    {tag}
                                                    <button 
                                                        type="button" 
                                                        className="tagRemove"
                                                        onClick={() => removeTag(tag)}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                            <input 
                                                type="text" 
                                                value={currentTag}
                                                onChange={handleTagInput}
                                                onKeyDown={handleTagKeyDown}
                                                placeholder="Type tags separated by commas"
                                                className="tagInput"
                                            />
                                        </div>
                                        <p className="inputHint">Press Enter or comma to add tags</p>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <div className="formActions">
                            <button className="cancelButton"
                                onClick={() => {
                                    setEditForm(false)
                                    toggleBlur(false)
                                }}
                            >
                                Cancel
                            </button>
                            <button className="saveButton" onClick={confirmEditChanges}>
                                Save Changes
                            </button>
                        </div>                        
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="confirmationOverlay">
                    <div className="confirmationDialog">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this job posting? This action cannot be undone.</p>
                        <div className="confirmationButtons">
                            <button 
                                className="cancelButton"
                                onClick={() => {
                                    setShowDeleteConfirm(false)
                                    setJobToDelete(null)
                                    toggleBlur(false)
                                }}
                            >
                                Cancel
                            </button>
                            <button 
                                className="confirmDeleteButton"
                                onClick={deleteJob}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEditConfirm && (
                <div className="confirmationOverlay">
                    <div className="confirmationDialog">
                        <h3>Confirm Changes</h3>
                        <p>Are you sure you want to save these changes to the job posting?</p>
                        <div className="confirmationButtons">
                            <button 
                                className="cancelButton"
                                onClick={() => setShowEditConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="confirmSaveButton"
                                onClick={handleSubmitEdit}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}