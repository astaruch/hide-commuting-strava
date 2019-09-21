'use strict'
const MutationObserver = window.MutationObserver || window.WebKitMutationObserver

const removeIfShort = node => {
  // we are interested only in activites
  if (!(node.className && node.className.includes('activity'))) {
    return
  }

  // we are not interested in other activites than bicycle
  const isRide = node.getElementsByClassName('icon-ride').length > 0
  if (!isRide) {
    return
  }

  // stats for one activity are:
  //   0: distance (km)
  //   1: elevation (m)
  //   2: time (hh mm / mm ss)
  //   3: achievments
  const stats = node.getElementsByClassName('stat')
  const distance = stats[0].innerText.match(/\d+\.\d+/)[0]

  // we want to delete only short rides
  if (Number(distance) > 10) {
    return
  }

  console.log(`Deleting ${distance} km ride`)
  node.parentNode.removeChild(node)
}

// Callback function to execute when mutations are observed
const watchFeed = (mutationsList, observer) => {
  console.log('Change in feed detected')
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => removeIfShort(node))
    }
  }
}

const addObserverWhenReady = () => {
  const feed = document.getElementsByClassName('feed')[0]
  if (!feed) {
    // feed is not existing. try again in 500ms
    console.log('Feed is not present. Checking in 500ms')
    window.setTimeout(addObserverWhenReady, 500)
    return
  }
  console.log('Strava feed detected. Removing short rides')
  // initial remove from feed
  for (const node of feed.children) {
    removeIfShort(node)
  }

  const config = {
    childList: true
  }
  // watch changes in feed
  const observer = new MutationObserver(watchFeed)
  observer.observe(feed, config)
  console.log('Observer started')
}

addObserverWhenReady()
