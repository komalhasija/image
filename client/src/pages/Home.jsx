import React from 'react'
import Header from '../components/Header.jsx'
import Steps from '../components/steps.jsx'
import Description from '../components/Description.jsx'
import Testimonials from '../components/Testimonials.jsx'
import Generate from '../components/Generate.jsx'

const Home = () => {
  return (
    <div>
      <Header/>
      <Steps/>
      <Description/>
      <Testimonials/>
      <Generate/>
      
    </div>
  )
}

export default Home