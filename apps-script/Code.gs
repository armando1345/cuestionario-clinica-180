/**
 * Receptor directo del cuestionario de Floristería La Isabella.
 * Este proyecto debe permanecer vinculado a la hoja de respuestas.
 */
const SHEET_NAME = "Respuestas";
const FORM_KEY = "isabella_6e4a90d31f7c";

const HEADERS = [
  "created_at", "response_id", "started_at", "submitted_at", "duration_seconds",
  "survey_version", "landing_page", "referrer_url", "utm_source", "utm_medium",
  "utm_campaign", "user_agent",
  "q01_personas_total", "q02_personas_ventas", "q03_responsabilidades",
  "q04_tareas_ventas", "q05_capacitacion", "q06_metas_ventas",
  "q07_tipos_metas", "q08_frecuencia_revision", "q09_clientes_prioritarios",
  "q10_priorizacion_productos", "q11_captacion_clientes", "q12_canales_consultas",
  "q13_canal_mayor_ventas", "q14_proceso_ventas", "q15_info_recomendacion",
  "q16_seguimiento_consultas", "q17_registro_no_venta", "q18_razones_no_compra",
  "q19_manejo_reclamos", "q20_contacto_postventa", "q21_tipos_clientes",
  "q22_ocasiones_venta", "q23_porcentaje_recompra", "q24_comparacion_competencia",
  "q25_criterios_comparacion", "q26_solicitud_descuentos",
  "q27_alternativas_flores", "q28_factores_decision_top3",
  "q29_proveedores_principales", "q30_facilidad_sustitucion",
  "q31_aumentos_precios", "q31_falta_flores_insumos",
  "q31_retrasos_entregas", "q31_problemas_calidad",
  "q32_registro_ventas", "q33_datos_venta", "q34_indicadores",
  "q35_obstaculos", "answers_json"
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
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error("No existe la pestaña " + SHEET_NAME);
    ensureHeaders_(sheet);

    const answers = payload.answers || {};
    const matrix = answers.q31 || {};
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
      cell_(answers.q01), cell_(answers.q02), cell_(answers.q03),
      cell_(answers.q04), cell_(answers.q05), cell_(answers.q06),
      cell_(answers.q07), cell_(answers.q08), cell_(answers.q09),
      cell_(answers.q10), cell_(answers.q11), cell_(answers.q12),
      cell_(answers.q13), cell_(answers.q14), cell_(answers.q15),
      cell_(answers.q16), cell_(answers.q17), cell_(answers.q18),
      cell_(answers.q19), cell_(answers.q20), cell_(answers.q21),
      cell_(answers.q22), cell_(answers.q23), cell_(answers.q24),
      cell_(answers.q25), cell_(answers.q26), cell_(answers.q27),
      cell_(answers.q28), cell_(answers.q29), cell_(answers.q30),
      cell_(matrix["Aumentos importantes de precios"]),
      cell_(matrix["Falta de flores o insumos"]),
      cell_(matrix["Retrasos en entregas"]),
      cell_(matrix["Problemas de calidad"]),
      cell_(answers.q32), cell_(answers.q33), cell_(answers.q34),
      cell_(answers.q35), JSON.stringify(answers)
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
  return json_({ ok: true, service: "Florería La Isabella" });
}

function ensureHeaders_(sheet) {
  const current = sheet.getRange(1, 1, 1, HEADERS.length).getDisplayValues()[0];
  if (current.join("|") !== HEADERS.join("|")) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
}

function cell_(value) {
  if (Array.isArray(value)) return value.join(" | ");
  if (value === null || typeof value === "undefined") return "";
  if (typeof value === "object") return JSON.stringify(value);
  return clean_(value);
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
