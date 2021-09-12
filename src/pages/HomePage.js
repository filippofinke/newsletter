import React, { useState, useEffect } from "react";
import {
	ChevronRightIcon,
	LinkIcon,
	PlusIcon,
	TrashIcon,
	UsersIcon,
} from "@heroicons/react/outline";
import toast, { Toaster } from "react-hot-toast";

import Header from "./../components/Header/Header";
import Row from "./../components/Row/Row";
import Badge from "./../components/Badge/Badge";
import Button from "./../components/Button/Button";
import Input from "./../components/Input/Input";

const HomePage = ({ onSelect }) => {
	let [forms, setForms] = useState(null);
	let [form, setForm] = useState("");

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

	const deleteForm = (form) => {
		if (
			window.confirm(`Are you sure you want to delete the ${form.name} form?`)
		) {
			let promise = fetch("/form", {
				body: JSON.stringify(form),
				headers: {
					"Content-Type": "application/json",
				},
				method: "DELETE",
			}).then((r) => {
				setForms((old) => {
					return old.filter((f) => f.id !== form.id);
				});
			});

			toast.promise(promise, {
				loading: "Deleting form...",
				success: <b>Form deleted!</b>,
				error: <b>Failed to delete form!</b>,
			});
		}
	};

	const createForm = () => {
		let promise = fetch("/form", {
			method: "POST",
			body: JSON.stringify({ name: form }),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((r) => r.json())
			.then((r) => {
				setForm("");
				setForms((old) => {
					r.emails = 0;
					r.created_at = new Date().toDateString();
					return [r, ...old];
				});
			});

		toast.promise(promise, {
			loading: "Creating form...",
			success: <b>Form created!</b>,
			error: <b>Failed to create a new form!</b>,
		});
	};

	return (
		<div className="home-page">
			<Toaster position="bottom-center" />
			<Header>
				<h2>Your forms</h2>
			</Header>
			<Input
				type="text"
				placeholder="New form"
				value={form}
				onChange={(event) => setForm(event.target.value)}
				icon={<PlusIcon />}
				title="Create a new form"
				onEnter={createForm}
				onClick={createForm}
			/>
			{forms && (
				<div className="forms">
					{forms.map((form) => {
						return (
							<Row key={form.id}>
								<Badge text={new Date(form.created_at).toDateString()} />
								<Badge icon={<UsersIcon />} text={form.emails} />
								<span className="name">{form.name}</span>
								<div className="actions">
									<Button
										onClick={() => deleteForm(form)}
										title="Delete form"
										icon={<TrashIcon />}
									/>
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
