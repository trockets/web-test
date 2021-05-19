import { Controller, Delete, Get, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { DatabaseError } from 'sequelize'
import { ValidationError } from 'sequelize'
import logger from '../logger'
import { Inventory } from '../models'
import { InventoryDAO } from '../services/InventoryDAO'

@Controller('inventory')
export class InventoryController {
  private inventoryDAO: InventoryDAO
  constructor() {
    this.inventoryDAO = new InventoryDAO()
  }

  @Get('')
  private async get(req: Request, res: Response) {
    const results = await this.inventoryDAO.getAll()
    res.send(results)
  }

  @Get(':date')
  private async getById(req: Request, res: Response) {
    try {
      const results = await this.inventoryDAO.getInventoryByDate(req.params.date)
      res.send(results)
    } catch (err) {
      this.handleError(err, res)
    }
  }

  @Post('')
  private async post(req: Request, res: Response) {
    try {
      if (req.body.id) {
        await this.update(req.body.id, req.body, res)
        return res.sendStatus(200)
      } else {
        const inventory = await Inventory.create(req.body)
        res.send(inventory)
      }
    } catch (err) {
      this.handleError(err, res)
    }
  }

  @Delete(':id')
  private async delete(req: Request, res: Response) {
    try {
      const result = await Inventory.findByPk(req.params.id)
      if (!result) {
        res.send(404)
      } else {
        await result.destroy()
      }
      return res.sendStatus(200)
    } catch (err) {
      this.handleError(err, res)
    }
  }

  private async update(
    id: string,
    options: { [key in keyof Inventory]?: any },
    res: Response
  ): Promise<void> {
    const result = await Inventory.findByPk(id)
    if (!result || result.getDataValue('deleted_at') != null) {
      res.send(404)
    } else {
      await result.update(options)
    }
  }

  private handleError(err: any, res: Response): Response {
    logger.error(err)
    if (err instanceof ValidationError || err instanceof DatabaseError) {
      return res.status(400).send(err.message)
    } else {
      return res.sendStatus(500)
    }
  }
}
