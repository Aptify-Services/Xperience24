export function makeFocusableElementsNonFocusable() {
  // Select all focusable elements
  const focusableSVGElements = document.querySelectorAll(`svg`);

  // Loop through each focusable element and set tabindex="-1"
  focusableSVGElements.forEach((element) => {
    element.setAttribute("tabindex", "-1");
  });
}

export function addAriaLabelOnGridButtonGridList() {
  document.querySelectorAll('[data-pc-section="listbutton"]').forEach(function (button) {
    button.setAttribute("aria-label", "list button");
  });
  document.querySelectorAll('[data-pc-section="gridbutton"]').forEach(function (button) {
    button.setAttribute("aria-label", "grid button");
  });
  // closebutton
}

export function addAriaLabelOnCloseButton() {
  document.querySelectorAll('[data-pc-section="closebutton"]').forEach(function (button) {
    button.setAttribute("aria-label", "close button");
  });
}

export function addAriaLabelOnExpandIcon() {
  document.querySelectorAll('[data-pc-section="trigger"]').forEach(function (button) {
    // Check if role="button" and aria-haspopup="listbox" already exist
    if (
      button.getAttribute("role") === "button" &&
      button.getAttribute("aria-haspopup") === "listbox"
    ) {
      // Add aria-label if it doesn't already exist
      if (!button.hasAttribute("aria-label")) {
        button.setAttribute("aria-label", "trigger menu");
      }
    }
  });
}

export function addTableWithAriaLabelPayAmount() {
  const table = document.querySelector("table");
  if (table) {
    const rows = table.querySelectorAll("tbody tr");

    rows.forEach((row, index) => {
      const input = row.querySelector(".p-inputtext.p-component.p-inputnumber-input[type='text']");
      if (input) {
        const inputId = `${index + 1}-PayAmount`;
        input.id = inputId;
        input.name = inputId;
        input.setAttribute("aria-labelledby", inputId);
        input.setAttribute("aria-label", inputId);
      }
    });
  }
}
