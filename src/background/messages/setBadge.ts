import type { PlasmoMessaging } from "@plasmohq/messaging"

// *** Convert total seconds into a 00:00 time format. *** //
export function getTimeFormat(totalSeconds) {
  const minutes = Math.trunc(totalSeconds / 60) // divide by 60 and remove all decimals
  let seconds = totalSeconds % 60 // use remainder as seconds

  if (seconds < 10) seconds = "0" + seconds // if seconds is lower than 10, add 0 e.g. 05; otherwise leave as normal

  const formattedTime = minutes + ":" + seconds

  return formattedTime
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const tabId = req.body.tabId

  setBadge(tabId)
}

export function setBadge(tabId: number, interval?: number) {
  const timeLeft = getTimeFormat(interval) // make the interval readable (60 => 1:00)

  chrome.action.setBadgeBackgroundColor({
    tabId: tabId,
    color: "#ff6c52"
  })

  chrome.action.setBadgeText({ tabId, text: timeLeft })
}

export default handler
