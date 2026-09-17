(function () {
  "use strict";

  const publicConfig = window.CLINICA_180_CONFIG || window.LA_ISABELLA_CONFIG || {};

  const CONFIG = {
    endpoint: publicConfig.endpoint || "",
    formKey: "clinica180_4d8c72b19a6f",
    surveyVersion: "2.1",
    storageKey: "clinica_180_cuestionario_borrador_v2"
  };

  const BRANCHES = [
    "La Mascota",
    "La Sultana",
    "Santa Elena",
    "Nuevo Cuscatlán",
    "Zaragoza"
  ];

  const SECTIONS = {
    finanzas: "1. Desempeño financiero",
    inversion: "2. Publicidad y capacitación",
    clientes: "3. Clientes y mezcla de ingresos",
    portafolio: "4. Servicios y rentabilidad",
    crecimiento: "5. Evolución y metas"
  };

  const QUESTIONS = [
    {
      id: "q01", section: "finanzas", type: "branchTable", valueType: "currency",
      text: "¿Cuántos ingresos genera en promedio al mes cada sucursal?",
      help: "Indique el ingreso mensual aproximado de cada sucursal en dólares.",
      columnLabel: "Ingreso mensual"
    },
    {
      id: "q02", section: "finanzas", type: "branchTable", valueType: "currency",
      text: "Restando costos y gastos, ¿qué ganancia obtiene en promedio al mes cada sucursal?",
      help: "Indique la ganancia mensual aproximada de cada sucursal en dólares.",
      columnLabel: "Ganancia mensual"
    },
    {
      id: "q03", section: "inversion", type: "currency",
      text: "¿Qué presupuesto se destina aproximadamente al mes para publicidad?",
      help: "Ingrese el monto mensual aproximado en dólares."
    },
    {
      id: "q04", section: "inversion", type: "currency",
      text: "¿Qué presupuesto mensual se destina a capacitar a las estilistas para potenciar sus habilidades de ventas?",
      help: "Ingrese el monto mensual aproximado en dólares."
    },
    {
      id: "q05", section: "clientes", type: "branchTable", valueType: "integer",
      text: "¿Cuántos clientes atiende en promedio al mes cada sucursal?",
      help: "Esta información permitirá calcular el ticket promedio por sucursal.",
      columnLabel: "Clientes al mes"
    },
    {
      id: "q06", section: "clientes", type: "split",
      text: "¿Qué porcentaje de los ingresos proviene de servicios y qué porcentaje de la venta de productos?",
      help: "Los dos porcentajes deben sumar 100 %."
    },
    {
      id: "q07", section: "portafolio", type: "text",
      text: "¿Cuáles son los servicios o productos que más ingresos generan?",
      help: "Puede mencionar varios servicios o productos."
    },
    {
      id: "q08", section: "portafolio", type: "text",
      text: "¿Cuáles son los servicios o productos que dejan un mayor margen de ganancia?",
      help: "Puede mencionar varios servicios o productos."
    },
    {
      id: "q09", section: "crecimiento", type: "change",
      text: "¿Cuánto han crecido o disminuido las ventas de la empresa durante el último año?",
      help: "Seleccione el comportamiento e indique el porcentaje aproximado."
    },
    {
      id: "q10", section: "crecimiento", type: "percent",
      text: "¿Qué meta de crecimiento en ventas tienen para el próximo año?",
      help: "Ingrese el porcentaje de crecimiento esperado."
    }
  ];

  const els = {
    intro: document.getElementById("introCard"),
    questionnaire: document.getElementById("questionnaire"),
    start: document.getElementById("startButton"),
    form: document.getElementById("surveyForm"),
    card: document.getElementById("questionCard"),
    section: document.getElementById("sectionName"),
    current: document.getElementById("currentNumber"),
    total: document.getElementById("totalNumber"),
    progress: document.getElementById("progressBar"),
    track: document.querySelector(".progress-track"),
    previous: document.getElementById("previousButton"),
    next: document.getElementById("nextButton"),
    submit: document.getElementById("submitButton"),
    error: document.getElementById("formError"),
    save: document.getElementById("saveStatus")
  };

  let state = loadDraft();
  let currentId = state.currentId || "q01";
  const startedAt = state.startedAt || new Date().toISOString();
  state.startedAt = startedAt;

  function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function visibleQuestions() {
    return QUESTIONS;
  }

  function render() {
    const visible = visibleQuestions();
    let index = visible.findIndex(function (question) { return question.id === currentId; });
    if (index < 0) {
      index = 0;
      currentId = visible[0].id;
    }

    const question = visible[index];
    const percent = Math.round(((index + 1) / visible.length) * 100);
    els.section.textContent = SECTIONS[question.section];
    els.current.textContent = String(index + 1);
    els.total.textContent = String(visible.length);
    els.progress.style.width = percent + "%";
    els.track.setAttribute("aria-valuenow", String(percent));
    els.previous.hidden = index === 0;
    els.next.hidden = index === visible.length - 1;
    els.submit.hidden = index !== visible.length - 1;
    els.error.textContent = "";

    els.card.replaceChildren();
    const fieldset = make("fieldset", "question-fieldset");
    const number = make("span", "question-number", "Pregunta " + String(index + 1).padStart(2, "0"));
    const legend = make("legend", "question-title", question.text);
    fieldset.append(number, legend);

    if (question.help) fieldset.append(make("p", "question-help", question.help));

    if (question.type === "branchTable") fieldset.append(renderBranchTable(question));
    if (question.type === "currency") fieldset.append(renderNumberField(question, "US$", "0.00", "0.01"));
    if (question.type === "percent") fieldset.append(renderNumberField(question, "%", "0", "0.1", true));
    if (question.type === "multi") fieldset.append(renderOptions(question));
    if (question.type === "split") fieldset.append(renderSplit(question));
    if (question.type === "change") fieldset.append(renderChange(question));
    if (question.type === "text") fieldset.append(renderText(question));

    els.card.append(fieldset);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function numericInput(id, value, step, placeholder, ariaLabel) {
    const input = make("input", "number-input");
    input.id = id;
    input.type = "number";
    input.inputMode = "decimal";
    input.min = "0";
    input.step = step;
    input.placeholder = placeholder;
    input.value = value === null || typeof value === "undefined" ? "" : value;
    input.setAttribute("aria-label", ariaLabel);
    return input;
  }

  function renderBranchTable(question) {
    const wrap = make("div", "branch-table-wrap");
    const table = make("table", "branch-table");
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    headRow.append(make("th", "", "Sucursal"), make("th", "", question.columnLabel));
    thead.append(headRow);
    table.append(thead);

    const tbody = document.createElement("tbody");
    const current = state.answers[question.id] || {};
    BRANCHES.forEach(function (branch, index) {
      const row = document.createElement("tr");
      row.append(make("th", "branch-name", branch));
      const cell = document.createElement("td");
      const inputWrap = make("div", "number-control");
      if (question.valueType === "currency") inputWrap.append(make("span", "number-affix", "US$"));
      const input = numericInput(
        question.id + "_branch_" + index,
        current[branch],
        question.valueType === "integer" ? "1" : "0.01",
        question.valueType === "integer" ? "0" : "0.00",
        question.columnLabel + " de " + branch
      );
      input.addEventListener("input", function () {
        state.answers[question.id] = Object.assign({}, state.answers[question.id], { [branch]: input.value });
        saveDraft();
      });
      inputWrap.append(input);
      cell.append(inputWrap);
      row.append(cell);
      tbody.append(row);
    });
    table.append(tbody);
    wrap.append(table);
    return wrap;
  }

  function renderNumberField(question, affix, placeholder, step, suffix) {
    const wrap = make("div", "single-number-wrap");
    const control = make("div", "number-control number-control-large");
    if (!suffix) control.append(make("span", "number-affix", affix));
    const input = numericInput(question.id, state.answers[question.id], step, placeholder, question.text);
    input.addEventListener("input", function () {
      state.answers[question.id] = input.value;
      saveDraft();
    });
    control.append(input);
    if (suffix) control.append(make("span", "number-affix number-affix-suffix", affix));
    wrap.append(control);
    return wrap;
  }

  function optionId(questionId, index) {
    return questionId + "_option_" + index;
  }

  function renderOptions(question) {
    const wrapper = make("div", "options-list");
    const selected = Array.isArray(state.answers[question.id]) ? state.answers[question.id] : [];

    question.options.forEach(function (option, index) {
      const id = optionId(question.id, index);
      const label = make("label", "option");
      label.setAttribute("for", id);
      const input = document.createElement("input");
      input.id = id;
      input.type = "checkbox";
      input.name = question.id;
      input.value = option;
      input.checked = selected.includes(option);
      label.append(input, make("span", "", option));
      wrapper.append(label);

      input.addEventListener("change", function () {
        const values = Array.isArray(state.answers[question.id]) ? state.answers[question.id].slice() : [];
        state.answers[question.id] = input.checked
          ? values.concat(values.includes(option) ? [] : [option])
          : values.filter(function (value) { return value !== option; });
        saveDraft();
        render();
      });
    });

    const outer = make("div");
    outer.append(wrapper);
    if (isOtherSelected(question)) {
      const otherWrap = make("div", "other-wrap");
      const other = make("input", "other-field");
      other.type = "text";
      other.id = question.id + "_other";
      other.placeholder = "Especifique el medio";
      other.maxLength = 220;
      other.value = state.other[question.id] || "";
      other.addEventListener("input", function () {
        state.other[question.id] = other.value;
        saveDraft();
      });
      otherWrap.append(other);
      outer.append(otherWrap);
    }
    return outer;
  }

  function isOtherSelected(question) {
    const answer = state.answers[question.id];
    return Array.isArray(answer) && answer.includes(question.other);
  }

  function renderSplit(question) {
    const current = state.answers[question.id] || {};
    const wrap = make("div", "split-grid");
    const total = make("p", "split-total");

    ["Servicios", "Productos"].forEach(function (labelText) {
      const label = make("label", "split-field");
      label.append(make("span", "split-label", labelText));
      const control = make("div", "number-control");
      const input = numericInput(question.id + "_" + labelText.toLowerCase(), current[labelText], "0.1", "0", "Porcentaje de " + labelText.toLowerCase());
      input.max = "100";
      input.addEventListener("input", function () {
        state.answers[question.id] = Object.assign({}, state.answers[question.id], { [labelText]: input.value });
        updateTotal();
        saveDraft();
      });
      control.append(input, make("span", "number-affix number-affix-suffix", "%"));
      label.append(control);
      wrap.append(label);
    });

    function updateTotal() {
      const answer = state.answers[question.id] || {};
      const sum = (Number(answer.Servicios) || 0) + (Number(answer.Productos) || 0);
      total.textContent = "Total: " + sum.toLocaleString("es-SV", { maximumFractionDigits: 1 }) + " %";
      total.classList.toggle("is-complete", Math.abs(sum - 100) < 0.001);
    }

    updateTotal();
    const outer = make("div");
    outer.append(wrap, total);
    return outer;
  }

  function renderChange(question) {
    const current = state.answers[question.id] || {};
    const outer = make("div", "change-wrap");
    const choices = make("div", "change-options");

    ["Crecieron", "Disminuyeron", "Se mantuvieron estables"].forEach(function (option, index) {
      const id = question.id + "_change_" + index;
      const label = make("label", "option option-compact");
      label.setAttribute("for", id);
      const input = document.createElement("input");
      input.id = id;
      input.type = "radio";
      input.name = question.id + "_direction";
      input.value = option;
      input.checked = current.direccion === option;
      input.addEventListener("change", function () {
        state.answers[question.id] = Object.assign({}, state.answers[question.id], {
          direccion: option,
          porcentaje: option === "Se mantuvieron estables" ? "0" : (state.answers[question.id] || {}).porcentaje || ""
        });
        saveDraft();
        render();
      });
      label.append(input, make("span", "", option));
      choices.append(label);
    });
    outer.append(choices);

    if (current.direccion && current.direccion !== "Se mantuvieron estables") {
      const percentage = make("label", "change-percentage");
      percentage.append(make("span", "split-label", "Porcentaje aproximado"));
      const control = make("div", "number-control number-control-large");
      const input = numericInput(question.id + "_percentage", current.porcentaje, "0.1", "0", "Porcentaje aproximado");
      control.append(input, make("span", "number-affix number-affix-suffix", "%"));
      percentage.append(control);
      input.addEventListener("input", function () {
        state.answers[question.id] = Object.assign({}, state.answers[question.id], { porcentaje: input.value });
        saveDraft();
      });
      outer.append(percentage);
    }
    return outer;
  }

  function renderText(question) {
    const textarea = make("textarea", "open-field");
    textarea.id = question.id;
    textarea.name = question.id;
    textarea.rows = 6;
    textarea.maxLength = 1200;
    textarea.placeholder = "Escriba su respuesta aquí…";
    textarea.value = state.answers[question.id] || "";
    textarea.addEventListener("input", function () {
      state.answers[question.id] = textarea.value;
      saveDraft();
    });
    return textarea;
  }

  function validNonNegative(value) {
    return value !== "" && value !== null && typeof value !== "undefined" && Number.isFinite(Number(value)) && Number(value) >= 0;
  }

  function validateCurrent() {
    const question = QUESTIONS.find(function (item) { return item.id === currentId; });
    const answer = state.answers[currentId];
    let message = "";

    if (question.type === "branchTable") {
      const complete = answer && BRANCHES.every(function (branch) { return validNonNegative(answer[branch]); });
      if (!complete) message = "Complete el dato correspondiente a cada sucursal para continuar.";
    }
    if ((question.type === "currency" || question.type === "percent") && !validNonNegative(answer)) {
      message = "Ingrese un valor válido para continuar.";
    }
    if (question.type === "multi" && (!Array.isArray(answer) || answer.length === 0)) {
      message = "Seleccione al menos una opción para continuar.";
    }
    if (question.type === "text" && (!answer || !answer.trim())) {
      message = "Escriba una respuesta para continuar.";
    }
    if (question.type === "split") {
      const services = answer && answer.Servicios;
      const products = answer && answer.Productos;
      if (!validNonNegative(services) || !validNonNegative(products)) {
        message = "Complete ambos porcentajes para continuar.";
      } else if (Math.abs(Number(services) + Number(products) - 100) > 0.001) {
        message = "Los porcentajes de servicios y productos deben sumar exactamente 100 %.";
      }
    }
    if (question.type === "change") {
      if (!answer || !answer.direccion) {
        message = "Seleccione cómo se comportaron las ventas para continuar.";
      } else if (answer.direccion !== "Se mantuvieron estables" && !validNonNegative(answer.porcentaje)) {
        message = "Ingrese el porcentaje aproximado para continuar.";
      }
    }
    if (!message && question.other && isOtherSelected(question) && !(state.other[question.id] || "").trim()) {
      message = "Especifique la opción “" + question.other + "” para continuar.";
    }

    els.error.textContent = message;
    return !message;
  }

  function move(delta) {
    if (delta > 0 && !validateCurrent()) return;
    const visible = visibleQuestions();
    const index = visible.findIndex(function (question) { return question.id === currentId; });
    const target = visible[index + delta];
    if (!target) return;
    currentId = target.id;
    state.currentId = currentId;
    saveDraft();
    render();
  }

  function finalAnswers() {
    const copy = JSON.parse(JSON.stringify(state.answers));
    QUESTIONS.forEach(function (question) {
      if (!question.other || !isOtherSelected(question)) return;
      const other = (state.other[question.id] || "").trim();
      copy[question.id] = copy[question.id].filter(function (value) { return value !== question.other; });
      copy[question.id].push(question.other + ": " + other);
    });
    return copy;
  }

  function loadDraft() {
    try {
      const parsed = JSON.parse(localStorage.getItem(CONFIG.storageKey) || "{}");
      return {
        answers: parsed.answers || {},
        other: parsed.other || {},
        currentId: parsed.currentId || "q01",
        startedAt: parsed.startedAt || null
      };
    } catch (error) {
      return { answers: {}, other: {}, currentId: "q01", startedAt: null };
    }
  }

  function saveDraft() {
    state.currentId = currentId;
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
    els.save.textContent = "Avance guardado";
  }

  function responseId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
    return "resp_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
  }

  function analytics() {
    const params = new URLSearchParams(window.location.search);
    return {
      landing_page: window.location.href,
      referrer_url: document.referrer || "",
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      user_agent: navigator.userAgent || ""
    };
  }

  async function submitSurvey(event) {
    event.preventDefault();
    if (!validateCurrent()) return;
    if (!CONFIG.endpoint.startsWith("https://script.google.com/macros/s/")) {
      els.error.textContent = "La conexión con Google Sheets aún no está configurada.";
      return;
    }

    const submittedAt = new Date();
    const payload = Object.assign({
      form_key: CONFIG.formKey,
      survey_version: CONFIG.surveyVersion,
      response_id: responseId(),
      started_at: startedAt,
      submitted_at: submittedAt.toISOString(),
      duration_seconds: Math.max(0, Math.round((submittedAt.getTime() - new Date(startedAt).getTime()) / 1000)),
      answers: finalAnswers(),
      website: ""
    }, analytics());

    els.submit.disabled = true;
    els.submit.textContent = "Enviando…";
    els.error.textContent = "";

    try {
      const body = new URLSearchParams();
      body.set("payload", JSON.stringify(payload));
      await fetch(CONFIG.endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: body.toString()
      });
      localStorage.removeItem(CONFIG.storageKey);
      window.location.href = "gracias.html";
    } catch (error) {
      els.error.textContent = "No pudimos enviar las respuestas. Revise su conexión e inténtelo de nuevo.";
      els.submit.disabled = false;
      els.submit.textContent = "Enviar respuestas";
    }
  }

  els.start.addEventListener("click", function () {
    els.intro.hidden = true;
    els.questionnaire.hidden = false;
    render();
  });
  els.previous.addEventListener("click", function () { move(-1); });
  els.next.addEventListener("click", function () { move(1); });
  els.form.addEventListener("submit", submitSurvey);

  if (state.currentId !== "q01" || Object.keys(state.answers).length) {
    els.start.textContent = "Continuar cuestionario";
  }
})();
