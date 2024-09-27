import React from 'react'
import {Hero} from '../Hero'
import { HomeCard } from '../HomeCard'
import { Joblistings } from '../Joblistings'
export const Home = () => {
  return (
  <>
    <Hero/>
    <HomeCard/>
    <Joblistings isHome={true}/>
    </>
  )
}
