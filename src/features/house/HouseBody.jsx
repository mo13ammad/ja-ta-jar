import React from 'react'
import HouseFacilitties from './houseComponents/HouseFacilitties'
import HouseRules from './houseComponents/HouseRules'
import HouseLocation from './houseComponents/HouseLocation'
import HouseComments from './houseComponents/HouseComments'
import HouseReservation from './houseComponents/HouseReservation'

function HouseBody() {
  return (
    <div>
        <HouseReservation/>
        <HouseFacilitties/>
        <HouseRules/>
        <HouseLocation/>
        <HouseComments/>
    </div>
  )
}

export default HouseBody