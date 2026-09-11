import React, { useState } from 'react';
import { EmailNotification } from '../types';
import { formatINR } from '../utils/formatters';
import { 
  Mail, 
  CheckCircle2, 
  Send, 
  Inbox, 
  ExternalLink, 
  Clock, 
  Truck, 
  ShieldCheck, 
  Smartphone,
  PhoneCall,
  RotateCw,
  Eye
} from 'lucide-react';

interface EmailNotificationCenterProps {
  emails: EmailNotification[];
  onResendEmail: (emailId: string) => void;
}

export const EmailNotificationCenter: React.FC<EmailNotificationCenterProps> = ({
  emails,
  onResendEmail,
}) => {
  const [selectedEmailId, setSelectedEmailId] = useState<string>(
    emails.length > 0 ? emails[0].id : ''
  );
  const [resendingId, setResendingId] = useState<string | null>(null);

  const selectedEmail =
    emails.find((e) => e.id === selectedEmailId) || (emails.length > 0 ? emails[0] : null);

  const handleResend = (id: string) => {
    setResendingId(id);
    setTimeout(() => {
      onResendEmail(id);
      setResendingId(null);
    }, 800);
  };

  return (
    <div id="email-notification-center" className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Automated SMTP & Webhook Dispatcher
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              Port 587 SSL Active
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-1">
            Customer Email Notifications System
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Real-time automated transaction dispatch for order confirmations, GST invoices, and Coimbatore fleet tracking updates.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 text-neutral-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {emails.length} Emails Dispatched
          </span>
        </div>
      </div>

      {/* 2-Column Interface: Email List on Left, Interactive HTML Inbox Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Email Outbox Feed */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 px-1">
            Dispatch Queue & Outbox Log
          </div>

          <div className="space-y-2.5">
            {emails.map((email) => {
              const isSelected = selectedEmail?.id === email.id;
              const isOrderConfirmation = email.type === 'order_confirmation';

              return (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmailId(email.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-md ring-2 ring-neutral-900/10'
                      : 'bg-white hover:bg-neutral-50 text-neutral-900 border-neutral-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isSelected
                          ? 'bg-neutral-800 text-amber-300'
                          : isOrderConfirmation
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-blue-50 text-blue-800'
                      }`}
                    >
                      {isOrderConfirmation ? 'Order Confirmed' : 'Tracking Dispatch'}
                    </span>
                    <span
                      className={`text-[11px] font-mono ${
                        isSelected ? 'text-neutral-400' : 'text-neutral-400'
                      }`}
                    >
                      {email.sentAt}
                    </span>
                  </div>

                  <h4
                    className={`font-semibold text-xs leading-snug truncate ${
                      isSelected ? 'text-white' : 'text-neutral-900'
                    }`}
                  >
                    {email.subject}
                  </h4>

                  <p
                    className={`text-[11px] line-clamp-1 mt-1 ${
                      isSelected ? 'text-neutral-300' : 'text-neutral-500'
                    }`}
                  >
                    To: {email.recipient}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-100/20 text-[10px]">
                    <span
                      className={`flex items-center gap-1 ${
                        isSelected ? 'text-emerald-400' : 'text-emerald-700 font-medium'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" /> Status: {email.status}
                    </span>
                    <span
                      className={`font-mono ${
                        isSelected ? 'text-neutral-400' : 'text-neutral-400'
                      }`}
                    >
                      ID: {email.orderId}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Realistic HTML Email Inbox Preview */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
          {selectedEmail ? (
            <div>
              {/* Mail client browser chrome bar */}
              <div className="p-4 bg-neutral-100 border-b border-neutral-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-neutral-500 font-mono text-[11px] ml-2">
                    Customer Mail Inbox Preview
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleResend(selectedEmail.id)}
                  disabled={resendingId === selectedEmail.id}
                  className="px-3 py-1 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-700 font-medium text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <RotateCw
                    className={`w-3 h-3 ${
                      resendingId === selectedEmail.id ? 'animate-spin' : ''
                    }`}
                  />
                  <span>Resend Notification</span>
                </button>
              </div>

              {/* Email Envelope details */}
              <div className="p-4 sm:p-6 border-b border-neutral-100 bg-neutral-50/60 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Subject:</span>
                  <span className="font-bold text-neutral-900 text-sm">
                    {selectedEmail.subject}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">From:</span>
                  <span className="font-medium text-neutral-800">
                    Burhani Hardware Mart &lt;orders@burhanihardware.in&gt;
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">To:</span>
                  <span className="font-mono text-neutral-800">
                    {selectedEmail.recipient}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Date:</span>
                  <span className="font-mono text-neutral-500">
                    {selectedEmail.sentAt} (IST)
                  </span>
                </div>
              </div>

              {/* Rendered Email Body Content */}
              <div className="p-6 sm:p-8 bg-neutral-50">
                <div className="max-w-md mx-auto bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-5 text-neutral-800">
                  {/* Brand Header inside Email */}
                  <div className="text-center border-b pb-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 block">
                      Huzaifa Square · Coimbatore
                    </span>
                    <h3 className="text-lg font-extrabold tracking-tight text-neutral-900 mt-0.5">
                      BURHANI HARDWARE MART
                    </h3>
                    <p className="text-[11px] text-neutral-500">
                      Plumbing, Sanitaryware & Hardware Solutions
                    </p>
                  </div>

                  {/* Salutation & Status message */}
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900">
                      Hello {selectedEmail.orderDetails.customerName},
                    </h4>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      {selectedEmail.type === 'order_confirmation' ? (
                        <>
                          Thank you for choosing Burhani Hardware Mart! Your order has been registered and is being prepared for dispatch from our Mill Road warehouse.
                        </>
                      ) : (
                        <>
                          Good news! Your hardware consignment has been updated to <strong>{selectedEmail.orderStatusSnapshot}</strong>. Our delivery vehicle is on route.
                        </>
                      )}
                    </p>
                  </div>

                  {/* Order Spec Snapshot in Email */}
                  <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Order ID:</span>
                      <span className="font-mono font-bold text-neutral-900">
                        {selectedEmail.orderId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Consignment Waybill:</span>
                      <span className="font-mono font-medium text-neutral-800">
                        {selectedEmail.orderDetails.trackingNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Delivery Address:</span>
                      <span className="text-neutral-800 text-right max-w-[200px] truncate">
                        {selectedEmail.orderDetails.address}
                      </span>
                    </div>
                  </div>

                  {/* Items List in ₹ INR */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">
                      Purchased Items
                    </span>
                    <div className="space-y-1.5 text-xs divide-y divide-neutral-100">
                      {selectedEmail.orderDetails.itemsList.map((item, i) => (
                        <div key={i} className="flex justify-between pt-1.5">
                          <span className="text-neutral-700">
                            {item.qty}x {item.name}
                          </span>
                          <span className="font-mono font-semibold text-neutral-900">
                            {formatINR(item.price * item.qty)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-neutral-300 mt-3 pt-2 flex justify-between font-bold text-sm text-neutral-950">
                      <span>Total Amount Paid:</span>
                      <span className="font-mono">
                        {formatINR(selectedEmail.orderDetails.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Direct Tracking CTA in Email */}
                  <div className="pt-2">
                    <div className="w-full py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs text-center shadow-xs">
                      Live Delivery Tracking Enabled
                    </div>
                  </div>

                  {/* Support Footer inside email */}
                  <div className="text-[10px] text-neutral-500 border-t pt-3 text-center space-y-1">
                    <p>
                      Store Location: 14/2, Mill Rd, Sukrawar Pettai, Town Hall, Coimbatore 641001
                    </p>
                    <p>
                      Phone Hotline: <strong>09843128546</strong> | Mon-Sat 9:30 AM - 7:30 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-neutral-400">
              <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No email selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
