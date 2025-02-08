// background.js
let pendingJobData = null;

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message:", message.action);

  if (message.action === "saveJob") {
    saveJobToStorage(message.jobData);
  } else if (message.action === "pendingApply") {
    console.log("Storing pending job data:", message.jobData);
    pendingJobData = message.jobData;
    // Set a timeout to clear pending data if no tab is created
    setTimeout(() => {
      pendingJobData = null;
    }, 10000); // Clear after 10 seconds
  }
});

// Listen for new tabs being created
chrome.tabs.onCreated.addListener((tab) => {
  console.log("New tab created, pending job data:", pendingJobData);
  if (pendingJobData) {
    // Wait for the tab to finish loading
    chrome.tabs.onUpdated.addListener(function listener(
      tabId,
      info,
      updatedTab
    ) {
      if (tabId === tab.id && info.status === "complete") {
        console.log("Tab loaded:", updatedTab.url);
        // Only proceed if this is not a LinkedIn URL
        if (!updatedTab.url.includes("linkedin.com")) {
          // Remove the listener
          chrome.tabs.onUpdated.removeListener(listener);

          // Save the job with the external URL
          const jobData = {
            ...pendingJobData,
            url: updatedTab.url,
          };

          saveJobToStorage(jobData);
          // Clear the pending job data
          pendingJobData = null;
        }
      }
    });
  }
});

function saveJobToStorage(jobData) {
  chrome.storage.local.get({ jobs: [] }, (data) => {
    // Check if job with same URL already exists
    if (!data.jobs.some((job) => job.url === jobData.url)) {
      const jobs = [...data.jobs, jobData];
      chrome.storage.local.set({ jobs });
    }
  });
}
