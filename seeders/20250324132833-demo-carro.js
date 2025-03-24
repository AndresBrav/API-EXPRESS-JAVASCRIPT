'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Carros', [
          {
            nombre: 'VW1',
            descripcion: "Auto medio",
            precio: 15000,
            stock: 10000,
            user_id: 6
          },
          {
            nombre: 'VW2',
            descripcion: "Auto chico",
            precio: 10000,
            stock: 5000,
            user_id: 6
          },
          {
            nombre: 'VW3',
            descripcion: "Auto grande",
            precio: 20000,
            stock: 20000,
            user_id: 6
          },
          {
            nombre: 'VW4',
            descripcion: "Auto chico",
            precio: 10000,
            stock: 5000,
            user_id: 6
          },
          {
            nombre: 'VW5',
            descripcion: "Auto grande",
            precio: 20000,
            stock: 20000,
            user_id: 6
          },
          {
            nombre: 'VW6',
            descripcion: "Auto chico",
            precio: 10000,
            stock: 5000,
            user_id: 6
          },
          {
            nombre: 'Audi',
            descripcion: "Auto grande",
            precio: 20000,
            stock: 20000,
            user_id: 7
          },
          {
            nombre: 'Audi',
            descripcion: "Auto chico",
            precio: 10000,
            stock: 5000,
            user_id: 7
          },
          {
            nombre: 'Audi',
            descripcion: "Auto grande",
            precio: 20000,
            stock: 20000,
            user_id: 7
          },
          {
            nombre: 'Ferrari',
            descripcion: "Auto chico",
            precio: 10000,
            stock: 5000,
            user_id: 7
          },
          {
            nombre: 'Ferrari',
            descripcion: "Auto grande",
            precio: 20000,
            stock: 20000,
            user_id: 7
          },
          {
            nombre: 'Porsche',
            descripcion: "Auto chico",
            precio: 10000,
            stock: 5000,
            user_id: 8
          },
          {
            nombre: 'Porsche',
            descripcion: "Auto grande",
            precio: 20000,
            stock: 20000,
            user_id: 8
          }
        ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
