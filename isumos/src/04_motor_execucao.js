// 🤖 4. MOTOR PRINCIPAL DE EXECUÇÃO
// ==============================================================================

function dispararMensal() { iniciarDisparo("MENSAL", false); }
function dispararSemanal() { iniciarDisparo("SEMANAL", false); }
function dispararTesteMensal() { iniciarDisparo("MENSAL", true); }

function iniciarDisparo(tipoDisparo, modoTeste) {
  var planilhaAtual = SpreadsheetApp.getActiveSpreadsheet();
  var aba = planilhaAtual.getSheetByName(NOME_ABA_UNICA);
  var periodoApuracao = aba.getRange(CELULA_PERIODO).getDisplayValue();
  var dataLimiteMensal = aba.getRange(CELULA_LIMITE).getDisplayValue();

  var ultimaLinha = aba.getLastRow();

  for (var i = LINHA_INICIO_DADOS; i <= ultimaLinha; i++) {
    var nomeParceiro = aba.getRange(i, COL_NOME_LEVE).getValue();
    var email = aba.getRange(i, COL_EMAIL).getValue().toString().replace(/;/g, ",");
    var totalPendente = aba.getRange(i, COL_PENDENCIA).getValue();
    var statusAtual = aba.getRange(i, COL_STATUS).getValue();

    // Ignora se estiver vazio, sem pendência financeira ou se já foi enviado
    if (nomeParceiro !== "" && totalPendente > 0 && statusAtual.indexOf("ENVIADO") === -1) {

      var sPen = aba.getRange(i, COL_SACAS_PEN).getValue();
      var vSac = aba.getRange(i, COL_VALOR_SAC).getValue();
      var gPen = aba.getRange(i, COL_GAY_PEN).getValue();
      var vGay = aba.getRange(i, COL_VALOR_GAY).getValue();

      var assunto = montarAssuntoMensal(nomeParceiro, periodoApuracao);
      var corpoEmail = montarCorpoDoEmail(tipoDisparo, nomeParceiro, periodoApuracao, dataLimiteMensal, sPen, vSac, gPen, vGay, totalPendente, LINK_FORMULARIO);

      try {
        MailApp.sendEmail({
          to: modoTeste ? MEU_EMAIL_DE_TESTE : email,
          cc: modoTeste ? "" : EMAILS_COM_COPIA,
          subject: (modoTeste ? "[TESTE] " : "") + assunto,
          htmlBody: corpoEmail,
          name: "Operações - Insumos"
        });
        aba.getRange(i, COL_STATUS).setValue(modoTeste ? "TESTE ENVIADO" : "ENVIADO (" + tipoDisparo + ")");
      } catch (e) {
        aba.getRange(i, COL_STATUS).setValue("ERRO");
      }

      if (modoTeste) break; // Se for teste, dispara só o primeiro válido e para
    }
  }
}