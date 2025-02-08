chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "autofill") {
    autofillFormFields();
  }
});

function autofillFormFields() {
  // Customize these selectors for target websites
  const fields = {
    'input[name="name"]': "John Doe",
    'input[name="email"]': "john@example.com",
    // Add more field selectors and values
  };

  Object.entries(fields).forEach(([selector, value]) => {
    const element = document.querySelector(selector);
    if (element) {
      element.value = value;
      element.dispatchEvent(new Event("change"));
    }
  });
}
