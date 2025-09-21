import "../stylesheets/Filters.css"
import searchIcon from "../assets/searchIcon.png"
import { useState, useEffect } from "react"

export default function Filters({ isBlur }) { 
    const [workLocationsSelected, setWorkLocationsSelected] = useState([])
    const [timeCommitmentTypesSelected, setTimeCommitmentTypesSelected] = useState([])
    const [experienceLevelTypesSelected, setExperienceLevelTypesSelected] = useState([])
    const [citiesSelected, setCitiesSelected] = useState([])
    const [dropdowns, setDropdowns] = useState({
        workLocation: false,
        timeCommitment: false,
        experienceLevel: false,
        companyLocation: false
    })
    const [cities, setCities] = useState([])
    const [isLoading, setIsLoading] = useState()
    
    const worklocations = ["Onsite", "Hybrid", "Remote"]
    const timecommitmenttypes = ["Project-based", "Contract", "Temporary", "Internship", "Part-time", "Full-time"]
    const experienceleveltypes = ["Entry Level", "Associate Level", "Mid Level", "Senior Level", "Executive Level"]

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

    function checkToggle(item, type) {
        switch(type) {
            case 'worklocation':
                if (workLocationsSelected.includes(item)) {
                    setWorkLocationsSelected(workLocationsSelected.filter(element => element !== item))
                } else {
                    setWorkLocationsSelected([...workLocationsSelected, item])
                }
                break
            case 'timecommitmenttype':
                if (timeCommitmentTypesSelected.includes(item)) {
                    setTimeCommitmentTypesSelected(timeCommitmentTypesSelected.filter(element => element !== item))
                } else {
                    setTimeCommitmentTypesSelected([...timeCommitmentTypesSelected, item])
                }
                break
            case 'experienceleveltype':
                if (experienceLevelTypesSelected.includes(item)) {
                    setExperienceLevelTypesSelected(experienceLevelTypesSelected.filter(element => element !== item))
                } else {
                    setExperienceLevelTypesSelected([...experienceLevelTypesSelected, item])
                }
                break
            case 'companylocation':
                if (citiesSelected.includes(item)) {
                    setCitiesSelected(citiesSelected.filter(element => element !== item))
                } else {
                    setCitiesSelected([...citiesSelected, item])
                }
                break
            default:
                break       
        }
    }

    function isItemChecked(item, type) {
        switch(type) {
            case 'worklocation':
                return workLocationsSelected.includes(item)
            case 'timecommitmenttype':
                return timeCommitmentTypesSelected.includes(item)
            case 'experienceleveltype':
                return experienceLevelTypesSelected.includes(item)
            case 'companylocation':
                return citiesSelected.includes(item)
            default:
                return false
        }
    }

    function toggleDropdown(dropdownName) {
        const updatedDropdowns = { ...dropdowns }
        Object.keys(updatedDropdowns).forEach(key => {
            if (key !== dropdownName) {
                updatedDropdowns[key] = false
            }
        })
        
        updatedDropdowns[dropdownName] = !dropdowns[dropdownName]
        setDropdowns(updatedDropdowns)
    }

    return (
        <>
            <div className={`filtersSection ${isBlur ? "blurred" : ""}`}>
                <div className="searchBar">
                    <img src={searchIcon} alt="" width={20} height={20} />
                    <input type="text" className="searchInputField" placeholder="Search jobs..." />
                </div>

                <div className="dropdowns-container">
                    <div className="dropdownContainer">
                        <button 
                            type="button" 
                            className={`dropdownTog ${workLocationsSelected.length > 0 ? 'itemsSelected' : ''}`}
                            onClick={() => toggleDropdown('workLocation')}
                        >
                            <span className="dropdown-text">Work Location</span>
                            <span className="dropdown-indicators">
                                <span className={`counterCircle ${workLocationsSelected.length > 0 ? 'circleSelected' : ''}`}>
                                    {workLocationsSelected.length > 0 ? workLocationsSelected.length : ''}
                                </span>
                                <span className={`dropdown-arrow ${dropdowns.workLocation ? 'open' : ''}`}>▼</span>
                            </span>
                        </button>
                        {dropdowns.workLocation && (
                            <div className="dropdown-content">
                                {worklocations.map((worklocation) => (
                                    <label key={worklocation} className="dropdown-option">
                                        <input 
                                            type="checkbox" 
                                            checked={isItemChecked(worklocation, 'worklocation')}
                                            onChange={() => checkToggle(worklocation, 'worklocation')}
                                        />
                                        <span>{worklocation}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="dropdownContainer">
                        <button 
                            type="button" 
                            className={`dropdownTog ${timeCommitmentTypesSelected.length > 0 ? 'itemsSelected' : ''}`}
                            onClick={() => toggleDropdown('timeCommitment')}
                        >
                            <span className="dropdown-text">Time Commitment</span>
                            <span className="dropdown-indicators">
                                <span className={`counterCircle ${timeCommitmentTypesSelected.length > 0 ? 'circleSelected' : ''}`}>
                                    {timeCommitmentTypesSelected.length > 0 ? timeCommitmentTypesSelected.length : ''}
                                </span>
                                <span className={`dropdown-arrow ${dropdowns.timeCommitment ? 'open' : ''}`}>▼</span>
                            </span>
                        </button>
                        {dropdowns.timeCommitment && (
                            <div className="dropdown-content">
                                {timecommitmenttypes.map((timecommitment) => (
                                    <label key={timecommitment} className="dropdown-option">
                                        <input 
                                            type="checkbox" 
                                            checked={isItemChecked(timecommitment, 'timecommitmenttype')}
                                            onChange={() => checkToggle(timecommitment, 'timecommitmenttype')}
                                        />
                                        <span>{timecommitment}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="dropdownContainer">
                        <button 
                            type="button" 
                            className={`dropdownTog ${experienceLevelTypesSelected.length > 0 ? 'itemsSelected' : ''}`}
                            onClick={() => toggleDropdown('experienceLevel')}
                        >
                            <span className="dropdown-text">Experience Level</span>
                            <span className="dropdown-indicators">
                                <span className={`counterCircle ${experienceLevelTypesSelected.length > 0 ? 'circleSelected' : ''}`}>
                                    {experienceLevelTypesSelected.length > 0 ? experienceLevelTypesSelected.length : ''}
                                </span>
                                <span className={`dropdown-arrow ${dropdowns.experienceLevel ? 'open' : ''}`}>▼</span>
                            </span>
                        </button>
                        {dropdowns.experienceLevel && (
                            <div className="dropdown-content">
                                {experienceleveltypes.map((experiencelevel) => (
                                    <label key={experiencelevel} className="dropdown-option">
                                        <input 
                                            type="checkbox" 
                                            checked={isItemChecked(experiencelevel, 'experienceleveltype')}
                                            onChange={() => checkToggle(experiencelevel, 'experienceleveltype')}
                                        />
                                        <span>{experiencelevel}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="dropdownContainer">
                        <button 
                            type="button" 
                            className={`dropdownTog ${citiesSelected.length > 0 ? 'itemsSelected' : ''}`}
                            onClick={() => toggleDropdown('companyLocation')}
                        >
                            <span className="dropdown-text">Location</span>
                            <span className="dropdown-indicators">
                                <span className={`counterCircle ${citiesSelected.length > 0 ? 'circleSelected' : ''}`}>
                                    {citiesSelected.length > 0 ? citiesSelected.length : ''}
                                </span>
                                <span className={`dropdown-arrow ${dropdowns.companyLocation ? 'open' : ''}`}>▼</span>
                            </span>
                        </button>
                        {dropdowns.companyLocation && (
                            <div className="dropdown-content">
                                {cities.map((city) => (
                                    <label key={city} className="dropdown-option">
                                        <input 
                                            type="checkbox" 
                                            checked={isItemChecked(city, 'companylocation')}
                                            onChange={() => checkToggle(city, 'companylocation')}
                                        />
                                        <span>{city}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}