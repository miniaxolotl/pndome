import { Prisma, PrismaClient } from '.prisma/client';

import { RoleType } from '@lib/shared';
import { genHash } from '@lib/util/bcrypt';

import _ from 'lodash';
import { uid } from 'uid/secure';

import config from '../server.config';

const db = new PrismaClient();

(async () => {
  const roleData: Prisma.RoleCreateInput[] = _.map(RoleType, (r) => r);

  const userData: Prisma.UserCreateInput[] = [
    {
      userId: uid(16),
      email: config.ADMIN_EMAIL,
      username: config.ADMIN_USER,
      password: await genHash(config.ADMIN_PASS),
    },
  ];

  console.log('/**************** seeding ****************/');

  console.log('\n---- role ----');

  /************* ROLE *************/
  for (const r of roleData) {
    const role = await db.role.create({
      data: r,
    });
    console.log(`created role: ${role.roleId}`);
  }

  console.log('\n---- user ----');

  /************* USER *************/
  for (const u of userData) {
    const user = await db.user.create({
      data: u,
    });

    console.log(`created user:#${user.userId}\n${user.email}\n${user.password}\n`);
  }
})();
