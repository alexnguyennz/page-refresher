import type { PlasmoMessaging } from "@plasmohq/messaging"

import { setBadge } from "./setBadge"

let tabIdList = {}

// *** Reload tab functionality. *** //
function reloadTab(tabId: number) {
  // tabIdList[tabID]["bypassCache"]
  //   ? chrome.tabs.reload(tabID, { bypassCache: true })
  //   : chrome.tabs.reload(tabID)

  chrome.tabs.reload(tabId)
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { interval } = req.body // interval passed from Popup

  chrome.tabs.query(
    { active: true, currentWindow: true, windowType: "normal" },
    (tab) => {
      const tabId = tab[0].id

      // only allow one reload on a tab at one time
      if (tabIdList[tabId].hasOwnProperty("reloadInfo") === true) {
        clearInterval(tabIdList[tabId]["reloadInfo"]["intervalID"])
        clearInterval(tabIdList[tabId]["reloadInfo"]["timeLeftID"])
        delete tabIdList[tabId]["reloadInfo"]
      }

      tabIdList[tabId]["reloadInfo"] = {}

      // store the reload
      tabIdList[tabId]["reloadInfo"]["interval"] = interval
      tabIdList[tabId]["reloadInfo"]["timeLeft"] = interval

      setBadge(tabId, interval)

      const intervalID = setInterval(() => reloadTab(tabId), interval * 1000)

      const timeLeftID = setInterval(() => {
        tabIdList[tabId]["reloadInfo"]["timeLeft"]--

        if (tabIdList[tabId]["reloadInfo"]["timeLeft"] === 0)
          tabIdList[tabId]["reloadInfo"]["timeLeft"] = interval

        setBadge(tabId, tabIdList[tabId]["reloadInfo"]["timeLeft"]) // update badge text with current time left
      }, 1000)

      tabIdList[tabId]["reloadInfo"]["intervalID"] = intervalID
      tabIdList[tabId]["reloadInfo"]["timeLeftID"] = timeLeftID

      res.send({})
    }
  )
}

export default handler
