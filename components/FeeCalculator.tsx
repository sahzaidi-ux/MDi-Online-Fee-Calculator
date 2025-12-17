import React, { useState, useMemo } from 'react';
import { UNIVERSITIES } from '../constants';
import { LeadFormData } from '../types';
import { ChevronDown, CheckCircle, GraduationCap, Building2, Calculator, Info, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

// --- EMAILJS CONFIGURATION ---
const EMAILJS_SERVICE_ID: string = 'service_wwubfgj';
const EMAILJS_TEMPLATE_ID: string = 'template_v0rlx2t';
const EMAILJS_PUBLIC_KEY: string = 'Zm2u8J-mbgFDC9i9K';

export const FeeCalculator: React.FC = () => {
  const [selectedUniId, setSelectedUniId] = useState<string>('');
  const [selectedDegreeId, setSelectedDegreeId] = useState<string>('');
  
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    mobile: '',
    city: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Derived state for the selected university object
  const selectedUni = useMemo(() => 
    UNIVERSITIES.find(u => u.id === selectedUniId), 
  [selectedUniId]);

  // Derived state for the selected degree object
  const selectedDegree = useMemo(() => 
    selectedUni?.degrees.find(d => d.id === selectedDegreeId), 
  [selectedUni, selectedDegreeId]);

  const handleUniChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUniId(e.target.value);
    setSelectedDegreeId(''); // Reset degree when uni changes
    setIsSubmitted(false); // Reset form state
  };

  const handleDegreeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDegreeId(e.target.value);
    setIsSubmitted(false); // Reset form state
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Format currency helper
  const formatMoney = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUni || !selectedDegree) return;

    setIsSending(true);

    // Prepare data for EmailJS
    // IMPORTANT: In your EmailJS Dashboard (https://dashboard.emailjs.com/), 
    // open your Email Template and add these variables to the email body:
    // {{name}}
    // {{email}}
    // {{mobile}}
    // {{city}}
    // {{program}}       <-- This will display the selected degree
    // {{university}}    <-- This will display the selected university
    // {{initial_payment}}
    // {{total_fee}}
    const templateParams = {
      to_email: 'online@mdi.com.pk',
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      city: formData.city,
      program: selectedDegree.name,
      university: selectedUni.name,
      initial_payment: formatMoney(selectedDegree.fees.initialPayment, selectedDegree.fees.currency),
      total_fee: selectedDegree ? formatMoney(
        selectedDegree.fees.initialPayment + (selectedDegree.fees.monthlyInstallment * selectedDegree.fees.numberOfInstallments),
        selectedDegree.fees.currency
      ) : ''
    };

    try {
      // Attempt to send via EmailJS
      if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID') {
         throw new Error("EmailJS keys not configured");
      }

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      setIsSubmitted(true);
    } catch (error) {
      console.error("EmailJS Error (Switching to fallback):", error);
      
      // Fallback: Mailto
      // This ensures the lead is not lost if the API limit is reached or keys are missing
      const subject = encodeURIComponent(`Information Request: ${selectedDegree.name} at ${selectedUni.name}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Mobile: ${formData.mobile}\n` +
        `City: ${formData.city}\n\n` +
        `Program: ${selectedDegree.name}\n` +
        `University: ${selectedUni.name}`
      );
      
      window.location.href = `mailto:online@mdi.com.pk?subject=${subject}&body=${body}`;
      setIsSubmitted(true);
    } finally {
      setIsSending(false);
    }
  };

  // Calculations for the chart
  const totalFee = selectedDegree 
    ? selectedDegree.fees.initialPayment + (selectedDegree.fees.monthlyInstallment * selectedDegree.fees.numberOfInstallments) 
    : 0;
  
  const initialPercent = selectedDegree ? (selectedDegree.fees.initialPayment / totalFee) * 100 : 0;
  
  // Create a conic gradient for the pie chart
  // Primary color (Yellow): #facc15 - A vibrant yellow for the initial payment
  // Secondary color (White/Blue tint): #dbeafe - A very light blue for the remaining balance
  const chartStyle = {
    background: `conic-gradient(#facc15 ${initialPercent}%, #dbeafe 0)`
  };

  return (
    <div className="bg-blue-600 text-white rounded-2xl shadow-xl border border-blue-500 overflow-hidden font-sans">
      
      {/* Header */}
      <div className="bg-blue-700 px-6 py-4 border-b border-blue-600 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="bg-white/10 text-white p-1.5 rounded-lg shadow-sm border border-white/10">
            <Calculator size={18} />
          </span>
          Tuition Fee Calculator
        </h2>
        {selectedDegree && (
           <span className="text-xs font-medium text-blue-100 bg-blue-800/50 px-2 py-1 rounded border border-blue-500/50">
             {selectedDegree.fees.currency} Currency
           </span>
        )}
      </div>

      <div className="p-6 space-y-6">
        
        {/* Selection Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors z-10">
              <Building2 size={16} />
            </div>
            <select
              value={selectedUniId}
              onChange={handleUniChange}
              className="w-full bg-white border border-blue-200 rounded-xl py-3 pl-10 pr-8 text-sm text-slate-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none appearance-none transition-all cursor-pointer shadow-sm"
            >
              <option value="" disabled>Select University</option>
              {UNIVERSITIES.map(uni => (
                <option key={uni.id} value={uni.id}>{uni.name}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
              <ChevronDown size={14} />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors z-10">
              <GraduationCap size={16} />
            </div>
            <select
              value={selectedDegreeId}
              onChange={handleDegreeChange}
              disabled={!selectedUniId}
              className={`w-full border rounded-xl py-3 pl-10 pr-8 text-sm outline-none appearance-none transition-all shadow-sm
                ${!selectedUniId 
                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-white border-blue-200 text-slate-800 focus:ring-2 focus:ring-blue-400 cursor-pointer'
                }`}
            >
              <option value="" disabled>Select Degree Program</option>
              {selectedUni?.degrees.map(degree => (
                <option key={degree.id} value={degree.id}>{degree.name}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
              <ChevronDown size={14} />
            </div>
          </div>
        </div>

        {/* Results Section */}
        {selectedUni && selectedDegree && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out">
            
            {/* Single Line Header */}
            <div className="mb-5 pb-4 border-b border-blue-500/50">
               <h3 className="text-lg font-bold text-white leading-tight">
                 {selectedDegree.name} <span className="text-blue-300 font-normal mx-1">•</span> <span className="text-blue-100 text-base font-semibold">{selectedUni.name}</span>
               </h3>
            </div>

            {/* Compact Metrics + Chart Row */}
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              
              {/* Metrics Grid (2x2) */}
              <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p className="text-xs text-blue-200 uppercase tracking-wide font-medium mb-0.5">Initial Payment</p>
                  <p className="text-lg font-bold text-white">
                    {formatMoney(selectedDegree.fees.initialPayment, selectedDegree.fees.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-200 uppercase tracking-wide font-medium mb-0.5">Monthly</p>
                  <p className="text-lg font-bold text-white">
                    {formatMoney(selectedDegree.fees.monthlyInstallment, selectedDegree.fees.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-200 uppercase tracking-wide font-medium mb-0.5">Duration</p>
                  <p className="text-lg font-bold text-white">
                    {selectedDegree.fees.numberOfInstallments} <span className="text-xs font-normal text-blue-200">Months</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-200 uppercase tracking-wide font-medium mb-0.5">Total Fee</p>
                  <p className="text-lg font-bold text-white">
                    {formatMoney(totalFee, selectedDegree.fees.currency)}
                  </p>
                </div>
              </div>

              {/* Pie Chart Visualization */}
              <div className="shrink-0 flex items-center justify-center sm:border-l sm:border-blue-500/50 sm:pl-6">
                 <div className="flex items-center gap-3">
                   <div className="relative w-16 h-16 rounded-full shadow-lg ring-2 ring-blue-500" style={chartStyle}>
                      <div className="absolute inset-2 bg-blue-600 rounded-full flex items-center justify-center">
                         <span className="text-[10px] font-bold text-white">{Math.round(initialPercent)}%</span>
                      </div>
                   </div>
                   <div className="flex flex-col justify-center space-y-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-sm"></div>
                        <span className="text-xs text-blue-100">Initial</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-100 shadow-sm"></div>
                        <span className="text-xs text-blue-200">Remaining</span>
                      </div>
                   </div>
                 </div>
              </div>
            </div>

            {/* Lead Capture Form - White Container */}
            <div className="bg-white rounded-xl p-5 shadow-lg border border-blue-500/20">
              <div className="mb-4 flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-full text-blue-600 shrink-0">
                  <Info size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Ready to start?
                  </h4>
                  <p className="text-xs text-slate-500">Enter your details to receive the full brochure and application guide.</p>
                </div>
              </div>

              {isSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-6 text-center animate-in zoom-in duration-300">
                  <div className="mx-auto bg-emerald-100 text-emerald-600 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle size={24} />
                  </div>
                  <h5 className="text-emerald-800 font-bold mb-1">Request Sent!</h5>
                  <p className="text-xs text-emerald-600">
                     {EMAILJS_SERVICE_ID === 'SERVICE_ID' 
                      ? "Opening email client... (Configure EmailJS to send silently)" 
                      : "We have received your details and will contact you shortly."}
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline"
                  >
                    Start Over
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Hidden fields for University and Program */}
                  {/* These are technically sent via JS, but including them in the DOM ensures they exist as form data conceptually */}
                  <input type="hidden" name="university" value={selectedUni.name} />
                  <input type="hidden" name="program" value={selectedDegree.name} />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={isSending}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                    />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isSending}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="tel"
                      name="mobile"
                      required
                      placeholder="Mobile Number"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      disabled={isSending}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                    />
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={isSending}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2.5 rounded-lg text-sm transition-all shadow-md shadow-blue-200 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Sending...
                      </>
                    ) : (
                      "Request Information"
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="text-center pt-3">
              <p className="text-[10px] text-blue-200/80">
                Fees subject to change. © MDi Online.
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};