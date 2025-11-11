"use client";

import React, { ChangeEvent } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface SearchBarProps {
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	className?: string;
}

function SearchBar({
	placeholder = "Search...",
	value,
	onChange,
	className = "",
}: SearchBarProps) {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value);
	};

	const handleClear = () => {
		onChange("");
	};

	return (
		<div className={`relative w-full  ${className}`}>
			<div className="relative flex items-center">
				<div className="absolute left-4 pointer-events-none text-gray-500">
					<SearchIcon />
				</div>

				{/* Input Field */}
				<input
					type="text"
					value={value}
					onChange={handleChange}
					placeholder={placeholder}
					className="w-full pl-12 pr-12 py-3 rounded-xl bg-[#F5F3F3] text-[#0E4663] outline-none "
				/>

				{/* Clear Button */}
				{value && (
					<button
						type="button"
						onClick={handleClear}
						className="absolute right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 cursor-pointer"
						aria-label="Clear search"
					>
						<ClearIcon />
					</button>
				)}
			</div>
		</div>
	);
}

export default SearchBar;
