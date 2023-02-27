module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("teams", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      home_team_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "teams",
          key: "id",
        },
      },
      home_team_goals: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      away_team_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "teams",
          key: "id",
        },
      },
      away_team_goals: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      in_progress: {
        type: Sequelize.BOOL,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("teams");
  },
};
