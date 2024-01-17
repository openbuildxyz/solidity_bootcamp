import "@/styles/globals.css";
import { Metadata } from "next";
// import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import { ThemeSwitcher } from "@/components/Theme/ThemeSwitch";
import { SideWall } from "@/components/SideWall";

export const metadata: Metadata = {
	// title: {
	// 	default: siteConfig.name,
	// 	template: `%s - ${siteConfig.name}`,
	// },
	// description: siteConfig.description,
	// themeColor: [
	// 	{ media: "(prefers-color-scheme: light)", color: "white" },
	// 	{ media: "(prefers-color-scheme: dark)", color: "rgb(63 63 70)" },
	// ],
	// icons: {
	// 	icon: "/favicon.ico",
	// 	shortcut: "/favicon-16x16.png",
	// 	apple: "/apple-touch-icon.png",
	// },
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning className="dark:bg-zinc-800 bg-[#F3F3F3]">
			<head />
			<body
				className={clsx(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable
				)}
			>
				<Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
					<div className="relative flex flex-row h-screen">
						<SideWall/>
						<div className="flex flex-col w-3/5 pl-4 pr-2 py-2 bg-gray-100">
							<Navbar />
							<main className="container mx-auto max-w-7xl pt-2 flex-grow overflow-y-auto max-h-screen-80">
								{children}
							</main>
						</div>
					</div>
				</Providers>
			</body>
		</html>
	);
}
