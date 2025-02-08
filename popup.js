document.getElementById("saveJob").addEventListener("click", saveJob);
document.getElementById("exportExcel").addEventListener("click", exportToExcel);

async function saveJob() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => ({
        title: document.title,
        url: location.href,
        // Add more data scraping logic here
      }),
    },
    (results) => {
      const jobData = results[0].result;
      chrome.storage.local.get({ jobs: [] }, (data) => {
        const jobs = [...data.jobs, jobData];
        chrome.storage.local.set({ jobs });
      });
    }
  );
}

function exportToExcel() {
  chrome.storage.local.get({ jobs: [] }, (data) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Title,URL,Date Applied,Status,Notes\n" +
      data.jobs
        .map(
          (job) =>
            `${job.title},${job.url},${new Date().toISOString()},Applied,"${
              job.notes
            }"`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "job_applications.csv");
    document.body.appendChild(link);
    link.click();
  });
}
