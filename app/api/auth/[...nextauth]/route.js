import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/config/db";
import User from "@/models/User";

export const authOptions = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "credentials",
			credentials: {
				email: {
					label: "Email",
					type: "email",
				},
				password: {
					label: "Password",
					type: "password",
				}
			},
			async authorize(credentials) {
				await connectDB();
				try {
					const user = await User.findOne({ email: credentials.email });
					if (user) {

						const isPasswordCorrect = await bcrypt.compare(
							credentials.password,
							user.password
						);
						if (isPasswordCorrect) {
							return Promise.resolve(user);
						} else {
							return Promise.resolve(null);
						}
			}
					// if (user && user.password === credentials.password) {
					// 	return Promise.resolve(user);
					// }
					else {
						return Promise.resolve(null);
					}
				} catch (error) {
					throw new Error(error.message);
				}
			}
		})
	],
	callbacks: {
		async signIn({ user, account }) {
			if (account?.provider == "credentials") {
				return Promise.resolve(true);
			} else {
				return Promise.resolve(false);
			}
		}
	}
};
export const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}
