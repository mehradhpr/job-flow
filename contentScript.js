// contentScript.js
function setupButtonListeners() {
  document.addEventListener(
    "click",
    async function (e) {
      // Check if clicked element or its parent is an apply button
      const clickedButton = e.target.closest("button") || e.target.closest("a");
      if (!clickedButton) return;

      // Get button text content
      const buttonText = clickedButton.textContent.trim().toLowerCase();

      if (buttonText.includes("easy apply")) {
        // Easy Apply case - use LinkedIn URL
        const jobData = scrapeJobData();
        jobData.url = window.location.href;
        chrome.runtime.sendMessage({ action: "saveJob", jobData: jobData });
      } else if (buttonText.includes("apply")) {
        // Regular Apply case
        const jobData = scrapeJobData();

        // Immediately notify background script that we're about to apply
        console.log("Apply button clicked, sending pendingApply message");
        chrome.runtime.sendMessage({
          action: "pendingApply",
          jobData: jobData,
        });
      }
    },
    true
  ); // Added 'true' for event capture phase
}

function scrapeJobData() {
  if (window.location.hostname.includes("linkedin.com")) {
    const jobTitle =
      document
        .querySelector(".jobs-unified-top-card__job-title")
        ?.innerText?.trim() ||
      document
        .querySelector(".job-details-jobs-unified-top-card__job-title")
        ?.innerText?.trim() ||
      document.querySelector("h1")?.innerText?.trim() ||
      "Unknown Title";

    const companyName =
      document
        .querySelector(".jobs-unified-top-card__company-name")
        ?.innerText?.trim() ||
      document
        .querySelector(".job-details-jobs-unified-top-card__company-name")
        ?.innerText?.trim() ||
      document.querySelector(".jobs-company__name")?.innerText?.trim() ||
      "Unknown Company";

    return {
      title: jobTitle,
      company: companyName,
      dateApplied: new Date().toISOString().split("T")[0],
    };
  } else {
    // Non-LinkedIn page scraping logic remains the same
    const jobTitle =
      document.querySelector("h1")?.innerText?.trim() ||
      document.title.split("-")[0]?.trim() ||
      "Unknown Title";

    const companyName =
      document.querySelector(".company-name")?.innerText?.trim() ||
      document.title.split("-")[1]?.trim() ||
      "Unknown Company";

    return {
      title: jobTitle,
      company: companyName,
      url: window.location.href,
      dateApplied: new Date().toISOString().split("T")[0],
    };
  }
}

// Set up listeners when the content script loads
setupButtonListeners();

// Re-run setup when URL changes (for single-page applications)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setupButtonListeners();
  }
}).observe(document, { subtree: true, childList: true });
