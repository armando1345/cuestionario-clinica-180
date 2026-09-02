(function () {
  "use strict";

  const publicConfig = window.LA_ISABELLA_CONFIG || {};

  const CONFIG = {
    endpoint: publicConfig.endpoint || "",
    formKey: "isabella_6e4a90d31f7c",
    surveyVersion: "1.0",
    storageKey: "la_isabella_cuestionario_borrador_v1"
  };

  const SECTIONS = {
    equipo: "1. Equipo y organización de ventas",
    estrategia: "2. Estrategia y objetivos comerciales",
    proceso: "3. Proceso de ventas",
    clientes: "4. Clientes y comportamiento de compra",
    proveedores: "5. Proveedores",
    resultados: "6. Resultados y control de ventas"
  };

  const QUESTIONS = [
    {
      id: "q01", section: "equipo", type: "single",
      text: "¿Cuántas personas trabajan actualmente en Floristería La Isabella?",
      options: ["1", "2", "3", "4", "Otro"], other: "Otro"
    },
    {
      id: "q02", section: "equipo", type: "single",
      text: "¿Cuántas de esas personas atienden clientes o participan directamente en las ventas?",
      options: ["1", "2", "3", "4", "Otro"], other: "Otro"
    },
    {
      id: "q03", section: "equipo", type: "single",
      text: "¿Están claramente definidas las responsabilidades de cada persona que participa en ventas?",
      options: ["Sí, están claramente definidas", "En parte", "No, las tareas se reparten según sea necesario"]
    },
    {
      id: "q04", section: "equipo", type: "multi",
      text: "Además de vender o atender clientes, ¿qué otras tareas realizan las personas encargadas de ventas?",
      help: "Puede seleccionar varias.",
      options: ["Preparación de arreglos", "Compras y relación con proveedores", "Administración", "Entregas", "Manejo de redes sociales", "Cobros o facturación", "Se dedican principalmente a vender y atender clientes", "Otras"],
      other: "Otras", exclusive: ["Se dedican principalmente a vender y atender clientes"]
    },
    {
      id: "q05", section: "equipo", type: "single",
      text: "¿Las personas que venden han recibido capacitación relacionada con ventas o atención al cliente?",
      options: ["Sí, capacitación formal", "Sí, aprendizaje o capacitación informal", "No", "No sé"]
    },
    {
      id: "q06", section: "estrategia", type: "single",
      text: "¿Establecen metas de ventas?",
      options: ["Sí, metas concretas y medibles", "Sí, pero de manera informal", "No"]
    },
    {
      id: "q07", section: "estrategia", type: "multi",
      text: "¿Qué tipo de metas utilizan?",
      help: "Puede seleccionar varias.",
      options: ["Monto de ventas", "Número de pedidos", "Ventas por producto", "Ventas en temporadas especiales", "Captación de nuevos clientes", "Recompra de clientes actuales", "Crecimiento respecto a períodos anteriores", "Otras"],
      other: "Otras",
      visible: function (answers) { return answers.q06 !== "No"; }
    },
    {
      id: "q08", section: "estrategia", type: "single",
      text: "¿Con qué frecuencia revisan si están cumpliendo esas metas?",
      options: ["Diariamente", "Semanalmente", "Mensualmente", "Solo en temporadas importantes", "Ocasionalmente", "No las revisamos de forma sistemática"],
      visible: function (answers) { return answers.q06 !== "No"; }
    },
    {
      id: "q09", section: "estrategia", type: "single",
      text: "¿Tienen definido qué tipos de clientes son prioritarios para el negocio?",
      options: ["Sí, claramente", "Tenemos una idea general", "No", "No consideramos necesario diferenciarlos"]
    },
    {
      id: "q10", section: "estrategia", type: "single",
      text: "¿Cómo deciden qué productos o servicios impulsar con mayor fuerza?",
      options: ["Utilizando información de ventas, rentabilidad o demanda", "Principalmente según nuestra experiencia", "Principalmente según la temporada", "No priorizamos productos o servicios específicos", "De otra forma"],
      other: "De otra forma"
    },
    {
      id: "q11", section: "estrategia", type: "multi",
      text: "¿Qué acciones utilizan actualmente para conseguir nuevos clientes?",
      help: "Puede seleccionar varias.",
      options: ["Instagram", "Facebook", "WhatsApp", "Publicidad pagada", "Promociones o descuentos", "Recomendaciones de clientes", "Alianzas con otros negocios", "Eventos o actividades locales", "Página web", "Google", "No realizamos acciones específicas para captar clientes", "Otras"],
      other: "Otras", exclusive: ["No realizamos acciones específicas para captar clientes"]
    },
    {
      id: "q12", section: "proceso", type: "multi",
      text: "¿Por qué medios reciben consultas o pedidos?",
      help: "Puede seleccionar varias.",
      options: ["Local físico", "WhatsApp", "Instagram", "Facebook", "Teléfono", "Página web", "Google", "Otros"],
      other: "Otros"
    },
    {
      id: "q13", section: "proceso", type: "single",
      text: "¿Cuál de esos medios genera actualmente más ventas?",
      options: ["Local físico", "WhatsApp", "Instagram", "Facebook", "Teléfono", "Página web", "Google", "No sabemos", "Otro"],
      other: "Otro"
    },
    {
      id: "q14", section: "proceso", type: "single",
      text: "Cuando un cliente consulta, ¿se sigue normalmente un proceso similar para atenderlo y cerrar la venta?",
      options: ["Sí, tenemos una forma bastante definida de hacerlo", "Hay algunos pasos comunes, pero depende de cada caso", "No, cada venta se maneja de manera diferente"]
    },
    {
      id: "q15", section: "proceso", type: "multi",
      text: "¿Qué información suelen conocer antes de recomendar un arreglo o producto?",
      help: "Puede seleccionar varias.",
      options: ["Ocasión o motivo de compra", "Presupuesto", "Persona que recibirá el arreglo", "Tipo de flores o diseño deseado", "Fecha y hora de entrega", "Lugar de entrega", "Preferencias anteriores del cliente", "Normalmente el cliente ya sabe qué producto quiere", "Otra"],
      other: "Otra"
    },
    {
      id: "q16", section: "proceso", type: "single",
      text: "Si un cliente consulta pero no compra inmediatamente, ¿suelen volver a contactarlo?",
      options: ["Siempre o casi siempre", "Algunas veces", "Solo para pedidos importantes", "Nunca"]
    },
    {
      id: "q17", section: "proceso", type: "single",
      text: "¿Registran las consultas que finalmente no terminan en una venta?",
      options: ["Sí, sistemáticamente", "Algunas veces", "No"]
    },
    {
      id: "q18", section: "proceso", type: "multi",
      text: "¿Cuáles suelen ser las principales razones por las que una consulta no termina en compra?",
      help: "Puede seleccionar varias.",
      options: ["Precio", "El cliente encontró otra opción", "No había disponibilidad del producto", "Tiempo de entrega", "El cliente dejó de responder", "No se encontró un diseño que le gustara", "El cliente cambió de opinión", "No sabemos por qué", "Otra"],
      other: "Otra"
    },
    {
      id: "q19", section: "proceso", type: "single",
      text: "¿Existe una forma definida de manejar reclamos, errores o retrasos?",
      options: ["Sí, existe un procedimiento claro", "Sabemos cómo actuar, aunque no existe un procedimiento formal", "Se decide según cada caso", "No hemos definido cómo actuar"]
    },
    {
      id: "q20", section: "proceso", type: "single",
      text: "Después de una venta, ¿vuelven a contactar al cliente?",
      options: ["Siempre o casi siempre", "Algunas veces", "Solo en ciertos tipos de pedidos", "Nunca"]
    },
    {
      id: "q21", section: "clientes", type: "multi",
      text: "¿Qué tipos de clientes representan una parte importante de sus ventas?",
      help: "Puede seleccionar varias.",
      options: ["Personas que compran regalos", "Parejas", "Familias", "Empresas", "Clientes de bodas", "Clientes de eventos", "Clientes de funerales", "Iglesias o instituciones", "Otros"],
      other: "Otros"
    },
    {
      id: "q22", section: "clientes", type: "multi",
      text: "¿Qué ocasiones generan una parte importante de sus ventas?",
      help: "Puede seleccionar varias.",
      options: ["Cumpleaños", "Aniversarios", "San Valentín", "Día de la Madre", "Graduaciones", "Bodas", "Funerales", "Eventos empresariales", "Regalos sin una fecha especial", "Otras"],
      other: "Otras"
    },
    {
      id: "q23", section: "clientes", type: "single",
      text: "Aproximadamente, ¿qué porcentaje de sus ventas proviene de clientes que ya habían comprado anteriormente?",
      options: ["Menos del 25 %", "Entre 25 % y 50 %", "Entre 51 % y 75 %", "Más del 75 %", "No sabemos"]
    },
    {
      id: "q24", section: "clientes", type: "single",
      text: "¿Con qué frecuencia los clientes mencionan o comparan sus opciones con otras florerías antes de comprar?",
      options: ["Muy frecuentemente", "Frecuentemente", "Algunas veces", "Rara vez", "Nunca", "No sabemos"]
    },
    {
      id: "q25", section: "clientes", type: "multi",
      text: "Cuando comparan con otras florerías, ¿qué suelen comparar principalmente?",
      help: "Puede seleccionar varias.",
      options: ["Precio", "Calidad de las flores", "Diseño de los arreglos", "Tamaño o cantidad de flores", "Tiempo de entrega", "Costo de entrega", "Atención al cliente", "Variedad", "Reputación", "Otro"],
      other: "Otro",
      visible: function (answers) { return answers.q24 !== "Nunca" && answers.q24 !== "No sabemos"; }
    },
    {
      id: "q26", section: "clientes", type: "single",
      text: "¿Con qué frecuencia los clientes piden descuentos, negocian el precio o solicitan una alternativa más económica?",
      options: ["Muy frecuentemente", "Frecuentemente", "Algunas veces", "Rara vez", "Nunca"]
    },
    {
      id: "q27", section: "clientes", type: "multi",
      text: "Cuando alguien decide no comprar flores, ¿qué alternativas han observado que suele elegir?",
      help: "Puede seleccionar varias.",
      options: ["Chocolates o dulces", "Regalos u objetos personales", "Plantas", "Dinero o tarjetas de regalo", "Comida o experiencias", "Otro tipo de decoración", "Simplemente no compra ningún regalo", "No sabemos", "Otra"],
      other: "Otra"
    },
    {
      id: "q28", section: "clientes", type: "multi", max: 3,
      text: "Según su experiencia, ¿qué factores pesan más cuando sus clientes deciden comprar?",
      help: "Seleccione como máximo 3.",
      options: ["Precio", "Calidad de las flores", "Diseño de los arreglos", "Variedad", "Atención al cliente", "Rapidez", "Entrega a domicilio", "Ubicación", "Confianza o reputación", "Personalización", "Otro"],
      other: "Otro"
    },
    {
      id: "q29", section: "proveedores", type: "single",
      text: "¿De cuántos proveedores principales dependen para conseguir flores e insumos importantes?",
      options: ["1", "2", "3", "4", "No sé", "Otro"],
      other: "Otro"
    },
    {
      id: "q30", section: "proveedores", type: "single",
      text: "Si uno de sus principales proveedores aumenta mucho sus precios o deja de tener producto, ¿qué tan fácil es sustituirlo?",
      options: ["Muy fácil", "Relativamente fácil", "Difícil", "Muy difícil", "Depende del tipo de producto", "No sabemos"]
    },
    {
      id: "q31", section: "proveedores", type: "matrix",
      text: "Durante el último año, ¿con qué frecuencia han ocurrido las siguientes situaciones con proveedores?",
      rows: ["Aumentos importantes de precios", "Falta de flores o insumos", "Retrasos en entregas", "Problemas de calidad"],
      columns: ["Nunca", "Algunas veces", "Frecuentemente", "Muy frecuentemente", "No sé"]
    },
    {
      id: "q32", section: "resultados", type: "single",
      text: "¿Cómo registran actualmente sus ventas?",
      options: ["Todas las ventas quedan registradas de forma detallada", "Registramos las ventas, pero con información básica", "Solo algunas ventas quedan registradas", "No llevamos un registro sistemático"]
    },
    {
      id: "q33", section: "resultados", type: "multi",
      text: "¿Qué información queda registrada en cada venta?",
      help: "Puede seleccionar varias.",
      options: ["Monto de la venta", "Producto o arreglo vendido", "Fecha", "Cliente", "Canal por el que llegó el cliente", "Costos", "Ganancia o margen", "Forma de pago", "Si era cliente nuevo o recurrente", "No registramos esta información", "Otra"],
      other: "Otra", exclusive: ["No registramos esta información"]
    },
    {
      id: "q34", section: "resultados", type: "multi",
      text: "¿Qué información revisan periódicamente para tomar decisiones?",
      help: "Puede seleccionar varias.",
      options: ["Ventas totales", "Ventas por mes o temporada", "Productos más vendidos", "Productos más rentables", "Número de pedidos", "Clientes nuevos", "Clientes recurrentes", "Número de consultas que terminan en venta", "Comparación con períodos anteriores", "No revisamos indicadores de forma periódica", "Otra"],
      other: "Otra", exclusive: ["No revisamos indicadores de forma periódica"]
    },
    {
      id: "q35", section: "resultados", type: "text",
      text: "Desde su experiencia, ¿cuáles son actualmente los principales factores que dificultan que Floristería La Isabella venda más?",
      help: "Puede mencionar hasta tres factores."
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

  function visibleQuestions() {
    return QUESTIONS.filter(function (question) {
      return !question.visible || question.visible(state.answers);
    });
  }

  function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function optionId(questionId, index) {
    return questionId + "_option_" + index;
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
    const number = make("span", "question-number", "Pregunta " + question.id.slice(1));
    const legend = make("legend", "question-title", question.text);
    fieldset.append(number, legend);

    if (question.help) fieldset.append(make("p", "question-help", question.help));

    if (question.type === "single" || question.type === "multi") {
      fieldset.append(renderOptions(question));
    } else if (question.type === "matrix") {
      fieldset.append(renderMatrix(question));
    } else {
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
      fieldset.append(textarea);
    }

    els.card.append(fieldset);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderOptions(question) {
    const wrapper = make("div", "options-list");
    const selected = question.type === "multi"
      ? (Array.isArray(state.answers[question.id]) ? state.answers[question.id] : [])
      : state.answers[question.id];

    question.options.forEach(function (option, index) {
      const id = optionId(question.id, index);
      const label = make("label", "option");
      label.setAttribute("for", id);
      const input = document.createElement("input");
      input.id = id;
      input.type = question.type === "multi" ? "checkbox" : "radio";
      input.name = question.id;
      input.value = option;
      input.checked = question.type === "multi" ? selected.includes(option) : selected === option;
      const text = make("span", "", option);
      label.append(input, text);
      wrapper.append(label);

      input.addEventListener("change", function () {
        if (question.type === "single") {
          state.answers[question.id] = option;
        } else {
          applyMultiSelection(question, option, input.checked);
        }
        reconcileBranches();
        saveDraft();
        render();
      });
    });

    const outer = make("div");
    outer.append(wrapper);
    if (question.other && isOtherSelected(question)) {
      const otherWrap = make("div", "other-wrap");
      const other = make("input", "other-field");
      other.type = "text";
      other.id = question.id + "_other";
      other.placeholder = "Especifique su respuesta";
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

  function applyMultiSelection(question, option, checked) {
    let values = Array.isArray(state.answers[question.id]) ? state.answers[question.id].slice() : [];
    const exclusive = question.exclusive || [];

    if (checked) {
      if (exclusive.includes(option)) {
        values = [option];
      } else {
        values = values.filter(function (value) { return !exclusive.includes(value); });
        if (!values.includes(option)) values.push(option);
      }
    } else {
      values = values.filter(function (value) { return value !== option; });
    }

    if (question.max && values.length > question.max) {
      values = values.filter(function (value) { return value !== option; });
      els.error.textContent = "Puede seleccionar como máximo " + question.max + " opciones.";
    }
    state.answers[question.id] = values;
  }

  function isOtherSelected(question) {
    const answer = state.answers[question.id];
    return Array.isArray(answer) ? answer.includes(question.other) : answer === question.other;
  }

  function renderMatrix(question) {
    const wrap = make("div", "matrix-wrap");
    const table = make("table", "matrix");
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    headRow.append(make("th", "", "Situación"));
    question.columns.forEach(function (column) { headRow.append(make("th", "", column)); });
    thead.append(headRow);
    table.append(thead);

    const tbody = document.createElement("tbody");
    const current = state.answers[question.id] || {};
    question.rows.forEach(function (rowLabel, rowIndex) {
      const row = document.createElement("tr");
      row.append(make("td", "", rowLabel));
      question.columns.forEach(function (column, columnIndex) {
        const cell = document.createElement("td");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = question.id + "_row_" + rowIndex;
        input.value = column;
        input.setAttribute("aria-label", rowLabel + ": " + column);
        input.checked = current[rowLabel] === column;
        input.addEventListener("change", function () {
          state.answers[question.id] = Object.assign({}, state.answers[question.id], { [rowLabel]: column });
          saveDraft();
        });
        cell.append(input);
        row.append(cell);
      });
      tbody.append(row);
    });
    table.append(tbody);
    wrap.append(table);
    return wrap;
  }

  function validateCurrent() {
    const question = QUESTIONS.find(function (item) { return item.id === currentId; });
    const answer = state.answers[currentId];
    let message = "";

    if (question.type === "single" && !answer) message = "Seleccione una opción para continuar.";
    if (question.type === "multi" && (!Array.isArray(answer) || answer.length === 0)) message = "Seleccione al menos una opción para continuar.";
    if (question.type === "multi" && question.max && Array.isArray(answer) && answer.length > question.max) message = "Puede seleccionar como máximo " + question.max + " opciones.";
    if (question.type === "text" && (!answer || !answer.trim())) message = "Escriba una respuesta para continuar.";
    if (question.type === "matrix") {
      const rowsAnswered = answer && typeof answer === "object" ? Object.keys(answer).length : 0;
      if (rowsAnswered < question.rows.length) message = "Responda todas las situaciones de la tabla para continuar.";
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

  function reconcileBranches() {
    if (state.answers.q06 === "No") {
      delete state.answers.q07;
      delete state.answers.q08;
      delete state.other.q07;
    }
    if (state.answers.q24 === "Nunca" || state.answers.q24 === "No sabemos") {
      delete state.answers.q25;
      delete state.other.q25;
    }
  }

  function finalAnswers() {
    const copy = JSON.parse(JSON.stringify(state.answers));
    QUESTIONS.forEach(function (question) {
      if (!question.other || !isOtherSelected(question)) return;
      const other = (state.other[question.id] || "").trim();
      if (Array.isArray(copy[question.id])) {
        copy[question.id] = copy[question.id].filter(function (value) { return value !== question.other; });
        copy[question.id].push(question.other + ": " + other);
      } else {
        copy[question.id] = question.other + ": " + other;
      }
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
