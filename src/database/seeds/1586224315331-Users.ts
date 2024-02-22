import { Role, RoleNames } from '../../modules/users/role.entity';
import { User } from '../../modules/users/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

const bcrypt = require('bcrypt');

require('dotenv').config();

export class SeederSystemUsers1586224315331 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('users')
      .values([
        {
          email: 'sulderyarellano18@gmail.com',
          username: 'suldery.arellano',
          mobile: '0998143091',
          firstName: 'Suldery',
          lastName: 'Arellano',
          fullName: 'Suldery Arellano',
          avatar: `https://ui-avatars.com/api/?name=SulderyArellano&background=random`,
          isActive: true,
        },
      ])
      .execute();

    const admin1 = await queryRunner.manager
      .createQueryBuilder()
      .select('users')
      .from(User, 'users')
      .where('users.email= :email', {
        email: 'sulderyarellano18@gmail.com',
      })
      .getOne();

    const superAdminRole = await queryRunner.manager
      .createQueryBuilder()
      .select('roles')
      .from(Role, 'roles')
      .where('roles.name = :name', { name: RoleNames.SUPER_ADMIN })
      .getOne();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('user_roles')
      .values([
        {
          user_id: admin1.id,
          role_id: superAdminRole.id,
        },
      ])
      .execute();

    await queryRunner.manager.query(
      `INSERT INTO credentials (password, user_id) VALUES ($1, $2)`,
      [bcrypt.hashSync(process.env.DEFAULT_PASSWORD, 10), admin1.id],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('system_users_roles')
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('system_users')
      .execute();
  }
}
