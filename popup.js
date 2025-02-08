// popup.js
document.addEventListener("DOMContentLoaded", () => {
  updateJobList();
  document
    .getElementById("exportExcel")
    .addEventListener("click", exportToExcel);
  document.getElementById("clearAll").addEventListener("click", clearAllJobs);
});

function clearAllJobs() {
  if (
    confirm(
      "Are you sure you want to clear all tracked jobs? This cannot be undone."
    )
  ) {
    chrome.storage.local.set({ jobs: [] }, () => {
      updateJobList();
    });
  }
}

function updateJobList() {
  const jobList = document.getElementById("jobList");
  chrome.storage.local.get({ jobs: [] }, (data) => {
    if (data.jobs.length === 0) {
      jobList.innerHTML = '<div class="job-entry">No jobs tracked yet</div>';
    } else {
      jobList.innerHTML = data.jobs
        .map(
          (job) => `
          <div class="job-entry">
            <strong>${job.title}</strong>
            <br>${job.company}
            <br>Date: ${job.dateApplied}
          </div>
        `
        )
        .join("");
    }
  });
}

function exportToExcel() {
  chrome.storage.local.get({ jobs: [] }, (data) => {
    if (data.jobs.length === 0) {
      alert("No jobs to export!");
      return;
    }

    let csvContent = "Title,Company,URL,Date\n";

    data.jobs.forEach((job) => {
      const row = [
        `"${job.title.replace(/"/g, '""')}"`,
        `"${job.company.replace(/"/g, '""')}"`,
        `"${job.url}"`,
        `"${job.dateApplied}"`,
      ].join(",");
      csvContent += row + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `job_applications_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}
