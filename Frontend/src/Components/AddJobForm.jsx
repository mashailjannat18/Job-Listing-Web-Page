import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../stylesheets/AddJobForm.css"

export default function AddJobForm() {
    const worklocations = ["Onsite", "Hybrid", "Remote"]
    const timecommitmenttypes = ["Project-based", "Contract", "Temporary", "Internship", "Part-time", "Full-time"]
    const experienceleveltypes = ["Entry Level", "Associate Level", "Mid Level", "Senior Level", "Executive Level"]
    const [cities, setCities] = useState([])
    const [jobTitle, setJobTitle] = useState("")
    const [company, setCompany] = useState("")
    const [workLocationTypes, setWorkLocationTypes] = useState([])
    const [timeCommitmentType, setTimeCommitmentType] = useState("")
    const [location, setLocation] = useState("")
    const [city, setCity] = useState("")
    const [experienceLevel, setExperienceLevel] = useState("")
    const [tags, setTags] = useState([])
    const [currentTag, setCurrentTag] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [dropdowns, setDropdowns] = useState({
        workLocation: false,
        timeCommitment: false,
        experienceLevel: false,
        city: false
    })
    const [showSuccessPopup, setShowSuccessPopup] = useState(false)
    const [showJobExistsPopup, setShowJobExistsPopup] = useState(false)
    
    const [errors, setErrors] = useState({
        jobTitle: "",
        company: "",
        experienceLevel: "",
        workLocationTypes: "",
        timeCommitmentType: "",
        location: "",
        city: ""
    })
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCities = async () => {
            try {
                setIsLoading(true)
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
                console.error("Error fetching data: ", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCities()
    }, [])

    const validateForm = () => {
        const newErrors = {
            jobTitle: "",
            company: "",
            experienceLevel: "",
            workLocationTypes: "",
            timeCommitmentType: "",
            location: "",
            city: ""
        }

        let isValid = true

        if (!jobTitle.trim()) {
            newErrors.jobTitle = "Job title is required"
            isValid = false
        }

        if (!company.trim()) {
            newErrors.company = "Company name is required"
            isValid = false
        }

        if (!experienceLevel) {
            newErrors.experienceLevel = "Experience level is required"
            isValid = false
        }

        if (workLocationTypes.length === 0) {
            newErrors.workLocationTypes = "At least one work location type is required"
            isValid = false
        }

        if (!timeCommitmentType) {
            newErrors.timeCommitmentType = "Time commitment type is required"
            isValid = false
        }

        if (!location.trim()) {
            newErrors.location = "Company address is required"
            isValid = false
        }

        if (!city) {
            newErrors.city = "City is required"
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const postJob = async () => {
        const multipleJobType = workLocationTypes && workLocationTypes.length > 1
        const jobtypeVariable = multipleJobType ? workLocationTypes.join(", ") : workLocationTypes[0]
        
        try {
            const response = await fetch("http://127.0.0.1:5000/addJob", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: jobTitle,
                    company: company,
                    job_type: `${jobtypeVariable}, ${timeCommitmentType}`,
                    location: `${location}, ${city}`,
                    experience_level: experienceLevel,
                    tags: tags.join(", ") 
                })
            })

            const data = await response.json()

            if (!response.ok) {
                if (data.error && data.error.includes("job exists")) {
                    setShowJobExistsPopup(true)
                    throw new Error(data.error)
                } else {
                    throw new Error(data.error || `HTTP Error! status: ${response.status}`)
                }
            }

            return data
            
        } catch (error) {
            console.error("Error posting data: ", error)
            throw error
        }
    }

    const handleWorkLocationChange = (value) => {
        setWorkLocationTypes(prev => {
            if (prev.includes(value)) {
                return prev.filter(item => item !== value)
            } else {
                return [...prev, value]
            }
        })
        if (errors.workLocationTypes) {
            setErrors(prev => ({...prev, workLocationTypes: ""}))
        }
    }

    const handleTimeCommitmentChange = (value) => {
        setTimeCommitmentType(value)
        setDropdowns(prev => ({ ...prev, timeCommitment: false }))
        if (errors.timeCommitmentType) {
            setErrors(prev => ({...prev, timeCommitmentType: ""}))
        }
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

    const toggleDropdown = (dropdownName) => {
        const updatedDropdowns = { ...dropdowns }
        Object.keys(updatedDropdowns).forEach(key => {
            if (key !== dropdownName) {
                updatedDropdowns[key] = false
            }
        })
        
        updatedDropdowns[dropdownName] = !dropdowns[dropdownName]
        setDropdowns(updatedDropdowns)
    }

    const handleExperienceLevelChange = (level) => {
        setExperienceLevel(level)
        setDropdowns(prev => ({ ...prev, experienceLevel: false }))
        if (errors.experienceLevel) {
            setErrors(prev => ({...prev, experienceLevel: ""}))
        }
    }

    const handleCityChange = (selectedCity) => {
        setCity(selectedCity)
        setDropdowns(prev => ({ ...prev, city: false }))
        if (errors.city) {
            setErrors(prev => ({...prev, city: ""}))
        }
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            return
        }
        
        try {
            await postJob()
            setShowSuccessPopup(true)
        } catch (error) {
            
        }
    }

    const handlePopupOk = () => {
        navigate("/")
        window.scrollTo(0, 0)
    }

    const handlePopupRetry = () => {
        setShowJobExistsPopup(false)
        window.scrollTo(0,0)
    }

    return (
        <>
            <div className="addjobform">
                <h2 className="form-title">Add New Job</h2>
                
                <div className="form-group">
                    <label htmlFor="jobtitle" className="jobtitlelabel">Job Title: </label>
                    <input 
                        type="text" 
                        name="jobtitle" 
                        id="jobtitleinput" 
                        value={jobTitle}
                        onChange={(e) => {
                            setJobTitle(e.target.value)
                            if (errors.jobTitle) {
                                setErrors(prev => ({...prev, jobTitle: ""}))
                            }
                        }}
                        placeholder="Enter job title"
                        className={errors.jobTitle ? "error" : ""}
                    />
                    {errors.jobTitle && <div className="error-message">{errors.jobTitle}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="company" className="companylabel">Company: </label>
                    <input 
                        type="text" 
                        name="company" 
                        id="companyinput" 
                        value={company}
                        onChange={(e) => {
                            setCompany(e.target.value)
                            if (errors.company) {
                                setErrors(prev => ({...prev, company: ""}))
                            }
                        }}
                        placeholder="Enter company name"
                        className={errors.company ? "error" : ""}
                    />
                    {errors.company && <div className="error-message">{errors.company}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="experienceLevel" className="experiencelevelLabel">Experience Level: </label>
                    <div className="dropdown-container-ex">
                        <button 
                            type="button" 
                            className={`dropdown-toggle experiencelevel-btn ${experienceLevel ? 'has-selection experienceSelected' : ''} ${errors.experienceLevel ? "error" : ""}`}
                            onClick={() => toggleDropdown('experienceLevel')}
                        >
                            {experienceLevel || "Select experience level"}
                            <span className={`dropdown-arrow ${dropdowns.experienceLevel ? 'open' : ''}`}>▼</span>
                        </button>
                        {dropdowns.experienceLevel && (
                            <div className="dropdown-content">
                                {experienceleveltypes.map((level) => (
                                    <div 
                                        key={level} 
                                        className={`dropdown-option ${experienceLevel === level ? 'selected' : ''}`}
                                        onClick={() => handleExperienceLevelChange(level)}
                                    >
                                        <span>{level}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {errors.experienceLevel && <div className="error-message">{errors.experienceLevel}</div>}
                </div>

                <div className="jobtype">
                    <p className="jobtypeText">Job Type: </p>
                    <div className="jobtypeDivs">
                        <div className="dropdown-container">
                            <button 
                                type="button" 
                                className={`dropdown-toggle ${workLocationTypes.length > 0 ? 'has-selection' : ''} ${errors.workLocationTypes ? "error" : ""}`}
                                onClick={() => toggleDropdown('workLocation')}
                            >
                                Work Location
                                {workLocationTypes.length > 0 && (
                                    <span className="counter-circle">{workLocationTypes.length}</span>
                                )}
                                <span className={`dropdown-arrow ${dropdowns.workLocation ? 'open' : ''}`}>▼</span>
                            </button>
                            {dropdowns.workLocation && (
                                <div className="dropdown-content">
                                    {worklocations.map((worklocation) => (
                                        <label key={worklocation} className="dropdown-option">
                                            <input 
                                                type="checkbox" 
                                                checked={workLocationTypes.includes(worklocation)}
                                                onChange={() => handleWorkLocationChange(worklocation)}
                                            />
                                            <span>{worklocation}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                            {errors.workLocationTypes && <div className="error-message">{errors.workLocationTypes}</div>}
                        </div>

                        <div className="dropdown-container">
                            <button 
                                type="button" 
                                className={`dropdown-toggle ${timeCommitmentType ? 'has-selection' : ''} ${errors.timeCommitmentType ? "error" : ""}`}
                                onClick={() => toggleDropdown('timeCommitment')}
                            >
                                {timeCommitmentType || "Time Commitment"}
                                <span className={`dropdown-arrow ${dropdowns.timeCommitment ? 'open' : ''}`}>▼</span>
                            </button>
                            {dropdowns.timeCommitment && (
                                <div className="dropdown-content">
                                    {timecommitmenttypes.map((timecommitment) => (
                                        <div 
                                            key={timecommitment} 
                                            className={`dropdown-option ${timeCommitmentType === timecommitment ? 'selected' : ''}`}
                                            onClick={() => handleTimeCommitmentChange(timecommitment)}
                                        >
                                            <span>{timecommitment}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {errors.timeCommitmentType && <div className="error-message">{errors.timeCommitmentType}</div>}
                        </div>
                    </div>                
                </div>

                <div className="companyLocation">
                    <p className="companylocationText">Company Address:</p>

                    <div className="form-group">
                        <label htmlFor="location" className="locationLabel">Location: </label>
                        <input 
                            type="text" 
                            name="location" 
                            id="locationText" 
                            value={location}
                            onChange={(e) => {
                                setLocation(e.target.value)
                                if (errors.location) {
                                    setErrors(prev => ({...prev, location: ""}))
                                }
                            }}
                            placeholder="Enter company address"
                            className={errors.location ? "error" : ""}
                        />
                        {errors.location && <div className="error-message">{errors.location}</div>}
                    </div>

                    <div className="form-group">
                        <div className="dropdown-container">
                            <button 
                                type="button" 
                                className={`dropdown-toggle ${city ? 'has-selection' : ''} ${errors.city ? "error" : ""}`}
                                onClick={() => toggleDropdown('city')}
                                disabled={isLoading}
                            >
                                {isLoading ? "Loading cities..." : (city || "Select a city")}
                                <span className={`dropdown-arrow ${dropdowns.city ? 'open' : ''}`}>▼</span>
                            </button>
                            {dropdowns.city && !isLoading && (
                                <div className="dropdown-content city-dropdown">
                                    {cities.map((cityItem) => (
                                        <div 
                                            key={cityItem} 
                                            className={`dropdown-option ${city === cityItem ? 'selected' : ''}`}
                                            onClick={() => handleCityChange(cityItem)}
                                        >
                                            <span>{cityItem}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {errors.city && <div className="error-message">{errors.city}</div>}
                        </div>
                    </div>
                </div>

                <div className="tags">
                    <label htmlFor="tag">Tags: </label>
                    <div className="tagContainer">
                        {tags.map((tag, index) => (
                            <span key={index} className="tag">
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
                            name="tag" 
                            value={currentTag}
                            onChange={handleTagInput}
                            onKeyDown={handleTagKeyDown}
                            placeholder="Type tags separated by commas"
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn btn-cancel" onClick={() => {
                        navigate("/")
                        window.scrollTo(0, 0)
                    }}>Back</button>
                    <button type="button" className="btn btn-submit" onClick={handleSubmit}>Post Job</button>
                </div>
            </div>
            
            {showSuccessPopup && (
                <div className="popup-overlay">
                    <div className="success-popup">
                        <div className="popup-icon">✓</div>
                        <h3 className="popup-title">Job Added Successfully!</h3>
                        <p className="popup-message">Your job posting has been added to the platform.</p>
                        <button className="popup-button" onClick={handlePopupOk}>OK</button>
                    </div>
                </div>
            )}

            {showJobExistsPopup && (
                <div className="popup-overlay">
                    <div className="success-popup">
                        <div className="popup-icon-cross">X</div>
                        <h3 className="popup-title">Job Posting Failed!</h3>
                        <p className="popup-message">Your job already exists.</p>
                        <button className="popup-button" onClick={handlePopupRetry}>Retry</button>
                    </div>
                </div>
            )}
        </>
    )
}