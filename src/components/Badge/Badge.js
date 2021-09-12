import "./Badge.css";
import React from "react";

const Badge = ({ text, icon }) => {
	return (
		<span className="badge">
			{icon}
			{text}
		</span>
	);
};

export default Badge;
