"use client"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import AlertDestructive from "./AlertDestructive";

interface PaymentsProps {
  pageNumber: number;
  amount: number;
}

/**
 * Fetches payments from the API.
 * @param {Object} options - The options for fetching payments.
 * @param {number} options.pageNumber - The page number to fetch.
 * @param {number} options.amount - The amount of payments to fetch.
 * @returns {Promise<Payment[]>} - A promise that resolves to an array of payments.
 * @throws {Error} - If the API request fails.
 */
export async function fetchPayments(options: { pageNumber: number, amount: number }): Promise<Payment[]> {
  const { pageNumber, amount } = options;

  const response = await fetch(`/api/payments?amount=${amount}&page=${pageNumber}`, { method: 'GET' });
  if (!response.ok) {
    throw new Error("Failed to fetch payments");
    return []
  }

  const data: Payment[] = await response.json();
  return data.sort((a, b) => new Date(b.time).valueOf() - new Date(a.time).valueOf());
}

/**
 * Represents a payment.
 * @typedef {Object} Payment
 * @property {string} id - The ID of the payment.
 * @property {string} sender - The ID of the sender.
 * @property {string} sender_name - The name of the sender.
 * @property {string} receiver_name - The name of the receiver.
 * @property {string} receiver - The ID of the receiver.
 * @property {number} amount - The amount of the payment.
 * @property {string} time - The time of the payment.
 */


interface Payment {
    id: string;
    sender: string;
    sender_name: string;
    receiver_name: string;
    receiver: string;
    amount: number;
    time: string;
  }
  
  interface PaymentsProps {
    paymentsData: Payment[];
  }
  
export default function PaymentsList({ paymentsData }: PaymentsProps) {
    const [payments, setPayments] = useState<Payment[]>(paymentsData);
    const [page, setPage] = useState<number>(1);
    const [error, setError] = useState<string>("");

    const handleFetchPayments = async (pageNumber: number) => {
      try {
        const response = await fetchPayments({ pageNumber, amount: 10 });
        if (!response || response.length === 0) {
          throw new Error("No payments found");
        }
        setPayments(response);
        setError("");
      } catch (error) {
        console.error("Failed to fetch payments:", error);
        setError("Failed to fetch payments");
      }
    };

    const handleNextPage = () => {
      setPage(page + 1);
      handleFetchPayments(page + 1);
    };

    const handlePrevPage = () => {
      if (page > 1) {
        setPage(page - 1);
        handleFetchPayments(page - 1);
      }
    };

    useEffect(() => {
      handleFetchPayments(page);
      console.log(payments);
    }, [page]);

    return (
        <div className="flex flex-col items-center min-h-screen h-screen overflow-scroll p-8 border-[1px]">
        <h1 className="text-4xl font-extrabold mb-8 dark:text-white text-gray-800">Payments</h1>
        <div className="flex space-x-4 mb-8 items-center">
          <Button onClick={handlePrevPage} disabled={page === 1}>
            Previous
          </Button>
          <span className="font-bold bg-gray-200 p-2 dark:bg-gray-900 border-2 rounded-lg pl-4 pr-4 text-nowrap">Page {page}</span>
          <Button onClick={handleNextPage}>
            Next
          </Button>
        
        </div>
        
        <ul className="w-full max-w-3xl space-y-4">
          
          {payments.map((payment) => (
            <li key={payment.id} className="p-4 rounded-lg shadow-md">
              <Payments payment={payment} />
            </li>
          ))}
        </ul>
        {error && <AlertDestructive title="Error" description={error + ", Perchance the API is down? ask ihyd"} />}
      </div>
    );
  }


function Payments({ payment }: { payment: Payment }) {
    const [showId, setShowId] = useState(false);
  
    return (
      <div className="rounded-lg shadow-md">

        <Table className="border-2 rounded-lg">
          <TableBody>
            <TableRow className="w-min" onClick={() => setShowId(!showId)}>
              <TableCell className="font-bold">Advanced Mode: {showId ? "ON" : "OFF"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">Sender</TableCell>
              <TableCell>{payment.sender_name}</TableCell>
              {showId && <TableCell>ID: {payment.sender}</TableCell>}
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">Receiver</TableCell>
              <TableCell>{payment.receiver_name}</TableCell>
              {showId && <TableCell>ID: {payment.receiver}</TableCell>}
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">Amount</TableCell>
              <TableCell>{payment.amount.toLocaleString()} Robux</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">Time</TableCell>
              <TableCell>{payment.time}</TableCell>
            </TableRow>
            {showId && <TableRow>
              <TableCell className="font-bold">Payment ID</TableCell>
              <TableCell>{payment.id}</TableCell>
            </TableRow>}
          </TableBody>
        </Table>
      </div>
    );
  }