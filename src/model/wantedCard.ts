import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class WantedCard extends Model {
    public userId!: number;
    public cardId!: string;
}

WantedCard.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        cardId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
    },
    {
        sequelize,
        tableName: 'wanted_cards',
        timestamps: true,
    }
);

export default WantedCard;
