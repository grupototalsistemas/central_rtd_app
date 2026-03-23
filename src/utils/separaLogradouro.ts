/**
 * Função para separar o tipo de logradouro (Rua, Avenida, etc.) do nome da rua
 * 
 * @param logradouroCompleto - O logradouro completo retornado da API (ex: "Rua Domingues de Sá")
 * @returns Objeto com logradouro (tipo) e endereco (nome da rua)
 * 
 * @example
 * separarLogradouro("Rua Domingues de Sá")
 * // Retorna: { logradouro: "RUA", endereco: "Domingues de Sá" }
 * 
 * separarLogradouro("Avenida Paulista")
 * // Retorna: { logradouro: "AVENIDA", endereco: "Paulista" }
 */
export const separarLogradouro = (logradouroCompleto: string) => {
  // Lista dos tipos mais comuns de logradouro no Brasil
  const tiposLogradouro = [
    'RUA', 'AVENIDA', 'ALAMEDA', 'TRAVESSA', 'PRAÇA', 'LARGO',
    'RODOVIA', 'ESTRADA', 'VILA', 'QUADRA', 'LOTE', 'CONJUNTO'
  ]

  // Converte para maiúsculo para comparação
  const textoUpper = logradouroCompleto.toUpperCase().trim()

  // Procura se o texto começa com algum tipo de logradouro
  for (const tipo of tiposLogradouro) {
    if (textoUpper.startsWith(tipo + ' ')) {
      return {
        // Retorna o tipo (ex: "RUA")
        logradouro: tipo,
        // Retorna o resto do texto (ex: "Domingues de Sá")
        endereco: logradouroCompleto.substring(tipo.length).trim()
      }
    }
  }

  // Se não encontrar nenhum tipo, assume "RUA" como padrão
  return {
    logradouro: 'RUA',
    endereco: logradouroCompleto
  }
}

export default separarLogradouro