import "./Button.css";
import React from "react";

const Button = ({ title, icon, onClick }) => {
	return (
		<button onClick={onClick} title={title}>
			{icon}
		</button>
	);
};

export default Button;
