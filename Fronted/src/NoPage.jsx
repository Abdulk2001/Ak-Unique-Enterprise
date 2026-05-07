import React from 'react'
import Navbar from './component/navbar'
import Navbar2 from './component/navbar2'
import Footer from './component/footer'
import { Link } from 'react-router-dom'
import { FaLongArrowAltLeft } from "react-icons/fa";

export default function NoPage() {
  return (
    <>
      <Navbar />
      <Navbar2 />
      <div className='no-page-bg'>
        <div>
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <Link to='/'><button className='btn btn-dark p-2'><FaLongArrowAltLeft /> Go Back to Home</button></Link>
        </div>
      </div>
      <Footer />
    </>
  )
}
