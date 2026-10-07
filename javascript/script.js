// Accordion functionality
function toggleAccordion(btn) {
  const item = btn.closest('.accordion-open');

  if (!item) return;

  const isOpen = item.classList.contains('open');

  document.querySelectorAll('.accordion-open').forEach((accordion) => {
    accordion.classList.remove('open');
  });

  if (!isOpen) {
    item.classList.add('open');
  }
}

document.querySelectorAll('form[data-success-page]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    window.location.assign(form.dataset.successPage);
  });
});

// Hamburger Menu

const menuButton = document.querySelector('.menu-toggle');
const siteNavigation = document.getElementById('site-navigation');

if (menuButton && siteNavigation) {
  const closeMenu = () => {
    document.querySelector('header')?.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    document.querySelector('header')?.classList.toggle('menu-open', !isOpen);
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  });

  siteNavigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.matchMedia('(min-width: 825px)').addEventListener('change', closeMenu);
}

// Header hide/show on scroll

const pageHeader = document.querySelector('header');

if (pageHeader) {
  let previousScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const scrollDifference = currentScrollY - previousScrollY;

    if (currentScrollY <= pageHeader.offsetHeight || scrollDifference < -4) {
      pageHeader.classList.remove('header-hidden');
    } else if (scrollDifference > 4) {
      pageHeader.classList.add('header-hidden');
    }

    previousScrollY = currentScrollY;
  }, { passive: true });
}

// Savings Calculator
const systemData = {
  solar: {
    name: "Solar PV",
    savingsRate: 0.30,
    carbonRate: 0.7
  },
  wind: {
    name: "Wind",
    savingsRate: 0.25,
    carbonRate: 0.6
  },
  geothermal: {
    name: "Geothermal",
    savingsRate: 0.2,
    carbonRate:0.50
  }
}

// Store report information
let reportData = null;

// Get HTML elements
const electricityPrice = 0.30;

const form = document.getElementById("savingsForm");

const quarterlyBillInput = document.getElementById("quarterlyBill");

const systemInput = document.getElementById("system");

const yearsInput = document.getElementById("years");

const errorMessage = document.getElementById("errorMessage");

const annualSavingsOutput = document.getElementById("annualSavings");

const lifetimeSavingsOutput = document.getElementById("lifetimeSavings");

const annualCarbonOutput = document.getElementById("annualCarbon");

const lifetimeCarbonOutput =
    document.getElementById("lifetimeCarbon");

const recommendationOutput = document.getElementById("recommendationText");
const downloadButton = document.getElementById("downloadReport");

// Calculate the savings

form.addEventListener("submit", function(event){
  event.preventDefault();
  calculateSavings();
});

