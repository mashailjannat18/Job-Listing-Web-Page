import { useState } from "react"
import "../stylesheets/Home.css"
import Header from "../Components/Header"
import Filters from "../Components/Filters"
import JobsSection from "../Components/JobsSection"

export default function Home() {
  const [blurDisplay, setBlurDisplay] = useState(false)

  const setBlur = () => {
    setBlurDisplay(prev => !prev)
  }

  return (
    <>
      <Header 
        isBlur={blurDisplay}
      />
      <div className="afterHeader">
        <div className="content-container">
          <Filters 
            isBlur={blurDisplay}
          />
          <JobsSection 
            toggleBlur={setBlur}
          />
        </div>
      </div>
    </>
  )
}