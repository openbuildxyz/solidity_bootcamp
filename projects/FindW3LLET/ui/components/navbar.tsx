import {
	Navbar as NextUINavbar,
	NavbarContent,
	NavbarMenu,
	NavbarMenuToggle,
	NavbarBrand,
	NavbarItem,
	NavbarMenuItem,
} from "@nextui-org/navbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ThemeSwitcher } from "./Theme/ThemeSwitch";
import { FW3_small } from "./SvgComponents/FW3-small-logo";
import { Link } from "@nextui-org/link";
import { avatar } from "@nextui-org/theme";

export function Navbar() {
	
	return (
		<NextUINavbar className="bg-white dark:bg-[#ffffff] rounded-3xl shadow" >
			<NavbarBrand>
				<Link href="/">
					<FW3_small/>	 
				</Link>
			</NavbarBrand>	
			<NavbarContent justify="center">
				<NavbarItem>
					<Link href="/rank">
						Wallet ranking(mock)
					</Link>
				</NavbarItem>
			</NavbarContent>
			<NavbarContent justify="end">	
				{/* todo 配色问题 主题切换展示弃用 */}
				{/* <NavbarItem>
					<ThemeSwitcher/>
				</NavbarItem> */}
				<NavbarItem>
					<ConnectButton showBalance={false} accountStatus="avatar"/>
				</NavbarItem>				
			</NavbarContent>
		</NextUINavbar>
	);
};
