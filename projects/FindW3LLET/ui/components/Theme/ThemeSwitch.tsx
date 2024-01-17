"use client";

import { useTheme } from "next-themes";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { Switch, useSwitch } from "@nextui-org/switch";
import { SunIcon } from "./SunIcon";
import { MoonIcon } from "./MoonIcon";
import { useIsSSR } from '@react-aria/ssr';

export function ThemeSwitcher() {
	const {theme, setTheme } = useTheme();
	const isSSR = useIsSSR();
	
	const onChange = () => {
		theme === "light" ? setTheme("dark") : setTheme("light");
	}

	const {
		Component,
		slots,
		isSelected,
		getBaseProps,
		getInputProps,
		getWrapperProps
	} = useSwitch({
		isSelected: theme === "light" || isSSR,
		"aria-label":`Click to Switch to ${theme === "light" || isSSR ? "dark" : "light"} mode`,
		onChange
	});

	return (
		<div className="flex flex-col gap-2">

			<Component {...getBaseProps()}>
				<VisuallyHidden>
					<input {...getInputProps()} />
				</VisuallyHidden>
				<div
				{...getWrapperProps()}
				className={slots.wrapper({
					class: [
						"w-10 h-10",
						"flex item-center justify-center",
						"rounded-lg bg-default-100 hover:bg-default-200",
					],
				})}
				>
					{!isSelected || isSSR ? <SunIcon/>: <MoonIcon/>}
				</div>
			</Component>
		</div>
	)
}
