/**
 * Receptor directo del cuestionario de Clínica 180°.
 * Este proyecto debe permanecer vinculado a la hoja de respuestas.
 */
const SHEET_NAME = "Respuestas";
const FORM_KEY = "clinica180_4d8c72b19a6f";

const HEADERS = [
  "created_at", "response_id", "started_at", "submitted_at", "duration_seconds",
  "survey_version", "landing_page", "referrer_url", "utm_source", "utm_medium",
  "utm_campaign", "user_agent",
  "q01_ingreso_la_mascota", "q01_ingreso_la_sultana", "q01_ingreso_santa_elena",
  "q01_ingreso_nuevo_cuscatlan", "q01_ingreso_zaragoza",
  "q02_ganancia_la_mascota", "q02_ganancia_la_sultana", "q02_ganancia_santa_elena",
  "q02_ganancia_nuevo_cuscatlan", "q02_ganancia_zaragoza",
  "q03_presupuesto_publicidad", "q04_presupuesto_capacitacion_ventas",
  "q05_clientes_la_mascota", "q05_clientes_la_sultana", "q05_clientes_santa_elena",
  "q05_clientes_nuevo_cuscatlan", "q05_clientes_zaragoza",
  "q06_porcentaje_servicios", "q06_porcentaje_productos",
  "q07_mayores_ingresos", "q08_mayor_margen",
  "q09_comportamiento_ventas", "q09_porcentaje_variacion",
  "q10_meta_crecimiento", "answers_json"
];

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    const raw = (e && e.parameter && e.parameter.payload) ||
      (e && e.postData && e.postData.contents) || "{}";
    const payload = JSON.parse(raw);

    if (payload.website) return json_({ ok: true });
    if (payload.form_key !== FORM_KEY) return json_({ ok: false, error: "unauthorized" });

    lock.waitLock(30000);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
    ensureHeaders_(sheet);

    const answers = payload.answers || {};
    const income = answers.q01 || {};
    const profit = answers.q02 || {};
    const clients = answers.q05 || {};
    const mix = answers.q06 || {};
    const change = answers.q09 || {};

    const row = [
      new Date(),
      clean_(payload.response_id),
      clean_(payload.started_at),
      clean_(payload.submitted_at),
      Number(payload.duration_seconds) || 0,
      clean_(payload.survey_version),
      clean_(payload.landing_page),
      clean_(payload.referrer_url),
      clean_(payload.utm_source),
      clean_(payload.utm_medium),
      clean_(payload.utm_campaign),
      clean_(payload.user_agent),
      number_(income["La Mascota"]), number_(income["La Sultana"]),
      number_(income["Santa Elena"]), number_(income["Nuevo Cuscatlán"]), number_(income.Zaragoza),
      number_(profit["La Mascota"]), number_(profit["La Sultana"]),
      number_(profit["Santa Elena"]), number_(profit["Nuevo Cuscatlán"]), number_(profit.Zaragoza),
      number_(answers.q03), number_(answers.q04),
      number_(clients["La Mascota"]), number_(clients["La Sultana"]),
      number_(clients["Santa Elena"]), number_(clients["Nuevo Cuscatlán"]), number_(clients.Zaragoza),
      number_(mix.Servicios), number_(mix.Productos),
      cell_(answers.q07), cell_(answers.q08),
      cell_(change.direccion), number_(change.porcentaje),
      number_(answers.q10), JSON.stringify(answers)
    ];

    sheet.appendRow(row);
    return json_({ ok: true, response_id: payload.response_id });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: String(error && error.message || error) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function doGet() {
  return json_({ ok: true, service: "Clínica 180°" });
}

function ensureHeaders_(sheet) {
  const current = sheet.getRange(1, 1, 1, HEADERS.length).getDisplayValues()[0];
  if (current.join("|") !== HEADERS.join("|")) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
  sheet.setFrozenRows(1);
  sheet.setHiddenGridlines(true);
  sheet.getRange(1, 1, 1, HEADERS.length)
    .setBackground("#e8b7c4")
    .setFontColor("#171315")
    .setFontWeight("bold")
    .setWrap(true);
}

function cell_(value) {
  if (Array.isArray(value)) return value.join(" | ");
  if (value === null || typeof value === "undefined") return "";
  if (typeof value === "object") return JSON.stringify(value);
  return clean_(value);
}

function number_(value) {
  if (value === "" || value === null || typeof value === "undefined") return "";
  const number = Number(value);
  return Number.isFinite(number) ? number : "";
}

function clean_(value) {
  const text = String(value === null || typeof value === "undefined" ? "" : value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
