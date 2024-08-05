import { getServerSession } from "next-auth";
import { SendCard } from "../../../components/SendCard";
import { getBalance } from "../transfer/page";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { BalanceCard } from "../../../components/BalanceCard";
import { P2PTransfer } from "../../../components/P2Ptransfer";

export default async function Home() {
    const balance = await getBalance();
    const transactions = await getP2PTransfer();

    return (
        <div className="w-full grid grid-cols-12 ">
            <div className="col-span-4">
                <SendCard />
            </div>
            
            <div className="col-span-8 flex flex-col  justify-center space-y-4 mr-10">
                <BalanceCard amount={balance.amount} locked={balance.locked} />
                <P2PTransfer transactions={transactions} currentId={balance.userId} />
            </div>
        </div>
    );
}

async function getP2PTransfer() {
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);

    if (!userId) {
        throw new Error("User ID is undefined");
    }

    // Fetch transactions where the user is the recipient
    const txns = await prisma.p2pTransfer.findMany({
        where: {
            toUserId: userId,
        },
    });
    console.log(txns);
    // Fetch transactions where the user is the sender
    const froms = await prisma.p2pTransfer.findMany({
        where: {
            fromUserId: userId,
        },
    });

    console.log(froms);

    // Combine both arrays and map the results
    const allTransactions = [...txns, ...froms].map((t) => ({
        time: t.timestamp,
        amount: t.amount,
        fromUserId: t.fromUserId,
        toUserId: t.toUserId,
    }));

    return allTransactions;
}
