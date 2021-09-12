import "./App.css";
import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import FormPage from "./pages/FormPage";

const App = () => {
	let [selectedForm, setSelectedForm] = useState(null);

	return (
		<div className="app">
			{selectedForm ? (
				<FormPage form={selectedForm} onClose={() => setSelectedForm(null)} />
			) : (
				<HomePage onSelect={setSelectedForm} />
			)}
		</div>
	);
};

export default App;
