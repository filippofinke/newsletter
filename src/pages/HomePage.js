import React, { useState, useEffect } from "react";
import {
	ChevronRightIcon,
	LinkIcon,
	UsersIcon,
} from "@heroicons/react/outline";
import toast, { Toaster } from "react-hot-toast";

import Header from "./../components/Header/Header";
import Row from "./../components/Row/Row";
import Badge from "./../components/Badge/Badge";
import Button from "./../components/Button/Button";

const HomePage = ({ onSelect }) => {
	let [forms, setForms] = useState(null);

	useEffect(() => {
		fetch("/forms")
			.then((r) => r.json())
			.then((forms) => {
				setForms(forms);
			});
	}, []);

	const copyLink = (form) => {
		let link =
			window.location.protocol +
			"//" +
			window.location.host +
			"/form/" +
			form.id;

		toast.promise(navigator.clipboard.writeText(link), {
			loading: "Saving to clipboard...",
			success: <b>Link copied!</b>,
			error: <b>Failed to copy the link!</b>,
		});
	};

	return (
		<div className="home-page">
			<Toaster position="bottom-center" />
			<Header>
				<h2>Your forms</h2>
			</Header>
			{forms && (
				<div className="forms">
					{forms.map((form) => {
						return (
							<Row key={form.id}>
								<Badge text={new Date(form.created_at).toLocaleDateString()} />
								<Badge icon={<UsersIcon />} text={form.emails} />
								<span className="name">{form.name}</span>
								<div className="actions">
									<Button
										onClick={() => copyLink(form)}
										title="Copy link"
										icon={<LinkIcon />}
									/>
									<Button
										onClick={() => onSelect(form)}
										title="Open form"
										icon={<ChevronRightIcon />}
									/>
								</div>
							</Row>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default HomePage;
