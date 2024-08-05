import { Card } from "@repo/ui/card";

interface Transaction {
	time: Date;
	amount: number;
	fromUserId: number;
	toUserId: number;
}

interface P2PTransferProps {
	transactions: Transaction[];
	currentId: number;
}

export function P2PTransfer({
	transactions,
	currentId,
}: P2PTransferProps) {
	if (!transactions.length) {
		return (
			<Card title="Recent Transactions">
				<div className="text-center pb-8 pt-8">No Recent transactions</div>
			</Card>
		);
	}
    
	return (
		<Card title="Recent Transactions">
			<div className="pt-2">
				{transactions.map((t, index) => (
					<div
						key={index}
						className={`flex justify-between mb-4 p-2 rounded ${currentId === t.toUserId ? 'bg-green-200' : 'bg-red-200'}`}
					>
						<div>
							<div className="text-sm">
								{currentId === t.toUserId ? "Received INR from" : "Sent INR to "} {"#"+t.fromUserId}
							</div>
							<div className="text-slate-600 text-xs">
								{new Date(t.time).toDateString()}
							</div>
						</div>
						<div className="flex flex-col justify-center">
                        {currentId === t.toUserId ? "+" : "-"} Rs {t.amount / 100}
						</div>
					</div>
				))}
			</div>
		</Card>
	);
}
