import { Prisma, PrismaClient } from ".prisma/client";
import { uid } from "uid/secure";
import { Bcrypt } from "../packages/pndome/lib/util";

import config from "../server.config";

const db = new PrismaClient();

(async () => {
  const roleData: Prisma.RoleCreateInput[] = [
    {
      roleId: "developer",
      authority: 1,
    },
    {
      roleId: "admin",
      authority: 2,
    },
    {
      roleId: "moderator",
      authority: 3,
    },
    {
      roleId: "pro_user",
      authority: 4,
    },
    {
      roleId: "user",
      authority: 5,
    },
    {
      roleId: "disabled",
      authority: 0,
    },
  ];

  const userData = [
    {
      userId: uid(16),
      email: config.ADMIN_EMAIL,
      username: config.ADMIN_USER,
      password: await Bcrypt.genHash(config.ADMIN_PASS),
      roles: {
        create: [
          {
            roleId: "developer",
          },
          {
            roleId: "admin",
          },
          {
            roleId: "user",
          },
        ],
      },
    },
  ];

  console.log("/**************** seeding ****************/");

  console.log("\n---- role ----");

  /************* ROLE *************/
  for (const r of roleData) {
    const role = await db.role.create({
      data: r,
    });
    console.log(`created role: ${role.roleId}`);
  }

  console.log("\n---- user ----");

  /************* USER *************/
  for (const u of userData) {
    const user = await db.user.create({
      data: u,
    });
    console.log(
      `created user: #${user.userId}\n ${user.email}\n ${user.password}\n`
    );
  }
})();
