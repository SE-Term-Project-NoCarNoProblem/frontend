"use client";

import { useState } from "react";

type Role = "CUSTOMER" | "DRIVER";

interface RoleToggleProps {
	value?: Role;
	onChange?: (value: Role) => void;
}

export default function RoleToggle({ value, onChange }: RoleToggleProps) {
	const [internalValue, setInternalValue] = useState<Role>(value ?? "CUSTOMER");
	const current = value ?? internalValue;

	const handleChange = (next: Role) => {
		setInternalValue(next);
		onChange?.(next);
	};

	const baseBtn =
		"flex-1 px-4 py-2 text-sm text-[#0E4663] font-semibold rounded-xl transition-all duration-600";

	const activeBtn = "bg-white shadow-sm  my-1 mx-1 ";
	const inactiveBtn = "bg-transparent ";

	return (
		<div className="inline-flex flex-row rounded-xl bg-[#F5F3F3] mb-4 h-full">
			<button
				type="button"
				onClick={() => handleChange("CUSTOMER")}
				className={`${baseBtn} ${
					current === "CUSTOMER" ? activeBtn : inactiveBtn
				}`}
			>
				CUSTOMER
			</button>
			<button
				type="button"
				onClick={() => handleChange("DRIVER")}
				className={`${baseBtn} ${
					current === "DRIVER" ? activeBtn : inactiveBtn
				}`}
			>
				DRIVER
			</button>
		</div>
	);
}
