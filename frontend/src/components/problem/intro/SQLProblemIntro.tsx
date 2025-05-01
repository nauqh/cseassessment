import Image from "next/image";
import Link from "next/link";

export default function SQLProblemIntro() {
	return (
		<div className="bg-muted p-6 rounded-lg space-y-6">
			<p>
				This section asks you to submit a <b>single query</b> to answer
				questions related to the Northwind database.
			</p>
			<div className="space-y-4">
				<p>
					The Northwind database contains the sales data for a
					fictitious company called{" "}
					<Link
						href="https://github.com/yugabyte/yugabyte-db/wiki/Northwind-Sample-Database"
						className="text-blue-600 hover:text-blue-800 underline"
						target="_blank"
					>
						Northwind Traders
					</Link>
					, which imports and exports specialty foods from around the
					world. The dataset consists of 13 tables and the table
					relationships are shown in the ERD below.
				</p>

				<div className="my-6">
					<Image
						src="https://camo.githubusercontent.com/a0a377ee0279de8567c9fcb6492e04c76cde6bac5aeb04e2acf5b69b62fd9184/68747470733a2f2f7374617469632e7061636b742d63646e2e636f6d2f70726f64756374732f393738313738323137303930372f67726170686963732f30393037454e5f30325f30392e6a7067"
						alt="Northwind Database Schema"
						width={800}
						height={600}
						className="rounded-lg border-2 border-gray-200"
					/>
				</div>

				<p>The dataset contains the following:</p>
				<ul className="list-disc list-inside space-y-2 ml-4">
					<li>
						<strong>Suppliers:</strong> Suppliers and vendors of
						Northwind
					</li>
					<li>
						<strong>Customers:</strong> Customers who buy products
						from Northwind
					</li>
					<li>
						<strong>Employees:</strong> Employee details of
						Northwind traders
					</li>
					<li>
						<strong>Products:</strong> Product information
					</li>
					<li>
						<strong>Shippers:</strong> The details of the shippers
						who ship the products from the traders to the
						end-customers
					</li>
					<li>
						<strong>Orders</strong> and{" "}
						<strong>Order Details:</strong> Sales Order transactions
						taking place between the customers & the company
					</li>
				</ul>

				<div className="bg-blue-50 border-l-4 border-blue-200 p-4 mt-6 space-y-3">
					<p className="font-semibold text-blue-700">
						IMPORTANT NOTES
					</p>
					<ul className="space-y-2">
						<li>
							<strong>NOTE 1:</strong> The name of the table{" "}
							<strong>"Order Details"</strong> contains a space.
							Always include it in a double quotation mark{" "}
							<code>""</code>.
						</li>
						<li>
							<strong>NOTE 2:</strong> You can view the DB Schema
							via this{" "}
							<Link
								href="https://camo.githubusercontent.com/a0a377ee0279de8567c9fcb6492e04c76cde6bac5aeb04e2acf5b69b62fd9184/68747470733a2f2f7374617469632e7061636b742d63646e2e636f6d2f70726f64756374732f393738313738323137303930372f67726170686963732f30393037454e5f30325f30392e6a7067"
								className="text-blue-600 hover:text-blue-800 underline"
								target="_blank"
							>
								link
							</Link>
							. We will provide the case study and ERD when you
							are attempting the questions.
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
