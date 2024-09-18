import { Model, DataTypes } from 'sequelize';

class Participant extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
            },
            {
                sequelize,
                modelName: 'Participant',
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.User);
        this.belongsTo(models.Chat);
    }
}

export default Participant;