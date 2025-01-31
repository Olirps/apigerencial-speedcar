// src/models/MovimentacoesEstoque.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Municipio = require('../models/Municipio');



const Clientes = sequelize.define('Clientes', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    nomeFantasia: {
        type: DataTypes.STRING(150),
        allowNull: true,
    },
    cpfCnpj: {
        type: DataTypes.STRING(18),
        allowNull: false,
        unique: true,
    },
    fone: {
        type: DataTypes.STRING(11),
        allowNull: true
    },
    celular: {
        type: DataTypes.STRING(11),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    logradouro: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    numero: {
        type: DataTypes.STRING(8),
        allowNull: false
    },
    bairro: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    municipio_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'municipio', // Nome da tabela associada
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    uf_id: {
        type: DataTypes.STRING(2),
        allowNull: false
    },
    cep: {
        type: DataTypes.STRING(9),
        allowNull: false
    },
    observacoes: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    dta_primeira_compra: {
        type: DataTypes.DATE,
        allowNull: true
    },
    dta_ultima_compra: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt:{
        type: DataTypes.STRING(50),
        allowNull: true
    }
    
}, {
    sequelize,
    modelName: 'Clientes',
    tableName: 'clientes',
    timestamps: false // Desabilita os timestamps automáticos
});

// Associação com Produtos
Clientes.belongsTo(Municipio, {
    foreignKey: 'municipio_id',
    as: 'municipio'
});

module.exports = Clientes;
