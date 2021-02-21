const MESSAGES = {
    'INTERNAL_SERVER_ERROR': 'Internal Server Error',
    "DATABASE_ERROR": "Erro ao gravar informações no banco de dados. Tente novamente mais tarde.",
    'EMAIL_ALREADY_REGISTERED': 'Esse email já foi cadastrado.',
    'INVALID_TOKEN' : 'Token Inválido',
    'INCORRECT_EMAIL_OR_PASSWORD': 'Email ou Senha Incorretos!',
    'PASSWORD_TOO_SHORT' : 'Por favor, insira uma senha com 6 ou mais caracteres.', 
    'VALID_EMAIL' : 'Por favor, insira um email válido.',
    'WITHOUT_TOKEN' : 'Token não enviado',
    'NAME_REQUIRED': 'Nome é um campo obrigatório',
    'NAME_LOCALIZATION_REQUIRED': 'Cidade é um campo obrigatório',
    'TIPO_REQUIRED': 'Tipo é um campo obrigatório',
    'NAME_MUST_BE_A_STRING': 'O campo nome precisa ser do tipo String',
    '404_ESTABELECIMENTO': 'Id Inválido, estabelecimento não encontrado!',
    '404_LOCALIZACOES': 'Nenhuma localização cadastrada.',
    '404_EMPRESAS': 'Nenhuma empresa cadastrada.',
    '404_EMPRESA': 'Id Inválido, empresa não encontrada.',
    'ESTABELECIMENTO_EMPTY_LIST': 'Lista de estabelecimentos vazia',
    'FORBIDDEN': "Usuário não tem permissão para executar esta ação.",
    'ENDERECO_REQUIRED': "Endereço é um campo obrigatório",
    'LOCALIZACAO_REQUIRED': "Localização é um campo obrigatório",
    'ID_EMPRESA_REQUIRED': 'Empresa não foi selecionada.'
}

module.exports = MESSAGES
