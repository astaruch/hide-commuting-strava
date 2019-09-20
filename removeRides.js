'use strict'

console.log('Hide Short Rides loaded')

const removeRides = () => {
  console.time('strava-extension')
  const activities = document.getElementsByClassName('activity')
  for (let i = activities.length - 1; i >= 0; i--) {
    const isRide = activities[i].getElementsByClassName('icon-ride').length > 0
    if (!isRide) {
      // we are not interested in other activites than bicycle
      continue
    }
    // stats for one activity are:
    //   0: distance (km)
    //   1: elevation (m)
    //   2: time (hh mm / mm ss)
    //   3: achievments
    const stats = activities[i].getElementsByClassName('stat')
    const distance = stats[0].innerText.match(/\d+\.\d+/)[0]

    if (Number(distance) > 10) {
      // we are not interested in long rides
      continue
    }
    console.log(`Removing ride with length ${distance} km`)
    activities[i].parentNode.removeChild(activities[i])
  }
  console.timeEnd('strava-extension')
}

removeRides()
