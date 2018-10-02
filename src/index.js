import "./app.css";

const appTemplate = `
  <h1>Cascading Select</h1>
  <div class="row">
    <div class="col">
      <h2>PSYCHOLOGICAL PROCESSES</h2>
      <select name="Process" id="Psychological_Processes">
        <option value="">--All--</option>
      </select>
    </div>
    <div class="col">
      <h2>SOCIAL AREAS</h2>
      <select name="Area" id="Social_Area">
        <option value="">--All--</option>
      </select>
    </div>
    <div class="col">
      <h2>Intervention Techniques</h2>
      <select name="Technique" id="Intervention_Technique">
        <option value="">--All--</option>
      </select>
    </div>
    <div class="col">
      <h2>Psychological Questions</h2>
      <select name="Question" id="Psychological_Questions">
        <option value="">--All--</option>
      </select>
    </div>
  </div>
`;

const state = {
  selectedProcess: -1,
  selectedArea: -1,
  selectedTechnique: -1,
  selectedQuestion: -1,
  itemStore: null
};

const DEFAULT_OPTION = "<option value=''>--All--</option>";
const PSYCHOLOGICAL_PROCESSES = "Psychological Processes";
const SOCIAL_AREA = "Social Area";
const INTERVENTION_TECHNIQUE = "Intervention Technique";
const PSYCHOLOGICAL_QUESTIONS = "Psychological Questions";

const resetControl = control => {
  if (state["selected" + control.name] === -1) {
    return;
  }

  control.innerHTML = DEFAULT_OPTION;
  state["selected" + control.name] = -1;
  control.dispatchEvent(new Event("change", { bubbles: true }));
};

const getClassName = elem => {
  return elem
    .replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^~\{\|\}~]/g, "")
    .replace(/ /g, "-")
    .toLowerCase()
    .trim();
};

const getItemData = section => {
  switch (section) {
    case PSYCHOLOGICAL_PROCESSES:
      return state.itemStore[section];
    case SOCIAL_AREA:
      return getItemData(PSYCHOLOGICAL_PROCESSES)[state.selectedProcess][
        section
      ];
    case INTERVENTION_TECHNIQUE:
      return getItemData(SOCIAL_AREA)[state.selectedArea][section];
    case PSYCHOLOGICAL_QUESTIONS:
      return getItemData(INTERVENTION_TECHNIQUE)[state.selectedTechnique][
        section
      ];
    default:
      break;
  }
};

const processChange = e => {
  resetControl(areaSelect);
  state.selectedProcess = e.target.selectedIndex - 1;
  populateAreas();
};

const areaChange = e => {
  resetControl(techniqueSelect);
  state.selectedArea = e.target.selectedIndex - 1;
  populateTechniques();
};

const techniqueChange = e => {
  resetControl(questionSelect);
  state.selectedTechnique = e.target.selectedIndex - 1;
  populateQuestions();
};

const questionChange = e => {
  state.selectedQuestion = e.target.selectedIndex - 1;
};

const populateProcesses = () => {
  getItemData(PSYCHOLOGICAL_PROCESSES).forEach(element => {
    processSelect.innerHTML += `<option value=.${getClassName(element.name)}>${
      element.name
    }</option>`;
  });
};

const populateAreas = () => {
  areaSelect.innerHTML = DEFAULT_OPTION;

  if (state.selectedProcess > -1) {
    const socialAreas = getItemData(SOCIAL_AREA);
    socialAreas.forEach(element => {
      areaSelect.innerHTML += `<option value=.${getClassName(element.name)}>${
        element.name
      }</option>`;
    });
  }
};

const populateTechniques = () => {
  techniqueSelect.innerHTML = DEFAULT_OPTION;

  if (state.selectedArea > -1) {
    const techniques = getItemData(INTERVENTION_TECHNIQUE);
    techniques.forEach(element => {
      techniqueSelect.innerHTML += `<option value=.${getClassName(
        element.name
      )}>${element.name}</option>`;
    });
  }
};

const populateQuestions = () => {
  questionSelect.innerHTML = DEFAULT_OPTION;

  if (state.selectedTechnique > -1) {
    const questions = getItemData(PSYCHOLOGICAL_QUESTIONS);
    questions.forEach((element, idx) => {
      questionSelect.innerHTML += `<option value=.${getClassName(
        element
      )}>${element}</option>`;
    });
  }
};

document.getElementById("app").innerHTML = appTemplate;

const processSelect = document.getElementById("Psychological_Processes");
const areaSelect = document.getElementById("Social_Area");
const techniqueSelect = document.getElementById("Intervention_Technique");
const questionSelect = document.getElementById("Psychological_Questions");

processSelect.addEventListener("change", processChange);
areaSelect.addEventListener("change", areaChange);
techniqueSelect.addEventListener("change", techniqueChange);
questionSelect.addEventListener("change", questionChange);

state.itemStore = window.itemsdb;

populateProcesses();
