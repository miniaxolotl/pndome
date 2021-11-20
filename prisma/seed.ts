import { connectDB, db } from 'lib/src';

import { UserRoleType } from '@lib/shared';
import { genHash } from '@lib/util/bcrypt';

import _ from 'lodash';
import { uid } from 'uid/secure';

import config from '../server.config';
import { Prisma } from '@prisma/client';

(async () => {
  await connectDB();
  const roleData: Prisma.RoleCreateInput[] = _.map(UserRoleType, (r) => r);

  const seed_password = await genHash(config.ADMIN_PASS);

  const userData: Prisma.UserCreateInput[] = [
    {
      userId: uid(16),
      email: config.ADMIN_EMAIL,
      username: config.ADMIN_USER,
      password: await genHash(config.ADMIN_PASS),
    },
    // NOTE: genereate random users
    ..._.times(10, () => ({
      userId: uid(16),
      email: `${uid(6)}@emawa.io`,
      username: `${uid(8)}`,
      password: seed_password,
    })),
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
      data: {
        ...u,
        roles: {
          create: [
            { roleId: UserRoleType.DEVELOPER.roleId },
            { roleId: UserRoleType.ADMIN.roleId },
            { roleId: UserRoleType.USER.roleId },
          ],
        },
      },
    });
    console.log(`created user:#${user.userId}\n${user.email}\n${user.password}\n`);
  }
})();
