/**
 * Utilizando com padrão RORO, determina parâmetros mandatórios
 * @param {*} param
 */
module.exports.requiredParam = function requiredParam(param) {
  const requiredParamError = new Error(
    `Parâmetro obrigatório "${param}" não foi informado.`,
  );
  // preserve original stack trace
  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(requiredParamError, requiredParam);
  }
  throw requiredParamError;
};

module.exports.formataCNPJ = function formatCNPJ(cnpj) {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};
