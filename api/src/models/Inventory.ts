import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  Model,
  NotNull,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

@Table({ tableName: 'inventory' })
export class Inventory extends Model<Inventory> {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number

  @AllowNull(false)
  @Column
  title: string

  @Column
  color: string

  @Column
  description: string

  @AllowNull(false)
  @Column
  size: number

  @Column({ type: DataType.ARRAY(DataType.SMALLINT) })
  dayOfMonth: number[]

  @Column({ type: DataType.ARRAY(DataType.SMALLINT) })
  dayOfWeek: number[]

  @Column({ type: DataType.INTEGER })
  duration: number

  @Column
  durationUnit: string

  @Column({ type: DataType.ARRAY(DataType.SMALLINT) })
  month: number[]

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  times: string[]

  @Column({ type: DataType.ARRAY(DataType.SMALLINT) })
  year: number[]

  @Column({ type: DataType.ARRAY(DataType.SMALLINT) })
  exclude: number[]

  @Column({ type: DataType.BIGINT })
  start: number

  @Column({ type: DataType.BIGINT })
  end: number

  @DeletedAt
  deleted_at: string

  @CreatedAt
  created_at: string

  @UpdatedAt
  updated_at: string
}
