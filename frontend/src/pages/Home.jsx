import React from 'react'
import SideBar from '../component/SideBar'
import MessageArea from '../component/MessageArea'

function Home() {
  return (
    <div className='w-full h-screen flex overflow-hidden' style={{ fontFamily: "'DM Mono', monospace", background: '#080c10' }}>
      <SideBar />
      <MessageArea />
    </div>
  )
}

export default Home