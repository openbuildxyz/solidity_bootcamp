"use client";

import { Select, SelectItem } from "@nextui-org/select"
import clsx from "clsx";
import { FC } from "react";

export type SelecterType = {
	className?:string
	types: SelectorType[],
	type: string,
	onChange: (e: any) => void,
}

export type SelectorType = {
    value: string,
    label: string
}

export const Selecter:FC<SelecterType> = ({ className,types,type,onChange }) => {
	const ClassNames = clsx(className);

    return (<>
    <Select label="Type" variant="bordered" placeholder='all' selectionMode="single" radius="lg" className={ClassNames} selectedKeys={[type]} onChange={onChange}>
				{
					types.map((item) => (
						<SelectItem key={item.value} value={item.value}>
							{item.label}
						</SelectItem>
					))
				}
	</Select >
    </>)
}