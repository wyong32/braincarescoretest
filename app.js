const questions = [
  {
    key: "bloodPressure",
    category: "Physical",
    title: "Resting blood pressure",
    hint: "Use your most recent resting reading if you know it. If not, choose the closest option and discuss it with a clinician.",
    options: [
      { label: "Greater than 140/90, with or without treatment", points: 0 },
      { label: "120-139/80-89, with or without treatment", points: 2 },
      { label: "Less than 120/80", points: 3 }
    ]
  },
  {
    key: "bloodSugar",
    category: "Physical",
    title: "Hemoglobin A1c",
    hint: "This is usually measured by a medical professional.",
    options: [
      { label: "Greater than 6.4", points: 0 },
      { label: "Between 5.7 and 6.4", points: 1 },
      { label: "Less than 5.7", points: 2 }
    ]
  },
  {
    key: "cholesterol",
    category: "Physical",
    title: "Cholesterol",
    hint: "The official worksheet uses total cholesterol, with a note for people with cardiovascular disease.",
    options: [
      { label: "190 mg/dL or higher", points: 0 },
      { label: "No treatment required or less than 190 mg/dL", points: 1 },
      { label: "If cardiovascular disease is present, LDL is in accordance with current CDC recommendations", points: 1 }
    ]
  },
  {
    key: "bmi",
    category: "Physical",
    title: "Body mass index",
    hint: "BMI is one screening measure and does not replace medical judgment.",
    helper: {
      text: "Don't know your BMI?",
      linkText: "Calculate it here",
      href: "/bmi-calculator/"
    },
    options: [
      { label: "Lower than 18.5 kg/m2", points: 1 },
      { label: "18.5-25 kg/m2", points: 2 },
      { label: "25-29.9 kg/m2", points: 1 },
      { label: "Greater than 30 kg/m2", points: 0 }
    ]
  },
  {
    key: "nutrition",
    category: "Lifestyle",
    title: "Nutrition",
    hint: "Count how many of the worksheet recommendations your typical weekly diet includes: fruit/vegetables, lean protein, whole grains, sodium, and sugar-sweetened beverages.",
    options: [
      { label: "Does not include at least 2 of the recommendations", points: 0 },
      { label: "Includes 2 or more of the recommendations", points: 1 },
      { label: "Includes 3 or more of the recommendations", points: 2 }
    ]
  },
  {
    key: "alcohol",
    category: "Lifestyle",
    title: "Alcohol",
    hint: "Choose the number of alcoholic drinks in a typical week.",
    options: [
      { label: "4 or more alcoholic drinks per week", points: 0 },
      { label: "2-3 alcoholic drinks per week", points: 1 },
      { label: "0-1 alcoholic drink per week", points: 2 }
    ]
  },
  {
    key: "smoking",
    category: "Lifestyle",
    title: "Smoking",
    hint: "The official worksheet gives full points for never smoking or quitting more than one year ago.",
    options: [
      { label: "Current smoker", points: 0 },
      { label: "Never smoked or quit more than a year ago", points: 3 }
    ]
  },
  {
    key: "aerobic",
    category: "Lifestyle",
    title: "Aerobic activity",
    hint: "Moderate activity includes walking. High intensity activity is more vigorous.",
    options: [
      { label: "Less than 150 minutes moderate or 75 minutes high intensity per week", points: 0 },
      { label: "At least 150 minutes moderate or 75 minutes high intensity per week", points: 1 }
    ]
  },
  {
    key: "sleep",
    category: "Lifestyle",
    title: "Sleep",
    hint: "Consider both sleep duration and whether sleep disturbances are treated.",
    options: [
      { label: "Untreated sleep disorder and/or sleeps less than 7 hours per night", points: 0 },
      { label: "Treated sleep disturbances and 7-8 hours of routine sleep per night", points: 1 }
    ]
  },
  {
    key: "stress",
    category: "Social Emotional",
    title: "Stress",
    hint: "Pick the option that best reflects how stress affects your daily functioning.",
    options: [
      { label: "High stress often makes it difficult to function", points: 0 },
      { label: "Moderate stress occasionally makes it difficult to function", points: 1 },
      { label: "Manageable stress rarely makes it difficult to function", points: 2 }
    ]
  },
  {
    key: "relationships",
    category: "Social Emotional",
    title: "Social relationships",
    hint: "The worksheet asks about close connections other than a spouse or children.",
    options: [
      { label: "Few or no close connections other than spouse or children", points: 0 },
      { label: "At least two people, other than spouse or children, I feel close with and could call upon for help", points: 1 }
    ]
  },
  {
    key: "meaning",
    category: "Social Emotional",
    title: "Meaning in life",
    hint: "Choose the statement that best fits your usual experience.",
    options: [
      { label: "I often struggle to find value or purpose in my life", points: 0 },
      { label: "I generally feel that my life has meaning and/or purpose", points: 1 }
    ]
  }
];

let currentStep = 0;
const answers = {};

