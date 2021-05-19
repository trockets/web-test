import { Inventory } from '../models'
import { Op } from 'sequelize'
import moment from 'moment'

export class InventoryDAO {
  public async getAll(): Promise<Inventory[]> {
    const results = await Inventory.findAll({ where: { deleted_at: null } })
    return results
  }

  public async getInventoryByDate(dateString: string): Promise<Inventory[]> {
    const date = moment(dateString, 'YYYY-MM-DD')
    const dayOfMonth = date.date()
    const dayOfWeek = date.day()
    const month = date.month()
    const year = date.year()
    const timestamp = date.valueOf()

    // TODO account for multiday scenario condition where times + duration includes dayOfMonth

    const inventory = await Inventory.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              {
                // Single Occurrencses
                [Op.and]: [
                  { dayOfMonth: { [Op.contains]: [dayOfMonth] } },
                  { month: { [Op.contains]: [month] } },
                  { year: { [Op.contains]: [year] } },
                ],
              },
              // Repeat days of week
              {
                [Op.and]: [
                  { dayOfWeek: { [Op.contains]: [dayOfWeek] } },
                  { dayOfMonth: null },
                  { month: null },
                  { year: null },
                ],
              },
              // Repeat all days
              {
                [Op.and]: [
                  { dayOfWeek: null },
                  { dayOfMonth: null },
                  { month: null },
                  { year: null },
                ],
              },
            ],
          },
          { [Op.or]: [{ start: { [Op.lte]: timestamp } }, { start: null }] },
          { [Op.or]: [{ end: { [Op.gte]: timestamp } }, { end: null }] },
          { deleted_at: null },
        ],
      },
    })

    return inventory
  }
}
