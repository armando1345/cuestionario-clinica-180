# Instalación de Google Apps Script y publicación en GitHub Pages

## Parte 1. Instalar el receptor en Google Sheets

1. Abra la hoja de Google Sheets vinculada actualmente al cuestionario:
   https://docs.google.com/spreadsheets/d/1HR3A6Kct3fLepX92-lhaxSdgBWLxBMUmaB8kwU5axM8/edit
2. En la hoja, abra **Extensiones → Apps Script**.
3. En el editor, seleccione el archivo **Código.gs**.
4. Borre todo su contenido.
5. Abra el archivo local **apps-script/Code.gs** de esta carpeta, copie todo y péguelo en Código.gs.
6. Cambie el nombre del proyecto a **Clínica 180° - Receptor del cuestionario**.
7. Pulse **Guardar proyecto en Drive**.

El código utilizará la pestaña **Respuestas**, ya preparada con las columnas de Clínica 180°.

## Parte 2. Crear la aplicación web

Si ya había implementado la versión anterior, abra **Implementar → Administrar implementaciones**, edite la implementación, seleccione **Nueva versión** y pulse **Implementar**. Así conservará la URL que ya está guardada en el formulario.

Si todavía no existe una implementación:

1. En Apps Script, pulse **Implementar → Nueva implementación**.
2. Junto a **Seleccionar tipo**, pulse el engranaje y seleccione **App web**.
3. Use estos valores:
   - Descripción: **Receptor web del cuestionario v1**
   - Ejecutar como: **Yo**
   - Usuarios con acceso: **Cualquiera**
4. Pulse **Implementar**.
5. Cuando Google pida autorización, pulse **Autorizar acceso** y seleccione su cuenta.
6. Si aparece la advertencia “Google no verificó esta app”:
   - Pulse **Avanzado**.
   - Pulse **Ir a Clínica 180° - Receptor del cuestionario (no seguro)**.
   - Pulse **Permitir**.
7. Copie la **URL de la aplicación web**. Debe terminar en **/exec**.

La advertencia aparece porque el script es privado y fue creado por usted, no porque utilice un servicio externo.

## Parte 3. Conectar el cuestionario

1. Abra **assets/config.js** con un editor de texto.
2. Sustituya únicamente:

   PEGA_AQUI_LA_URL_DE_APPS_SCRIPT

   por la URL que copió. Mantenga las comillas.
3. Guarde el archivo.

El resultado debe verse así:

    window.CLINICA_180_CONFIG = {
      endpoint: "https://script.google.com/macros/s/IDENTIFICADOR/exec"
    };

## Parte 4. Subir a GitHub Pages

Nombre recomendado del repositorio:

    cuestionario-clinica-180

El nombre puede ser diferente; no afecta la conexión con Google Sheets.

1. Cree el repositorio en GitHub.
2. Suba **el contenido de esta carpeta**, no una carpeta contenedora adicional.
3. Compruebe que **index.html** aparezca en la raíz del repositorio.
4. Abra **Settings → Pages**.
5. En **Build and deployment**, seleccione **Deploy from a branch**.
6. Seleccione la rama **main**, la carpeta **/ (root)** y pulse **Save**.
7. Espere a que GitHub muestre la URL publicada.

No cambie los nombres ni la ubicación de index.html, gracias.html, assets o apps-script.

## Parte 5. Probar la conexión

1. Abra la URL de GitHub Pages.
2. Complete el cuestionario con respuestas de prueba.
3. Pulse **Enviar respuestas**.
4. Confirme que se abra gracias.html.
5. Abra la pestaña **Respuestas** de Google Sheets y confirme que apareció una fila nueva.
6. Cuando la prueba sea correcta, puede borrar esa fila de prueba.

## Si modifica Code.gs en el futuro

1. Guarde el cambio en Apps Script.
2. Abra **Implementar → Administrar implementaciones**.
3. Edite la implementación.
4. Seleccione **Nueva versión** y vuelva a implementar.

Normalmente la URL /exec se conserva, por lo que no hace falta cambiar assets/config.js.