const questionMount = document.querySelector("[data-question]");
const progressFill = document.querySelector("[data-progress-fill]");
const progressText = document.querySelector("[data-progress-text]");
const resultCard = document.querySelector("[data-result]");
const scoreValue = document.querySelector("[data-score-value]");
const physicalValue = document.querySelector("[data-physical]");
const lifestyleValue = document.querySelector("[data-lifestyle]");
const socialValue = document.querySelector("[data-social]");
const interpretation = document.querySelector("[data-interpretation]");
const relatedTools = document.querySelector("[data-related-tools]");

function renderQuestion() {
  if (!questionMount) return;
  const question = questions[currentStep];
  const selected = answers[question.key];
  const percent = Math.round((Object.keys(answers).length / questions.length) * 100);
  progressFill.style.width = `${percent}%`;
  progressText.textContent = `${Object.keys(answers).length} of ${questions.length} answered`;

  questionMount.innerHTML = `
    <p class="step-label">Question ${currentStep + 1} of ${questions.length} - ${question.category}</p>
    <h3>${question.title}</h3>
    <p class="hint">${question.hint}</p>
    ${question.helper ? `<p class="question-helper">${question.helper.text} <a href="${question.helper.href}">${question.helper.linkText}</a></p>` : ""}
    <div class="options" role="radiogroup" aria-label="${question.title}">
      ${question.options.map((option, index) => `
        <label class="option">
          <input type="radio" name="${question.key}" value="${index}" ${selected === index ? "checked" : ""}>
          <span>${option.label}</span>
        </label>
      `).join("")}
    </div>
    <div class="button-row">
      <button type="button" class="secondary" data-prev ${currentStep === 0 ? "disabled" : ""}>Back</button>
      <button type="button" data-next>${currentStep === questions.length - 1 ? "See Results" : "Next"}</button>
    </div>
  `;
}

function calculateTotals() {
  return questions.reduce((totals, question) => {
    const selected = answers[question.key];
    const points = Number.isInteger(selected) ? question.options[selected].points : 0;
    totals.total += points;
    if (question.category === "Physical") totals.physical += points;
    if (question.category === "Lifestyle") totals.lifestyle += points;
    if (question.category === "Social Emotional") totals.social += points;
    return totals;
  }, { total: 0, physical: 0, lifestyle: 0, social: 0 });
}

function showResults() {
  const totals = calculateTotals();
  scoreValue.textContent = totals.total;
  scoreValue.parentElement.classList.remove("score-low", "score-mid", "score-high");
  scoreValue.parentElement.classList.add(totals.total >= 16 ? "score-high" : totals.total >= 11 ? "score-mid" : "score-low");
  physicalValue.textContent = `${totals.physical} / 8`;
  lifestyleValue.textContent = `${totals.lifestyle} / 10`;
  socialValue.textContent = `${totals.social} / 3`;
  physicalValue.parentElement.querySelectorAll(".breakdown-link").forEach((node) => node.remove());
  interpretation.textContent = "According to the McCance Center, a higher Brain Care Score represents better current brain care and has been associated in research with lower future risk of dementia, stroke, and depression. Use the category breakdown to identify topics to discuss with your primary care physician.";
  if (relatedTools) relatedTools.hidden = false;
  resultCard.classList.add("is-visible");
  resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.addEventListener("change", (event) => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || input.type !== "radio") return;
  const question = questions[currentStep];
  answers[question.key] = Number(input.value);
  const percent = Math.round((Object.keys(answers).length / questions.length) * 100);
  progressFill.style.width = `${percent}%`;
  progressText.textContent = `${Object.keys(answers).length} of ${questions.length} answered`;
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.closest("[data-start]")) {
    document.querySelector("#test")?.scrollIntoView({ behavior: "smooth" });
  }

  if (target.closest("[data-prev]")) {
    currentStep = Math.max(0, currentStep - 1);
    renderQuestion();
  }

  if (target.closest("[data-next]")) {
    const question = questions[currentStep];
    if (!Number.isInteger(answers[question.key])) {
      questionMount.querySelector(".hint").textContent = "Please choose an answer before continuing.";
      questionMount.querySelector(".hint").style.color = "#b42318";
      return;
    }
    if (currentStep < questions.length - 1) {
      currentStep += 1;
      renderQuestion();
    } else {
      showResults();
    }
  }

  if (target.closest("[data-print]")) {
    window.print();
  }

  const shareButton = target.closest("[data-share]");
  if (shareButton instanceof HTMLElement) {
    const shareData = {
      title: "Brain Care Score Test",
      text: "I just calculated my Brain Care Score online. Find out yours!",
      url: window.location.origin || window.location.href
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard?.writeText(shareData.url);
      shareButton.textContent = "Link copied";
    }
  }

  if (target.closest("[data-retake]")) {
    Object.keys(answers).forEach((key) => delete answers[key]);
    currentStep = 0;
    resultCard.classList.remove("is-visible");
    if (relatedTools) relatedTools.hidden = true;
    renderQuestion();
    document.querySelector("#test")?.scrollIntoView({ behavior: "smooth" });
  }
});

renderQuestion();
