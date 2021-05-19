import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  IsEmail,
  Model,
  NotNull,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

@Table({ tableName: 'reservation' })
export class Reservation extends Model<Reservation> {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number

  @AllowNull(false)
  @Column
  name: string

  @AllowNull(false)
  @IsEmail
  @Column
  email: string

  @AllowNull(false)
  @Column
  date: Date

  @AllowNull(false)
  @Column
  time: string

  @AllowNull(false)
  @Column({ type: DataType.SMALLINT })
  size: number

  @DeletedAt
  deleted_at: string

  @CreatedAt
  created_at: string

  @UpdatedAt
  updated_at: string
}
