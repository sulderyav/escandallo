import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export enum CareerMode {
  PRESENCIAL = 'PRESENCIAL',
  SEMIPRESENCIAL = 'SEMIPRESENCIAL',
  VIRTUAL = 'VIRTUAL',
}

@Entity('careers')
export class Career {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: CareerMode,
    nullable: false,
    default: CareerMode.PRESENCIAL,
  })
  mode: CareerMode;

  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
  })
  isDeleted: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt: Date;

  @Exclude()
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @BeforeUpdate()
  async setDeletedAt() {
    if (this.isDeleted) {
      this.deletedAt = new Date();
    }
  }
}
