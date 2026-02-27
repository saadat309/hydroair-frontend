import { redirect } from 'next/navigation';

export default function SupportTicketRedirect({ params }) {
  redirect('/en/support/ticket/' + params.ticketId);
}
