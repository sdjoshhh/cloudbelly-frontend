import { useState } from "react"
import BackgroundHome from "../background/BackgroundHome"
import SearchBar from "./searchBar"
import { RxCrossCircled } from "react-icons/rx"
import LineChart from "../chart/lineChart"
import BoxPlot from "../chart/BoxPlot"

function Analytics() {
  const [selectedSuburbs, setSelectedSuburbs] = useState([])

  const removeSuburb = (suburb) => {
    setSelectedSuburbs(prev => prev.filter(s => s !== suburb));
  }

  return (
    <>
      <div className="relative min-h-screen bg-slate-50 mt-16 items-center">
        <BackgroundHome />
        <SearchBar onSearch={(q) => {
          if (q && !selectedSuburbs.includes(q)) {
            setSelectedSuburbs(prev => [...prev, q]);
          }
        }}/>
        {/* list selected suburbs */}
        <div className="relative flex flex-row max-w-200 flex-wrap gap-2 px-8 mt-4 justify-center">
        {selectedSuburbs.map((label, index) => (
          <div
            key={index}
            className="relative flex flex-row px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm"
          >
            {label}
            <button
              className="pl-0.5 cursor-pointer"
              onClick={() => removeSuburb(label)}
            ><RxCrossCircled /></button>
          </div>
        ))}
        </div>
        {/* charts */}
        {selectedSuburbs.length > 0 && (
          <div className="relative px-8 mt-4 w-full">
            <LineChart suburbs={selectedSuburbs}/>
            <BoxPlot suburbs={selectedSuburbs}/>
          </div>
        )}
      </div>
    </>
  )
}

export default Analytics