function calculateSavings() {
  errorMessage.textContent ="";

  const quarterlyBill = Number(quarterlyBillInput.value);
  const system = systemInput.value;
  const years = Number(yearsInput.value);

  // Validate quarterly bill
  if (quarterlyBill <= 0 || isNaN(quarterlyBill)){
    errorMessage.textContent = "Please enter a valid quarterly electricity bill.";
    return;
  }

  // Validate renewable energy system
  if(system==="") {
    errorMessage.textContent = "Please select a renewable energy system";
    return;
  }

  // Validate ownership period
  if (years <=0 || 
    isNaN(years) || 
    !Number.isInteger(years)
  ) {
    errorMessage.textContent = "Please enter a valid number of whole years.";
  return;
}

// Calculations

//Get selected system data
const selectedSystem = systemData[system];

// Annual Electricity Cost
const annualElectricityCost = quarterlyBill * 4;

// Calculate annual savings
const annualSavings =
  annualElectricityCost * selectedSystem.savingsRate;

  // Calculate lifetime savings
const lifetimeSavings = annualSavings * years;

// Estimate annual electricity usage
const annualKwh =
annualElectricityCost / electricityPrice;

// Calculate carbon reduction
const annualCarbon =
annualKwh * selectedSystem.carbonRate;

// Calculate lifetime carbon reduction
const lifetimeCarbon =
annualCarbon * years;

// Display financial results

annualSavingsOutput.textContent =
`$${annualSavings.toLocaleString("en-Au", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})}`;

lifetimeSavingsOutput.textContent =
`$${lifetimeSavings.toLocaleString("en-Au", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})}`;

// Display environmental results
annualCarbonOutput.textContent =
`${annualCarbon.toLocaleString("en-Au", {
  minimumFractionDigits: 0
})}kg CO₂-e`;

lifetimeCarbonOutput.textContent =
`${lifetimeCarbon.toLocaleString("en-Au", {
  minimumFractionDigits: 0
})}kg CO₂-e`;

// Generate recommendation
let recommendation;
if (annualSavings >= 1000) {
  recommendation =
  `Based on these estimates, ${selectedSystem.name} could provide significant financial savings. It may be a suitable renewable energy option for your household.`;
} else if (annualSavings >= 500) {
  recommendation =
  `Based on these estimates, ${selectedSystem.name} could provide moderate financial savings and environmental benefits.`;
} else {
  recommendation =
  `Based on these estimates, the potential financial savings are relatively low. You may wish to compare the available renewable energy options before making a decision.`;
}

recommendationOutput.textContent = recommendation;

// Download Savings Report

// Store information for the report
reportData = {
  dateGenerated: new Date (),
  system: selectedSystem.name,
  quarterlyBill: quarterlyBill,
  years: years,
  annualSavings: annualSavings,lifetimeSavings: lifetimeSavings,annualCarbon: annualCarbon,
  lifetimeCarbon: lifetimeCarbon,
  recommendation: recommendation
};

// Enable download button
downloadButton.disabled = false;
}

// Generate the report
function generateReport() {
  if (reportData === null){
    return;
  }

  const date =
  reportData.dateGenerated
    .toLocaleDateString("en-Au");

  const report = `
  HT GREEN
  RENEWABLE ENERGY SAVINGS REPORT
  ===============================

  Date Generated:
  ${date}

  INPUTS
  ------------------------------------------
  Renewable Energy System:
  ${reportData.system}

  Quarterly Electricity Bill:
  $${reportData.quarterlyBill.toFixed(2)}

  Years of Ownership:
  ${reportData.years} years

  CALCULATOR RESULTS
  ----------------------------------------
  Estimated Annual Savings:
  $${reportData.annualSavings.toFixed(2)}

  Estimated Lifetime Savings:
  $${reportData.lifetimeSavings.toFixed(2)}

  Estimated Annual Carbon Reduction:
  ${reportData.annualCarbon.toFixed(0)} kg CO2-e

  Estimated Lifetime Carbon Reduction:
  ${reportData.lifetimeCarbon.toFixed(0)} kg CO2-e

  RECOMMENDATION
  ----------------------------------------
  ${reportData.recommendation}

  CALCULATOR ASSUMPTIONS
  ----------------------------------------
  Estimated electricity price:
  $0.30 per kWh

  Solar PV estimated savings:
  30%

  Wind estimated savings:
  25%

  Geothermal estimated savings:
  20%

  IMPORTANT INFORMATION
  ----------------------------------------
  This report contains estimates generated by
  the HT Green Renewable Energy Savings
  Calculator.

  The calculations use estimated values and
  assumptions for demonstration purposes.

  ========================================
    `;

    downloadReport (report);

}

// Download TXT file
function downloadReport (report) {

  const blob =
    new Blob ([report], {
      type: "text/plain"
    });

    const url =
    URL.createObjectURL(blob);

    const link = 
      document.createElement("a");

      link.href = url;

      link.download = 
      "HT-Green-Savings-Report.txt";

      link.click();

      url.revokeObjectURL(url);
}

// Download Button
downloadButton.addEventListener("click", function() {
  generateReport();
  });