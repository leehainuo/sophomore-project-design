import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";

// 模拟用户数据库 - 在实际项目中，这应该连接到真实的数据库
// const users = [
//   {
//     id: "1",
//     username: "admin",
//     password: "$2a$10$vo3Hfr8M54huwf34AZHTV.ccPs8lBqtvInJ3iUeN/seSsuLtENWM.",
//     role: "管理员",
//   },
//   {
//     id: "2",
//     username: "test",
//     password: "$2a$10$mC2oZoLzapFiVSdDa59cP.yIjhNjIGScVSRVldA5C2DFa8jntANk.",
//     role: "普通用户",
//   },
// ];

const config: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "用户名", type: "text" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // // 查找用户
        // const user = users.find(
        //   (user) => user.username === credentials.username
        // );

        // if (!user) {
        //   return null;
        // }
        // // 验证密码
        // const isPasswordValid = await bcrypt.compare(
        //   credentials.password as string,
        //   user.password as string
        // );

        // if (!isPasswordValid) {
        //   return null;
        // }
        const loginRes = await fetch(
          `${process.env.NEST_API_URL}/user/findone`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          }
        );

        if (!loginRes.ok) {
          // 处理后端失败响应
          const errorData = await loginRes.json();
          console.error("登录失败:", errorData.message);
          
          return null; // 登录失败
        }

        // return {
        //   id: user.id,
        //   username: user.username,
        //   role: user.role,
        // };

        // 处理后端成功响应
        const data = await loginRes.json();
        const user = data?.data

        // 确保 user 对象包含 id, username, role
        if (user && user.id && user.username && user.role) {
          return {
            id: user.id,
            username: user.username,
            role: user.role,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // 将角色信息添加到 JWT token
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string; // 添加 username 到 session.user
        session.user.role = token.role as string; // 将角色信息添加到 session
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },
  secret: process.env.AUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
