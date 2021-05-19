import { Controller, Delete, Get, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { DatabaseError } from 'sequelize'
import { ValidationError } from 'sequelize'
import { Reservation } from '../models'
import logger from '../logger'

@Controller('reservation')
export class ReservationController {
  @Get(':date')
  private async getByDate(req: Request, res: Response) {
    try {
      await Reservation.findAll({
        where: {
          date: req.params.date,
        },
      }).then(result => {
        res.send(result)
      })
    } catch (err) {
      this.handleError(err, res)
    }
  }

  @Post('')
  private async post(req: Request, res: Response) {
    try {
      if (req.body.id) {
        await this.update(req.body.id, req.body, res)
        res.sendStatus(200)
      } else {
        const reservation = await Reservation.create(req.body)
        res.send(reservation)
      }
    } catch (err) {
      this.handleError(err, res)
    }
  }

  @Delete(':id')
  private async delete(req: Request, res: Response) {
    try {
      const result = await Reservation.findByPk(req.params.id)
      if (!result) {
        res.send(404)
      } else {
        await result.update({ deleted_at: new Date() })
      }
      return res.sendStatus(200)
    } catch (err) {
      this.handleError(err, res)
    }
  }

  private async update(
    id: string,
    options: { [key in keyof Reservation]?: any },
    res: Response
  ): Promise<void> {
    const result = await Reservation.findByPk(id)
    if (!result || result.getDataValue('deleted_at') != null) {
      res.send(404)
    } else {
      await result.update(options)
    }
  }

  private handleError(err: any, res: Response): Response {
    console.log(err)
    logger.error(err)
    if (err instanceof ValidationError || err instanceof DatabaseError) {
      return res.status(400).send(err.message)
    } else {
      return res.sendStatus(500)
    }
  }
}
