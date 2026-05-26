import React from 'react'
import SideBar from './SideBar'
import ProjectTable from './ProjectTable'

const Dashboard = () => {
  return (
    <div className='flex h-screen'>
       <SideBar/>
 <div className="flex-1 bg-gray-900">
    <ProjectTable/>
 </div>
    </div>
  )
}

export default Dashboard
