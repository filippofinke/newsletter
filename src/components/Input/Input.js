import "./Input.css";
import React from "react";
import Button from "./../Button/Button";

const Input = ({
	type,
	placeholder,
	value,
	onChange,
	title,
	icon,
	onClick,
	onEnter,
}) => {
	const handleKeyDown = (key) => {
		if (key.code === "Enter") onEnter();
	};

	return (
		<div className="input">
			<input
				onKeyDown={handleKeyDown}
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
			/>
			{icon && <Button title={title} icon={icon} onClick={onClick} />}
		</div>
	);
};

export default Input;
