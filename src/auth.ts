import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { SignInSchema } from "./lib/zod"
import prisma from "../prisma";
import { compareSync } from "bcryptjs";


 
export const { handlers, signIn, signOut, auth } = NextAuth({
// adapter: PrismaAdapter(prisma),
session:{strategy:"jwt"},
pages:{
  signIn:"/login"
},
  providers: [
    Credentials({
      credentials: {
        name:{},
        password:{}
      },
      authorize: async(credentials) =>{
        const validateFields = SignInSchema.safeParse(credentials);
        if (!validateFields.success){
          return null
        }

        const {email, password} = validateFields.data

        const user = await prisma.user.findUnique({
          where:{email}
        })

        if(!user || !user.password){
          throw new Error("No user Found")
        }

        const passwordMatch = compareSync(password, user.password);


        if(!passwordMatch)return null;

        return user;
      }
    })
  ],
  callbacks:{
    authorized({auth, request: {nextUrl}}){
      const isLoggedIn = !!auth?.user;
      const ProtectedRoutes = ["/", "/profil","/akun","/laporan" ];

      if(!isLoggedIn && ProtectedRoutes.includes(nextUrl.pathname)){
        return Response.redirect(new URL("/login", nextUrl))
        
      }

      if(isLoggedIn && nextUrl.pathname.startsWith("/login")){
        return Response.redirect(new URL("/", nextUrl))

      }
      return true
    },

    jwt({ token, user }) {
      if (user && typeof user === "object" && "role" in user) {
        token.role = (user ).role as string; // pastikan role bertipe string
      }
      return token;
    },
    session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.sub ?? "",
        role: token.role as string ?? "user", // casting ke string
      };
      return session;
    }
  }
})