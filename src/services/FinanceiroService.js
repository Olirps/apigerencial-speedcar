const NotaFiscal = require('../models/NotaFiscal');
const Financeiro = require('../models/Financeiro');
const Clientes = require('../models/Clientes');
const Fornecedores = require('../models/Fornecedores');
const Funcionarios = require('../models/Funcionarios');
const MovimentacaoFinanceira = require('../models/MovimentacaoFinanceira');



class FinanceiroService {
  static async createLancamentos(dadosFinanceiro) {
    try {

      const despesa = await Financeiro.create({
        nota_id: dadosFinanceiro.notaId || null,
        descricao: dadosFinanceiro.descricao,
        tipo: dadosFinanceiro.tipo,
        cliente_id: dadosFinanceiro.cliente_id || null,
        fornecedor_id: dadosFinanceiro.fornecedor_id || null,
        funcionario_id: dadosFinanceiro.funcionario_id || null,
        valor: dadosFinanceiro.valor,
        data_lancamento: dadosFinanceiro.data_lancamento,
        dtVencimento: dadosFinanceiro.dtVencimento,
        status: dadosFinanceiro.status || 'aberta'
      });

      return despesa;

    } catch (error) {
      console.error('Erro ao registrar despesa:', error);
      throw new Error('Erro ao registrar despesa');
    }
  }

  static async getAllLancamentosFinanceiroDespesa() {
    try {
      const financeiro = await Financeiro.findAll({
        where: { tipo: 'debito' },
        raw: true, // Transforma os dados em objetos JS puros para evitar problemas com Sequelize
        order: [['id', 'DESC']]
      });

      const financeiroComDetalhes = await Promise.all(financeiro.map(async (lancamento) => {
        let entidade = null;
        let entidadeNome = null;

        if (lancamento.fornecedor_id) {
          entidade = await Fornecedores.findOne({ where: { id: lancamento.fornecedor_id }, raw: true });
          entidadeNome = 'fornecedor';
        } else if (lancamento.funcionario_id) {
          entidade = await Funcionarios.findOne({ where: { id: lancamento.funcionario_id }, raw: true });
          entidadeNome = 'funcionario';
        } else if (lancamento.cliente_id) {
          entidade = await Clientes.findOne({ where: { id: lancamento.cliente_id }, raw: true });
          entidadeNome = 'cliente';
        }

        return {
          ...lancamento,
          [entidadeNome]: entidade
        };
      }));

      return financeiroComDetalhes;
    } catch (error) {
      console.error('Erro ao buscar lançamentos:', error);
      throw new Error('Erro ao buscar lançamentos');
    }
  }

  static async getLancamentoDespesaById(id) {
    try {
      const lancamento = await Financeiro.findOne({
        where: { id, tipo: 'debito' },
        raw: true // Para retornar um objeto JavaScript comum
      });

      if (!lancamento) {
        throw new Error('Lançamento financeiro não encontrado');
      }

      let entidade = null;
      let entidadeNome = null;

      if (lancamento.fornecedor_id) {
        entidade = await Fornecedores.findOne({ where: { id: lancamento.fornecedor_id }, raw: true });
        entidadeNome = 'fornecedor';
      } else if (lancamento.funcionario_id) {
        entidade = await Funcionarios.findOne({ where: { id: lancamento.funcionario_id }, raw: true });
        entidadeNome = 'funcionario';
      } else if (lancamento.cliente_id) {
        entidade = await Clientes.findOne({ where: { id: lancamento.cliente_id }, raw: true });
        entidadeNome = 'cliente';
      }

      return {
        ...lancamento,
        [entidadeNome]: entidade
      };
    } catch (error) {
      console.error('Erro ao buscar lançamento:', error);
      throw new Error('Erro ao buscar lançamento financeiro');
    }
  }

  static async createMovimentacaoFinanceira(dadosMovimentacao) {
    try {
      const movimentacao = await MovimentacaoFinanceira.create({
        financeiro_id: dadosMovimentacao.financeiro_id,
        tipo: dadosMovimentacao.tipo,
        valor: dadosMovimentacao.valor,
        data_movimentacao: dadosMovimentacao.data_movimentacao,
        descricao: dadosMovimentacao.descricao
      });

      return movimentacao;
    } catch (error) {
      console.error('Erro ao registrar movimentação financeira:', error);
      throw new Error('Erro ao registrar movimentação financeira');
    }
  }

}

module.exports = FinanceiroService;
