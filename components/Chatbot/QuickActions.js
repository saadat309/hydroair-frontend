'use client';

import { ShoppingBag, HelpCircle, Ticket, Search } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function QuickActions({ onAction }) {
  const { t } = useTranslation();

  const actions = [
    { id: 'how-to-order', icon: <ShoppingBag className="w-4 h-4" />, label: t('chat.actions.howToOrder') },
    { id: 'view-products', icon: <Search className="w-4 h-4" />, label: t('chat.actions.viewProducts') },
    { id: 'create-ticket', icon: <Ticket className="w-4 h-4" />, label: t('chat.actions.createTicket') },
    { id: 'check-ticket', icon: <HelpCircle className="w-4 h-4" />, label: t('chat.actions.checkStatus') },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-4 pt-0">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onAction(action.id)}
          className="flex items-center gap-2 bg-muted/50 hover:bg-primary/10 hover:text-primary px-3 py-1.5 rounded-full text-xs font-medium transition-all border border-transparent hover:border-primary/20"
        >
          {action.icon}
          {action.label}
        </button>
      ))}
    </div>
  );
}
