import { betterAuth, BetterAuthOptions } from "better-auth" ;
import prisma from "@/lib/prisma"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { sendEmail } from "@/actions/email";
import {openAPI} from "better-auth/plugins"


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mongodb"
    }),
    plugins: [openAPI()],
        emailAndPassword :{ 
            enabled:true,
            requireEmailVerification:true
        },
        emailVerification:{
            sendOnSignUp:true,
            autoSignInAfterVerification: true,
            sendVerificationEmail: async({ user, token}) =>{
                const VerificationURL = `$(process.env.BETTER_AUTH_URL)/Api/auth/
                verify-email?token=$(token)&callbackURL=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`;
                await sendEmail({
                    to:user.email,
                    subject: "verify your email address",
                    text: "Click the link to verify your email: ${VerificationURL}"
                })
            }
        }

} satisfies BetterAuthOptions)