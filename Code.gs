const SPREADSHEET_ID = '1Gf_W4NEWAf6yWiOg_ormW3QUemaKEaU_AUC1YuoPJhw';
const SHEET_NAME = 'Alertas';

/**
 * Função principal para lidar com requisições GET.
 * Agora suporta tanto a renderização das páginas quanto chamadas de API via parâmetro 'action'.
 */
function doGet(e) {
  const action = e.parameter.action;
  
  // Roteamento de API (para Netlify/Frontend Externo)
  if (action) {
    let result;
    switch(action) {
      case 'enviar':
        result = enviarAlerta(e.parameter.item, e.parameter.setor);
        break;
      case 'buscar':
        result = buscarNovosAlertas();
        break;
      case 'concluir':
        result = concluirAlerta(e.parameter.id);
        break;
      default:
        result = { success: false, error: 'Ação inválida' };
    }
    
    // Retorna JSON com cabeçalhos de CORS (via ContentService)
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Roteamento de Páginas (Interno AppScript)
  const page = e.parameter.p || 'barracao';
  if (page === 'cozinha') {
    return HtmlService.createTemplateFromFile('Cozinha')
      .evaluate()
      .setTitle('Monitor Cozinha - Recebimento')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  
  return HtmlService.createTemplateFromFile('Barracao')
    .evaluate()
    .setTitle('Monitor Barracão - Envio')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Data', 'Item', 'Setor', 'Status']);
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
  }
  return sheet;
}

function enviarAlerta(item, setor) {
  try {
    const sheet = getSheet();
    sheet.appendRow([new Date(), item, setor, 'Pendente']);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function buscarNovosAlertas() {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    const alertas = [];
    
    // Pular cabeçalho
    for (let i = 1; i < data.length; i++) {
      if (data[i][3] === 'Pendente') {
        alertas.push({
          id: i + 1, // Linha na planilha
          data: data[i][0],
          item: data[i][1],
          setor: data[i][2]
        });
      }
    }
    return { success: true, alertas: alertas };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function concluirAlerta(id) {
  try {
    const sheet = getSheet();
    sheet.getRange(id, 4).setValue('Concluído');
    return { success: true };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}
