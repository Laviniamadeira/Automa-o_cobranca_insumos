// 📝 2. GERAÇÃO DINÂMICA DE HTML PARA E-MAILS
// ==============================================================================

function montarAssuntoMensal(nomeParceiro, periodo) {
  return "[EMPRESA] Notificação de cobrança de Insumos – " + nomeParceiro + " | Período: " + periodo;
}

function montarAssuntoSemanal(nomeParceiro) {
  return "[EMPRESA] Notificação de acompanhamento de Insumos – " + nomeParceiro;
}

function montarCorpoDoEmail(tipoDisparo, nomeParceiro, periodo, dataLimite, sPen, valSac, gPen, valGay, total, linkForms) {
  var html = "";

  html += "Olá! <b>" + nomeParceiro + "</b><br><br>";
  html += "Este é um comunicado sobre o acompanhamento dos insumos de propriedade da empresa (sacas, gaylords e paletes) enviados às bases parceiras. Ao longo do período, realizamos monitoramentos e consolidamos os volumes enviados e devolvidos para identificar possíveis pendências de devolução.<br><br>";
  html += "Para o período de <b>" + periodo + "</b>, identificamos os seguintes resultados:<br><br>";

  var insumosPendentes = [];

  html += "<table border='1' cellpadding='8' cellspacing='0' style='border-collapse: collapse; width: 100%; max-width: 700px; text-align: center; font-family: Arial, sans-serif; font-size: 14px; border-color: #ddd;'>";
  html += "<tr style='background-color: #00AFFF; color: #FFFFFF;'>";
  html += "<th>Insumo</th><th>Pendentes</th><th>Valor Unit.</th><th>Total Pendente</th>";
  html += "</tr>";

  if (sPen > 0) {
    html += "<tr><td><b>Sacas</b></td><td><b style='color: #d93025;'>" + sPen + "</b></td><td>R$ 3,90</td><td><b>" + formatarMoeda(valSac) + "</b></td></tr>";
    insumosPendentes.push("Sacas");
  }
  if (gPen > 0) {
    html += "<tr><td><b>Gaylords</b></td><td><b style='color: #d93025;'>" + gPen + "</b></td><td>R$ 48,66</td><td><b>" + formatarMoeda(valGay) + "</b></td></tr>";
    insumosPendentes.push("Gaylords");
  }
  html += "</table><br>";

  html += "💰 Valor total pendente de devolução: <b>" + formatarMoeda(total) + "</b><br>";

  if (tipoDisparo === "MENSAL") {
    html += "<div style='background-color: #f4fafd; padding: 12px; margin-top: 15px;'>";
    html += "Caso a devolução não seja realizada até <b>" + dataLimite + "</b>, o valor será descontado do próximo faturamento.</div>";
  }

  html += "<br>Caso já tenha regularizado, por favor desconsidere este aviso. Em caso de dúvidas, preencha o formulário: " + linkForms + "<br><br>";
  html += "Atenciosamente,<br>Equipe de Operações e Materiais";

  return html;
}