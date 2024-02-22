import { MigrationInterface, QueryRunner } from 'typeorm';

import { RoleNames } from '../../modules/users/role.entity';

export class SystemRolesSeeder1586224315330 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('roles')
      .values([
        {
          id: 1,
          name: RoleNames.SUPER_ADMIN,
          description: 'Dueño del sistema, puede hacerlo todo',
        },
        {
          id: 2,
          name: RoleNames.ADMIN,
          description:
            'Encargado de administrar el sistema, pero no puede crear usuarios ni roles nuevos',
        },
        {
          id: 3,
          name: RoleNames.RECIPE_ADMIN,
          description: 'Control total sobre las recetas',
        },
        {
          id: 4,
          name: RoleNames.RECEPE_OBSERVER,
          description:
            'Puede ver las recetas, pero no editarlas ni crear nuevas',
        },
        {
          id: 5,
          name: RoleNames.TEACHER,
          description: 'Profesor de materia',
        },
        {
          id: 6,
          name: RoleNames.STUDENT,
          description: 'Estudiante de materia',
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('roles')
      .execute();
  }
}
