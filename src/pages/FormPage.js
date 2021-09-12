import "./FormPage.css";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Flag from "react-world-flags";
import LazyLoad from "react-lazyload";
import {
	ClipboardIcon,
	ChevronLeftIcon,
	DownloadIcon,
	TrashIcon,
	AtSymbolIcon,
} from "@heroicons/react/outline";
import Header from "./../components/Header/Header";
import Badge from "./../components/Badge/Badge";
import Row from "./../components/Row/Row";
import Button from "./../components/Button/Button";

const FormPage = ({ form, onClose }) => {
	let [emails, setEmails] = useState(null);
	let [domains, setDomains] = useState({});
	let [filter, setFilter] = useState("");

	useEffect(() => {
		fetch(`/form/${form.id}`)
			.then((r) => r.json())
			.then((emails) => {
				setEmails(emails);
			});
	}, [form]);

	useEffect(() => {
		if (emails) {
			let domains = {};
			for (let { email } of emails) {
				let domain = email.split("@")[1];
				if (domain in domains) {
					domains[domain] += 1;
				} else {
					domains[domain] = 1;
				}
			}
			setDomains(domains);
		}
	}, [emails]);

	const handleDownload = () => {
		let promise = new Promise((resolve) => {
			let csv = "Email,Country,Created At\n";
			for (let { email, country, created_at } of emails) {
				csv += `${email},${country || ""},${created_at}\n`;
			}
			let blob = new Blob([csv], {
				type: "text/csv;charset=utf-8",
			});

			let a = document.createElement("a");
			a.style.display = "none";
			a.href = URL.createObjectURL(blob);
			a.download = "export.csv";
			document.body.append(a);
			a.click();
			resolve();
		});

		toast.promise(promise, {
			loading: "Creating csv file...",
			success: <b>File downloaded!</b>,
		});
	};

	const deleteEmail = (email) => {
		let promise = fetch(`/form/${form.id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email }),
		});

		promise.then(() => {
			setEmails((old) => {
				let copy = [...old];
				return copy.filter((e) => e.email !== email);
			});
		});

		toast.promise(promise, {
			loading: "Removing email...",
			success: <b>Email removed!</b>,
			error: <b>Failed to remove the email!</b>,
		});
	};

	const copy = (email) => {
		toast.promise(navigator.clipboard.writeText(email), {
			loading: "Saving to clipboard...",
			success: <b>Email copied!</b>,
			error: <b>Failed to copy email!</b>,
		});
	};

	return (
		<div className="form-page">
			<Toaster position="bottom-center" />
			<Header>
				<Button icon={<ChevronLeftIcon />} onClick={onClose} title="Go back" />
				<h2>{form.name}</h2>
				<Button
					icon={<DownloadIcon />}
					onClick={handleDownload}
					title="Export emails as .csv"
				/>
			</Header>

			<div className="badges">
				{Object.entries(domains).map(([key, value]) => {
					return (
						<Badge key={key} icon={<AtSymbolIcon />} text={`${key} ${value}`} />
					);
				})}
			</div>
			{emails && (
				<div className="emails">
					<input
						type="text"
						placeholder="Search"
						value={filter}
						onChange={({ target }) => {
							setFilter(target.value.toLowerCase().trim());
						}}
					/>
					{emails
						.filter(({ email }) => (filter ? email.includes(filter) : true))
						.map(({ email, country, created_at }) => {
							return (
								<LazyLoad key={email} height={50}>
									<Row>
										<Badge text={new Date(created_at).toLocaleDateString()} />
										{country && (
											<Badge icon={<Flag code={country} />} text={country} />
										)}
										<span>{email}</span>
										<div className="actions">
											<Button
												icon={<ClipboardIcon />}
												onClick={() => copy(email)}
												title="Copy to clipboard"
											/>
											<Button
												icon={<TrashIcon />}
												onClick={() => deleteEmail(email)}
												title="Remove email from list"
											/>
										</div>
									</Row>
								</LazyLoad>
							);
						})}
				</div>
			)}
		</div>
	);
};

export default FormPage;
